"""Backend tests for Sentinel API.

Covers:
- /api/health
- /api/check-scope (IN_SCOPE, OUT_OF_SCOPE, GREY_AREA defaults)
- /api/structure-scope
- /api/generate-change-order
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://scope-sentinel.preview.emergentagent.com").rstrip("/")

LUMIERE_SOW = """Lumière Brand Website — Statement of Work.
Deliverables: Homepage redesign, About page, Services page, Contact form,
mobile-responsive layouts, integration with existing CMS, two rounds of
revisions, project completion within 4 weeks (40 hours total).
Excluded: e-commerce functionality, chatbots, custom animations beyond
default fade transitions, blog section, third-party integrations beyond CMS.
"""


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health -----------------------------------------------------------------
class TestHealth:
    def test_health_ok_and_llm_configured(self, api):
        r = api.get(f"{BASE_URL}/api/health", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert data.get("llm_configured") is True
        assert "claude" in (data.get("llm_model") or "").lower()


# --- Scope checks -----------------------------------------------------------
class TestCheckScope:
    def test_out_of_scope_chatbot(self, api):
        payload = {
            "task_name": "Add a chatbot",
            "task_description": "Add an AI chatbot widget to the homepage",
            "sow": LUMIERE_SOW,
        }
        r = api.post(f"{BASE_URL}/api/check-scope", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["verdict"] == "OUT_OF_SCOPE", f"got {data}"
        assert isinstance(data["reason"], str) and len(data["reason"]) > 0

    def test_in_scope_about_page(self, api):
        payload = {
            "task_name": "Build About page",
            "task_description": "Create the About page per the agreed deliverables",
            "sow": LUMIERE_SOW,
        }
        r = api.post(f"{BASE_URL}/api/check-scope", json=payload, timeout=60)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["verdict"] == "IN_SCOPE", f"got {data}"
        assert len(data["reason"]) > 0

    def test_empty_sow_returns_grey_area(self, api):
        payload = {"task_name": "Anything", "task_description": "", "sow": "  "}
        r = api.post(f"{BASE_URL}/api/check-scope", json=payload, timeout=15)
        assert r.status_code == 200
        assert r.json()["verdict"] == "GREY_AREA"


# --- Structure scope --------------------------------------------------------
class TestStructureScope:
    def test_structure_returns_arrays(self, api):
        r = api.post(
            f"{BASE_URL}/api/structure-scope",
            json={"sow": LUMIERE_SOW},
            timeout=90,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data["included_items"], list)
        assert isinstance(data["excluded_items"], list)
        assert len(data["included_items"]) >= 1
        assert len(data["excluded_items"]) >= 1
        # optional fields exist as keys
        assert "revision_count" in data
        assert "timeline" in data
        assert "total_hours" in data

    def test_structure_empty_sow_400(self, api):
        r = api.post(f"{BASE_URL}/api/structure-scope", json={"sow": ""}, timeout=15)
        assert r.status_code == 400


# --- Change order -----------------------------------------------------------
class TestChangeOrder:
    def test_generate_change_order_returns_email(self, api):
        payload = {
            "project_name": "Lumière Brand Website",
            "client_name": "Lumière Studio",
            "task_name": "Add a chatbot",
            "task_description": "AI chatbot on homepage",
            "original_sow": LUMIERE_SOW,
            "estimated_hours": 6,
            "hourly_rate": 120,
            "timeline_impact_days": 3,
        }
        r = api.post(f"{BASE_URL}/api/generate-change-order", json=payload, timeout=90)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "email" in data
        email = data["email"]
        assert isinstance(email, str)
        assert len(email) > 100
        assert "Subject:" in email or "subject:" in email.lower()
