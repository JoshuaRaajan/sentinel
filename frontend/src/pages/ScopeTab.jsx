import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { upsertProject } from "@/lib/storage";
import { structureScope } from "@/lib/api";
import { toast } from "sonner";

export default function ScopeTab() {
  const { project, refresh } = useOutletContext();
  const [text, setText] = useState(project?.scopeText || "");
  const [busy, setBusy] = useState(false);

  if (!project) return null;

  async function lock() {
    if (!text.trim()) {
      toast("Paste your SOW first");
      return;
    }
    setBusy(true);
    try {
      const structured = await structureScope(text);
      const updated = {
        ...project,
        scopeText: text,
        scopeLocked: true,
        structuredScope: structured,
      };
      upsertProject(updated);
      refresh();
      toast("Scope locked. Sentinel is now watching.");
    } catch (e) {
      toast(
        e?.response?.data?.detail ||
          "Could not parse scope — saved raw text only.",
      );
      const updated = {
        ...project,
        scopeText: text,
        scopeLocked: true,
      };
      upsertProject(updated);
      refresh();
    } finally {
      setBusy(false);
    }
  }

  function unlock() {
    const updated = { ...project, scopeLocked: false };
    upsertProject(updated);
    refresh();
  }

  const struct = project.structuredScope;

  return (
    <div data-testid="scope-page">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8">
        <div>
          <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-mute mb-3">
            / SOURCE OF TRUTH
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl mb-2">
            {project.scopeLocked ? "Scope is locked." : "Lock the scope."}
          </h2>
          <p className="font-sans text-[15px] text-mute mb-6">
            {project.scopeLocked
              ? "Every task added is checked against this. Edit only with intention."
              : "Be specific. This becomes Sentinel's source of truth for every task added."}
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="PASTE YOUR STATEMENT OF WORK OR DESCRIBE THE PROJECT SCOPE"
            disabled={project.scopeLocked}
            className="w-full min-h-[360px] bg-surface border border-line px-4 py-3 font-mono text-[13px] leading-relaxed text-ink focus:outline-none focus:border-ink disabled:bg-decoration disabled:text-mute"
            data-testid="scope-textarea"
          />
          <div className="mt-4 flex items-center gap-3">
            {project.scopeLocked ? (
              <button
                onClick={unlock}
                className="font-mono text-[11px] tracking-wider uppercase border border-line px-4 py-2 text-mute hover:text-ink hover:border-ink"
                data-testid="scope-unlock"
              >
                UNLOCK & EDIT
              </button>
            ) : (
              <button
                onClick={lock}
                disabled={busy}
                className="font-mono text-[11px] tracking-wider uppercase bg-ink text-canvas px-4 py-2 hover:bg-orange disabled:opacity-40 transition-colors"
                data-testid="scope-lock"
              >
                {busy ? "/ LOCKING..." : "LOCK SCOPE →"}
              </button>
            )}
          </div>
        </div>

        <aside className="bg-surface border border-line p-6">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-mute">
            / STRUCTURED SCOPE
          </div>
          {!struct && (
            <p className="mt-6 font-mono text-[12px] text-mute">
              Lock the scope to see the structured breakdown.
            </p>
          )}
          {struct && (
            <div className="mt-5 space-y-6 font-mono text-[12px]">
              <Section title="INCLUDED" items={struct.included_items} tone="green" />
              <Section title="EXCLUDED" items={struct.excluded_items} tone="orange" />
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-line">
                <Stat label="REVISIONS" value={struct.revision_count ?? "—"} />
                <Stat label="TOTAL HOURS" value={struct.total_hours ?? "—"} />
                <Stat label="TIMELINE" value={struct.timeline ?? "—"} long />
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Section({ title, items, tone }) {
  const color = tone === "orange" ? "#FF4D00" : "#2D6A4F";
  return (
    <div>
      <div
        className="text-[10px] tracking-[0.22em] uppercase mb-3"
        style={{ color }}
      >
        / {title}
      </div>
      <ul className="space-y-2">
        {(items || []).length === 0 && <li className="text-mute">—</li>}
        {(items || []).map((item, i) => (
          <li key={i} className="text-ink leading-relaxed flex gap-2">
            <span style={{ color }}>›</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value, long }) {
  return (
    <div className={`border border-line p-3 ${long ? "col-span-2" : ""}`}>
      <div className="text-[10px] tracking-wider uppercase text-mute">{label}</div>
      <div className="text-[13px] text-ink mt-1">{String(value)}</div>
    </div>
  );
}
