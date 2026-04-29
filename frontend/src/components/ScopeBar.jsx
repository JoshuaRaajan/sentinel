import { scopeHealth, toneColor, fmtHrs } from "@/lib/scope";

// Always-visible scope bar in provider view. Color logic per spec.
export default function ScopeBar({ project, stats }) {
  if (!project || !stats) return null;
  const pct = Math.min(120, stats.pct); // cap visual at 120 to keep the bar readable
  const health = scopeHealth(stats.pct);
  const color = toneColor(health.tone);

  return (
    <div
      className="border-b border-line bg-surface px-6 py-4"
      data-testid="scope-bar"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-mono text-[11px] tracking-wider uppercase text-mute">
          / SCOPE USED
        </div>
        <div
          className={`font-mono text-[11px] tracking-wider uppercase ${
            health.pulse ? "scope-pulse" : ""
          }`}
          style={{ color }}
          data-testid="scope-bar-status"
        >
          {Math.round(stats.pct)}% — {fmtHrs(stats.usedHours)} OF{" "}
          {fmtHrs(project.agreedHours)} AGREED HOURS
        </div>
      </div>
      <div
        className="w-full h-[6px] bg-decoration relative overflow-hidden"
        style={{ border: "1px solid var(--line)" }}
      >
        <div
          className="absolute top-0 left-0 h-full transition-all duration-500"
          style={{ width: `${Math.min(100, pct)}%`, background: color }}
        />
        {pct > 100 && (
          <div
            className="absolute top-0 h-full scope-pulse"
            style={{
              left: "100%",
              width: `${pct - 100}%`,
              background: "#FF4D00",
            }}
          />
        )}
      </div>
    </div>
  );
}
