"""
Sentinel - Project intelligence backend.

All third-party integrations (LLM, DB, auth, email, billing, alerts) read from
environment variables so they can be swapped post-deployment with zero code
changes.
"""

from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import anthropic
import os
import json
import logging
import uuid
import re
from pathlib import Path
from pydantic import BaseModel, Field
from typing import Optional, List

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ---------------------------------------------------------------------------
# Environment-driven configuration.
# ---------------------------------------------------------------------------
LLM_MODEL = os.environ.get("LLM_MODEL", "claude-sonnet-4-5")
LLM_API_KEY = os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")

# --- Optional integrations (swap at deploy by setting env vars) -------------
# MONGO_URL = os.environ.get("MONGO_URL")
# DB_NAME = os.environ.get("DB_NAME")
# RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
# STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
# SLACK_WEBHOOK_URL = os.environ.get("SLACK_WEBHOOK_URL")
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("sentinel")

app = FastAPI(title="Sentinel API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------------------------------------------------------
class ScopeCheckIn(BaseModel):
    task_name: str
    task_description: Optional[str] = ""
    sow: str


class ScopeCheckOut(BaseModel):
    verdict: str  # IN_SCOPE | OUT_OF_SCOPE | GREY_AREA
    reason: str


class StructureScopeIn(BaseModel):
    sow: str


class StructuredScope(BaseModel):
    included_items: List[str] = Field(default_factory=list)
    excluded_items: List[str] = Field(default_factory=list)
    revision_count: Optional[int] = None
    timeline: Optional[str] = None
    total_hours: Optional[float] = None


class ChangeOrderIn(BaseModel):
    project_name: str
    client_name: str
    task_name: str
    task_description: Optional[str] = ""
    original_sow: str
    estimated_hours: float
    hourly_rate: float
    timeline_impact_days: Optional[int] = None


class ChangeOrderOut(BaseModel):
    email: str


# ---------- Prompts ---------------------------------------------------------
SCOPE_SYSTEM = (
    "You are a project manager reviewing whether a task falls within an agreed "
    "scope of work. Given the SOW and the task, respond with exactly one of: "
    "IN_SCOPE, OUT_OF_SCOPE, or GREY_AREA followed by exactly one sentence "
    "explaining why. Be strict — if it wasn't explicitly agreed it's "
    "OUT_OF_SCOPE."
)

CHANGE_ORDER_SYSTEM = (
    "You are a professional project manager writing a change order email on "
    "behalf of an agency or freelancer. Firm but relationship-preserving. "
    "Reference the original agreement, state what was added, give cost and "
    "timeline impact, request approval. Never apologetic. Never aggressive. "
    "Professional, clear, direct.\n\n"
    "CRITICAL: Use the literal CLIENT name and PROJECT name provided in the "
    "user message. Never output placeholders like [Client Name], [Your Name], "
    "[Date], or any bracketed substitution token. Sign the email simply with "
    "'Best regards,' on its own line followed by 'Project Team'."
)

STRUCTURE_SYSTEM = (
    "Parse this scope of work and return structured JSON with: "
    "included_items (array of strings), excluded_items (array of strings), "
    "revision_count (number or null), timeline (string or null), "
    "total_hours (number or null). Be precise. Return JSON only — no prose, "
    "no code fences."
)


# ---------- LLM helper ------------------------------------------------------
def _call_claude(system: str, prompt: str) -> str:
    if not LLM_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="LLM API key not configured. Set ANTHROPIC_API_KEY.",
        )
    client = anthropic.Anthropic(api_key=LLM_API_KEY)
    message = client.messages.create(
        model=LLM_MODEL,
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": prompt}]
    )
    return message.content[0].text.strip()


# ---------- Routes ----------------------------------------------------------
@api_router.get("/")
async def root():
    return {"service": "sentinel", "status": "ok"}


@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "llm_configured": bool(LLM_API_KEY),
        "llm_model": LLM_MODEL,
    }


@api_router.post("/check-scope", response_model=ScopeCheckOut)
async def check_scope(payload: ScopeCheckIn):
    if not payload.sow.strip():
        return ScopeCheckOut(
            verdict="GREY_AREA",
            reason="No scope of work has been locked yet — verdict requires a locked SOW.",
        )

    prompt = (
        f"SCOPE OF WORK:\n{payload.sow}\n\n"
        f"TASK NAME: {payload.task_name}\n"
        f"TASK DESCRIPTION: {payload.task_description or '(none)'}\n\n"
        "Respond now with the verdict and reason."
    )
    try:
        raw = _call_claude(SCOPE_SYSTEM, prompt)
    except Exception as exc:
        logger.exception("Claude scope check failed")
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}")

    verdict = "GREY_AREA"
    for v in ("OUT_OF_SCOPE", "IN_SCOPE", "GREY_AREA"):
        if raw.upper().startswith(v) or f" {v}" in raw.upper()[:80]:
            verdict = v
            break
    reason = re.sub(r"^[\s:\-—]+", "", raw[len(verdict):]).strip() if raw.upper().startswith(verdict) else raw
    if not reason:
        reason = raw
    return ScopeCheckOut(verdict=verdict, reason=reason[:400])


@api_router.post("/structure-scope", response_model=StructuredScope)
async def structure_scope(payload: StructureScopeIn):
    if not payload.sow.strip():
        raise HTTPException(status_code=400, detail="sow is required")

    try:
        raw = _call_claude(STRUCTURE_SYSTEM, payload.sow)
    except Exception as exc:
        logger.exception("Claude structuring failed")
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}")

    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw.strip(), flags=re.IGNORECASE)
    try:
        data = json.loads(cleaned)
    except Exception:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if not match:
            raise HTTPException(status_code=502, detail="Could not parse JSON from LLM.")
        data = json.loads(match.group(0))

    return StructuredScope(
        included_items=data.get("included_items") or [],
        excluded_items=data.get("excluded_items") or [],
        revision_count=data.get("revision_count"),
        timeline=data.get("timeline"),
        total_hours=data.get("total_hours"),
    )


@api_router.post("/generate-change-order", response_model=ChangeOrderOut)
async def generate_change_order(payload: ChangeOrderIn):
    cost = round(payload.estimated_hours * payload.hourly_rate, 2)
    timeline_line = (
        f"Estimated timeline impact: +{payload.timeline_impact_days} business days."
        if payload.timeline_impact_days
        else "Estimated timeline impact: to be confirmed once approved."
    )
    prompt = (
        f"PROJECT: {payload.project_name}\n"
        f"CLIENT: {payload.client_name}\n\n"
        f"ORIGINAL SCOPE (verbatim):\n{payload.original_sow}\n\n"
        f"NEW REQUEST OUTSIDE SCOPE:\n"
        f"  Task: {payload.task_name}\n"
        f"  Description: {payload.task_description or '(none)'}\n"
        f"  Estimated effort: {payload.estimated_hours} hours\n"
        f"  Rate: ${payload.hourly_rate}/hr\n"
        f"  Additional cost: ${cost:,.2f}\n"
        f"  {timeline_line}\n\n"
        "Write the full change order email now. Plain text, ready to send. "
        "Include subject line at the top as 'Subject: ...'."
    )
    try:
        text = _call_claude(CHANGE_ORDER_SYSTEM, prompt)
    except Exception as exc:
        logger.exception("Claude change order failed")
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}")
    return ChangeOrderOut(email=text)


# ---------------------------------------------------------------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exc_handler(_request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
