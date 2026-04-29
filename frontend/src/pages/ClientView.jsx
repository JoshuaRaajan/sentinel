import { useOutletContext, useNavigate } from "react-router-dom";
import { setViewMode } from "@/lib/storage";
import { useEffect } from "react";

const COLUMNS = [
  { id: "todo", label: "Up Next" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Completed" },
];

export default function ClientView() {
  const { project } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setViewMode("client");
  }, []);

  if (!project) return null;

  return (
    <div className="bg-surface" data-testid="client-view">
      <div className="border border-line p-8 lg:p-12 bg-surface">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-mute">
              / STATUS UPDATE
            </div>
            <h1 className="mt-2 font-serif text-4xl lg:text-5xl text-ink">
              {project.name}
            </h1>
            <p className="mt-2 font-sans text-[15px] text-mute">
              Prepared for {project.client}
            </p>
          </div>
          <button
            onClick={() => {
              setViewMode("provider");
              navigate("/app/board");
            }}
            className="font-mono text-[11px] tracking-wider uppercase text-mute hover:text-ink"
            data-testid="back-to-provider"
          >
            ← BACK TO PROVIDER VIEW
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => {
            const tasks = (project.tasks || []).filter(
              (t) => t.status === col.id,
            );
            return (
              <div key={col.id} className="border border-line p-5 bg-surface">
                <div className="font-serif text-2xl text-ink">{col.label}</div>
                <div className="mt-1 font-mono text-[10px] tracking-wider uppercase text-mute">
                  {tasks.length} {tasks.length === 1 ? "ITEM" : "ITEMS"}
                </div>
                <div className="mt-5 space-y-3">
                  {tasks.length === 0 && (
                    <div className="font-mono text-[11px] tracking-wider uppercase text-mute">
                      —
                    </div>
                  )}
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      className="border border-line px-3 py-3 font-sans text-[14px] text-ink"
                      data-testid={`client-task-${t.id}`}
                    >
                      {t.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 pt-6 border-t border-line font-mono text-[10px] tracking-[0.22em] uppercase text-mute flex flex-wrap gap-6">
          <span>UPDATED {new Date().toLocaleDateString()}</span>
          <span className="ml-auto">PREPARED BY YOUR PROJECT TEAM</span>
        </div>
      </div>
    </div>
  );
}
