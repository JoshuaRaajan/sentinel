import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { upsertProject, getViewMode } from "@/lib/storage";
import { checkScope } from "@/lib/api";
import { fmtUsd } from "@/lib/scope";
import TaskCard from "@/components/TaskCard";
import ChangeOrderModal from "@/components/ChangeOrderModal";
import { toast } from "sonner";

const COLUMNS = [
  { id: "todo", label: "TO DO" },
  { id: "in_progress", label: "IN PROGRESS" },
  { id: "done", label: "DONE" },
];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function Board() {
  const { project, refresh, stats } = useOutletContext();
  const [adding, setAdding] = useState({});
  const [draft, setDraft] = useState({});
  const [pending, setPending] = useState(null); // taskId currently being scope-checked
  const [creep, setCreep] = useState(null); // OOS task details for inline alert
  const [orderTask, setOrderTask] = useState(null);
  const view = getViewMode();
  const clientView = view === "client";

  // Detect first OOS task on load to surface the alert banner.
  useEffect(() => {
    if (!project) return;
    const oos = (project.tasks || []).filter((t) => t.scopeStatus === "OUT_OF_SCOPE");
    if (oos.length > 0) {
      const lastOOS = oos[oos.length - 1];
      setCreep({
        task: lastOOS,
        cost: (lastOOS.estHours || lastOOS.actualHours || 0) * project.rate,
      });
    } else {
      setCreep(null);
    }
  }, [project]);

  if (!project) return null;

  function persist(updater) {
    const updated = { ...project, tasks: updater(project.tasks || []) };
    upsertProject(updated);
    refresh();
  }

  function moveTask(id, status) {
    persist((tasks) => tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  }
  function deleteTask(id) {
    persist((tasks) => tasks.filter((t) => t.id !== id));
  }

  async function addTask(colId) {
    const d = draft[colId] || {};
    if (!d.name || !d.name.trim()) return;
    const newTask = {
      id: uid(),
      name: d.name.trim(),
      estHours: Number(d.estHours) || 0,
      actualHours: 0,
      status: colId,
      scopeStatus: "PENDING",
      scopeReason: "",
      createdAt: new Date().toISOString(),
    };
    persist((tasks) => [...tasks, newTask]);
    setPending(newTask.id);
    setAdding((a) => ({ ...a, [colId]: false }));
    setDraft((d2) => ({ ...d2, [colId]: { name: "", estHours: "" } }));

    try {
      const verdict = await checkScope({
        taskName: newTask.name,
        sow: project.scopeText || "",
      });
      persist((tasks) =>
        tasks.map((t) =>
          t.id === newTask.id
            ? {
                ...t,
                scopeStatus: verdict.verdict,
                scopeReason: verdict.reason,
              }
            : t,
        ),
      );
      if (verdict.verdict === "OUT_OF_SCOPE") {
        setCreep({
          task: { ...newTask, scopeReason: verdict.reason },
          cost: (newTask.estHours || 0) * project.rate,
        });
      }
    } catch (e) {
      persist((tasks) =>
        tasks.map((t) =>
          t.id === newTask.id
            ? { ...t, scopeStatus: "GREY_AREA", scopeReason: "Scope check unavailable." }
            : t,
        ),
      );
      toast("Scope check failed — marked as grey area");
    } finally {
      setPending(null);
    }
  }

  return (
    <div data-testid="board-page">
      {!clientView && creep && (
        <div
          className="mb-6 px-4 py-3 flex flex-wrap items-center gap-3 font-mono text-[12px] tracking-wider"
          style={{
            background: "#FFE7DA",
            color: "#FF4D00",
            border: "1px solid #FF4D00",
          }}
          data-testid="creep-alert"
        >
          <span className="font-bold">/!\ SCOPE CREEP DETECTED —</span>
          <span className="uppercase">{creep.task.name}</span>
          <span className="text-mute uppercase">
            UNBILLED {fmtUsd(creep.cost)}
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setOrderTask(creep.task)}
              className="px-3 py-1 bg-orange text-white border border-orange hover:opacity-90 text-[11px] tracking-wider uppercase"
              data-testid="creep-generate-co"
            >
              GENERATE CHANGE ORDER →
            </button>
            <button
              onClick={() => setCreep(null)}
              className="px-3 py-1 border border-mute text-mute hover:text-ink hover:border-ink text-[11px] tracking-wider uppercase"
              data-testid="creep-dismiss"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => {
          const colTasks = (project.tasks || []).filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="border border-line bg-canvas p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink">
                  {col.label}
                </div>
                <div className="font-mono text-[11px] tracking-wider uppercase text-mute">
                  {colTasks.length}
                </div>
              </div>

              <div>
                {colTasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={pending === t.id ? { ...t, scopeStatus: "PENDING" } : t}
                    onMove={moveTask}
                    onDelete={deleteTask}
                    onFlagChangeOrder={(task) => setOrderTask(task)}
                    clientView={clientView}
                  />
                ))}
              </div>

              {!clientView && (
                <div>
                  {!adding[col.id] ? (
                    <button
                      onClick={() => setAdding((a) => ({ ...a, [col.id]: true }))}
                      className="w-full text-left font-mono text-[11px] tracking-wider uppercase text-mute hover:text-orange py-2 border-t border-line"
                      data-testid={`add-task-${col.id}`}
                    >
                      ADD TASK +
                    </button>
                  ) : (
                    <div className="border border-line bg-surface p-3 mt-2">
                      <input
                        autoFocus
                        placeholder="Task name"
                        value={draft[col.id]?.name || ""}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            [col.id]: { ...(d[col.id] || {}), name: e.target.value },
                          }))
                        }
                        className="w-full bg-surface border border-line px-2 py-2 font-sans text-[14px] text-ink focus:outline-none focus:border-ink"
                        data-testid={`new-task-name-${col.id}`}
                      />
                      <input
                        placeholder="Est. hours"
                        type="number"
                        value={draft[col.id]?.estHours || ""}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            [col.id]: { ...(d[col.id] || {}), estHours: e.target.value },
                          }))
                        }
                        className="w-full mt-2 bg-surface border border-line px-2 py-2 font-mono text-[13px] text-ink focus:outline-none focus:border-ink"
                        data-testid={`new-task-hours-${col.id}`}
                      />
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => addTask(col.id)}
                          className="font-mono text-[10px] tracking-wider uppercase bg-ink text-canvas px-3 py-2 hover:bg-orange transition-colors"
                          data-testid={`save-task-${col.id}`}
                        >
                          ADD →
                        </button>
                        <button
                          onClick={() => setAdding((a) => ({ ...a, [col.id]: false }))}
                          className="font-mono text-[10px] tracking-wider uppercase border border-line px-3 py-2 text-mute hover:text-ink"
                          data-testid={`cancel-task-${col.id}`}
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {orderTask && (
        <ChangeOrderModal
          open={!!orderTask}
          onClose={() => setOrderTask(null)}
          project={project}
          task={orderTask}
        />
      )}
    </div>
  );
}
