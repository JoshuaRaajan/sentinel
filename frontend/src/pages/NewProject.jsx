import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { upsertProject, setActiveProjectId } from "@/lib/storage";
import { structureScope } from "@/lib/api";
import { toast } from "sonner";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const STEPS = [
  { id: 1, label: "DETAILS" },
  { id: 2, label: "SCOPE" },
  { id: 3, label: "REVIEW" },
];

export default function NewProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client: "",
    type: "Fixed",
    rate: 150,
    agreedHours: 40,
    startDate: new Date().toISOString().slice(0, 10),
    scopeText: "",
  });
  const [structured, setStructured] = useState(null);

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function next() {
    if (step === 1) {
      if (!form.name.trim() || !form.client.trim()) {
        toast("Project and client name required");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!form.scopeText.trim()) {
        toast("Paste or describe the scope first");
        return;
      }
      setBusy(true);
      try {
        const s = await structureScope(form.scopeText);
        setStructured(s);
        setStep(3);
      } catch (e) {
        toast(
          e?.response?.data?.detail ||
            "Could not parse scope — proceeding with raw text.",
        );
        setStructured(null);
        setStep(3);
      } finally {
        setBusy(false);
      }
      return;
    }
    if (step === 3) {
      const id = uid();
      const project = {
        id,
        name: form.name.trim(),
        client: form.client.trim(),
        type: form.type,
        rate: Number(form.rate) || 0,
        agreedHours: Number(form.agreedHours) || 0,
        startDate: new Date(form.startDate).toISOString(),
        scopeText: form.scopeText.trim(),
        scopeLocked: true,
        structuredScope: structured,
        tasks: [],
        createdAt: new Date().toISOString(),
      };
      upsertProject(project);
      setActiveProjectId(id);
      toast(`${project.name} locked. Sentinel is watching.`);
      navigate("/app/board");
    }
  }

  return (
    <div className="min-h-screen bg-canvas" data-testid="new-project-page">
      <header className="border-b border-line bg-surface">
        <div className="max-w-[1100px] mx-auto px-6 h-[64px] flex items-center">
          <Link
            to="/"
            className="font-mono text-[13px] font-bold tracking-[0.22em] text-ink"
          >
            SENTINEL
          </Link>
          <div className="ml-auto flex items-center gap-6">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`font-mono text-[11px] tracking-[0.18em] uppercase ${
                  step === s.id
                    ? "text-orange"
                    : step > s.id
                      ? "text-ink"
                      : "text-mute"
                }`}
                data-testid={`step-indicator-${s.id}`}
              >
                {s.id < 10 ? `0${s.id}` : s.id} / {s.label}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-6 py-16">
        {step === 1 && (
          <div data-testid="step-1">
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-mute">
              / 01 — PROJECT DETAILS
            </div>
            <h1 className="mt-3 font-serif text-5xl text-ink">
              What are we protecting?
            </h1>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="PROJECT NAME">
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full bg-surface border border-line px-3 py-3 font-sans text-[15px] focus:outline-none focus:border-ink"
                  data-testid="np-name"
                />
              </Field>
              <Field label="CLIENT NAME">
                <input
                  value={form.client}
                  onChange={(e) => update("client", e.target.value)}
                  className="w-full bg-surface border border-line px-3 py-3 font-sans text-[15px] focus:outline-none focus:border-ink"
                  data-testid="np-client"
                />
              </Field>
              <Field label="PROJECT TYPE">
                <div className="flex">
                  {["Fixed", "T&M"].map((t) => (
                    <button
                      key={t}
                      onClick={() => update("type", t)}
                      className={`flex-1 px-3 py-3 border border-line font-mono text-[12px] tracking-wider uppercase ${
                        form.type === t
                          ? "bg-ink text-canvas border-ink"
                          : "text-mute hover:text-ink"
                      }`}
                      data-testid={`np-type-${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="HOURLY RATE (USD)">
                <input
                  type="number"
                  value={form.rate}
                  onChange={(e) => update("rate", e.target.value)}
                  className="w-full bg-surface border border-line px-3 py-3 font-mono text-[15px] focus:outline-none focus:border-ink"
                  data-testid="np-rate"
                />
              </Field>
              <Field label="AGREED HOURS">
                <input
                  type="number"
                  value={form.agreedHours}
                  onChange={(e) => update("agreedHours", e.target.value)}
                  className="w-full bg-surface border border-line px-3 py-3 font-mono text-[15px] focus:outline-none focus:border-ink"
                  data-testid="np-hours"
                />
              </Field>
              <Field label="START DATE">
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  className="w-full bg-surface border border-line px-3 py-3 font-mono text-[14px] focus:outline-none focus:border-ink"
                  data-testid="np-start"
                />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div data-testid="step-2">
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-mute">
              / 02 — SCOPE OF WORK
            </div>
            <h1 className="mt-3 font-serif text-5xl text-ink">
              Lock what was agreed.
            </h1>
            <p className="mt-3 font-sans text-[16px] text-mute max-w-xl">
              Paste your SOW, proposal, or describe the project in plain
              English. The more specific you are, the sharper Sentinel gets.
            </p>
            <textarea
              value={form.scopeText}
              onChange={(e) => update("scopeText", e.target.value)}
              placeholder="Deliverables: ...&#10;&#10;Excluded: ...&#10;&#10;Timeline: ...&#10;Total agreed hours: ..."
              className="mt-8 w-full min-h-[340px] bg-surface border border-line px-4 py-3 font-mono text-[13px] leading-relaxed text-ink focus:outline-none focus:border-ink"
              data-testid="np-scope"
            />
          </div>
        )}

        {step === 3 && (
          <div data-testid="step-3">
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-mute">
              / 03 — CONFIRM
            </div>
            <h1 className="mt-3 font-serif text-5xl text-ink">
              Sentinel reads this as:
            </h1>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-[12px]">
              <Pillar
                title="INCLUDED"
                tone="green"
                items={structured?.included_items || []}
                fallback="Sentinel could not extract included items — raw scope will still be the source of truth."
              />
              <Pillar
                title="EXCLUDED"
                tone="orange"
                items={structured?.excluded_items || []}
                fallback="No exclusions identified."
              />
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-[12px]">
              <Stat
                label="REVISIONS"
                value={structured?.revision_count ?? "—"}
              />
              <Stat
                label="TIMELINE"
                value={structured?.timeline ?? "—"}
              />
              <Stat
                label="TOTAL HOURS"
                value={structured?.total_hours ?? form.agreedHours}
              />
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between gap-3">
          <button
            onClick={() => (step === 1 ? navigate("/") : setStep((s) => s - 1))}
            className="font-mono text-[11px] tracking-wider uppercase text-mute hover:text-ink"
            data-testid="np-back"
          >
            ← BACK
          </button>
          <button
            onClick={next}
            disabled={busy}
            className="font-mono text-[11px] tracking-wider uppercase bg-ink text-canvas px-6 py-3 hover:bg-orange disabled:opacity-40 transition-colors"
            data-testid="np-next"
          >
            {busy
              ? "/ STRUCTURING..."
              : step === 3
                ? "OPEN PROJECT →"
                : "CONTINUE →"}
          </button>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-mute mb-2">
        {label}
      </div>
      {children}
    </label>
  );
}

function Pillar({ title, tone, items, fallback }) {
  const color = tone === "orange" ? "#FF4D00" : "#2D6A4F";
  return (
    <div className="border border-line bg-surface p-5">
      <div
        className="text-[10px] tracking-[0.22em] uppercase mb-3"
        style={{ color }}
      >
        / {title}
      </div>
      {items.length === 0 ? (
        <div className="text-mute leading-relaxed">{fallback}</div>
      ) : (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2 text-ink leading-relaxed">
              <span style={{ color }}>›</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-line bg-surface p-4">
      <div className="text-[10px] tracking-[0.22em] uppercase text-mute">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-ink">{String(value)}</div>
    </div>
  );
}
