import { badgeForVerdict, fmtHrs } from "@/lib/scope";

export default function TaskCard({
  task,
  onMove,
  onDelete,
  onFlagChangeOrder,
  clientView = false,
}) {
  const isOOS = task.scopeStatus === "OUT_OF_SCOPE";
  const verdict = clientView ? null : badgeForVerdict(task.scopeStatus || "IN_SCOPE");

  return (
    <div
      data-testid={`task-card-${task.id}`}
      className="border border-line bg-surface p-4 mb-3 transition-colors"
      style={{
        borderLeft: !clientView && isOOS ? "3px solid #FF4D00" : undefined,
        background: !clientView && isOOS ? "rgba(255,77,0,0.04)" : "#FFFFFF",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="font-sans text-[15px] leading-snug text-ink flex-1">
          {task.name}
        </div>
        {!clientView && verdict && (
          <span
            className="font-mono text-[10px] tracking-wider uppercase px-2 py-1 whitespace-nowrap"
            style={{
              background: verdict.bg,
              color: verdict.fg,
              border: `1px solid ${verdict.border}`,
            }}
            data-testid={`task-badge-${task.id}`}
          >
            {verdict.label}
          </span>
        )}
      </div>

      {!clientView && (
        <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[11px] tracking-wider uppercase text-mute">
          <span>EST {fmtHrs(task.estHours)}h</span>
          <span>USED {fmtHrs(task.actualHours)}h</span>
        </div>
      )}

      {!clientView && task.scopeReason && task.scopeStatus !== "IN_SCOPE" && (
        <div className="mt-3 font-mono text-[11px] leading-relaxed text-mute border-t border-line pt-3">
          {task.scopeReason}
        </div>
      )}

      {!clientView && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {task.status !== "todo" && (
            <button
              onClick={() => onMove(task.id, prevStatus(task.status))}
              className="font-mono text-[10px] tracking-wider uppercase px-2 py-1 border border-line text-mute hover:text-ink hover:border-ink transition-colors"
              data-testid={`task-back-${task.id}`}
            >
              ← BACK
            </button>
          )}
          {task.status !== "done" && (
            <button
              onClick={() => onMove(task.id, nextStatus(task.status))}
              className="font-mono text-[10px] tracking-wider uppercase px-2 py-1 border border-ink bg-ink text-canvas hover:bg-orange hover:border-orange transition-colors"
              data-testid={`task-advance-${task.id}`}
            >
              {task.status === "todo" ? "START →" : "DONE →"}
            </button>
          )}
          {isOOS && (
            <button
              onClick={() => onFlagChangeOrder(task)}
              className="font-mono text-[10px] tracking-wider uppercase px-2 py-1 bg-orange text-white hover:opacity-90 transition-opacity"
              data-testid={`task-change-order-${task.id}`}
            >
              CHANGE ORDER →
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="font-mono text-[10px] tracking-wider uppercase px-2 py-1 text-mute hover:text-orange ml-auto"
            data-testid={`task-delete-${task.id}`}
          >
            DELETE
          </button>
        </div>
      )}
    </div>
  );
}

function nextStatus(s) {
  if (s === "todo") return "in_progress";
  return "done";
}
function prevStatus(s) {
  if (s === "done") return "in_progress";
  return "todo";
}
