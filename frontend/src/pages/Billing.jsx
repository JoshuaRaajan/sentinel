import { useOutletContext } from "react-router-dom";
import { fmtHrs, fmtUsd, scopeHealth, toneColor } from "@/lib/scope";
import { upsertProject } from "@/lib/storage";
import { toast } from "sonner";

export default function Billing() {
  const { project, stats, refresh } = useOutletContext();
  if (!project || !stats) return null;
  const health = scopeHealth(stats.pct);
  const color = toneColor(health.tone);

  function setActual(taskId, hours) {
    const updated = {
      ...project,
      tasks: (project.tasks || []).map((t) =>
        t.id === taskId ? { ...t, actualHours: Number(hours) || 0 } : t,
      ),
    };
    upsertProject(updated);
    refresh();
  }

  return (
    <div data-testid="billing-page" className="font-mono text-[12px]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-line bg-surface mb-6">
        <Cell label="AGREED HOURS" value={fmtHrs(project.agreedHours)} />
        <Cell label="HOURS USED" value={fmtHrs(stats.usedHours)} />
        <Cell label="HOURS REMAINING" value={fmtHrs(stats.remaining)} />
        <Cell
          label="BURN RATE"
          value={`${fmtHrs(stats.burnRate)} HRS/WK`}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-line bg-surface mb-8">
        <Cell label="AGREED BUDGET" value={fmtUsd(stats.agreedBudget)} />
        <Cell label="BILLED TO DATE" value={fmtUsd(stats.inScopeBilled)} />
        <Cell
          label="UNBILLED SCOPE CREEP"
          value={fmtUsd(stats.unbilledCreep)}
          highlight={stats.unbilledCreep > 0}
        />
        <Cell label="PROJECTED FINAL" value={fmtUsd(stats.projectedFinal)} />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="tracking-wider uppercase text-mute">
          / BUDGET CONSUMPTION
        </div>
        <div className="tracking-wider uppercase" style={{ color }}>
          {Math.round(stats.pct)}%
        </div>
      </div>
      <div className="w-full h-[8px] bg-decoration relative mb-10 border border-line">
        <div
          className="absolute top-0 left-0 h-full"
          style={{ width: `${Math.min(100, stats.pct)}%`, background: color }}
        />
      </div>

      <div className="border border-line bg-surface overflow-x-auto">
        <table className="min-w-full text-[12px] tracking-wider uppercase">
          <thead>
            <tr className="border-b border-line text-mute">
              <th className="text-left px-4 py-3">TASK</th>
              <th className="text-left px-4 py-3">SCOPE</th>
              <th className="text-right px-4 py-3">HOURS</th>
              <th className="text-right px-4 py-3">RATE</th>
              <th className="text-right px-4 py-3">AMOUNT</th>
              <th className="text-left px-4 py-3">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {(project.tasks || []).map((t) => {
              const oos = t.scopeStatus === "OUT_OF_SCOPE";
              const amount = (Number(t.actualHours) || 0) * project.rate;
              return (
                <tr
                  key={t.id}
                  className="border-b border-line row-hover"
                  style={{ background: oos ? "rgba(255,77,0,0.05)" : undefined }}
                  data-testid={`bill-row-${t.id}`}
                >
                  <td className="px-4 py-3 text-ink normal-case font-sans">
                    {t.name}
                  </td>
                  <td className="px-4 py-3">
                    {oos ? (
                      <span className="text-orange">OUT</span>
                    ) : t.scopeStatus === "GREY_AREA" ? (
                      <span style={{ color: "#B5860D" }}>GREY</span>
                    ) : (
                      <span className="text-green">IN</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={t.actualHours || 0}
                      onChange={(e) => setActual(t.id, e.target.value)}
                      className="w-20 text-right bg-transparent border border-line px-2 py-1 focus:outline-none focus:border-ink"
                      data-testid={`hours-input-${t.id}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right text-mute">
                    ${project.rate}/HR
                  </td>
                  <td
                    className="px-4 py-3 text-right"
                    style={{ color: oos ? "#FF4D00" : undefined }}
                  >
                    {fmtUsd(amount)}
                  </td>
                  <td className="px-4 py-3 text-mute">
                    {t.status.replace("_", " ")}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-decoration">
              <td className="px-4 py-3 font-bold">TOTAL</td>
              <td />
              <td className="px-4 py-3 text-right">
                {fmtHrs(stats.usedHours)}
              </td>
              <td />
              <td className="px-4 py-3 text-right font-bold">
                {fmtUsd(stats.inScopeBilled + stats.unbilledCreep)}
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => toast("Invoice generated (mocked)")}
          className="font-mono text-[11px] tracking-wider uppercase bg-ink text-canvas px-4 py-2 hover:bg-orange transition-colors"
          data-testid="generate-invoice"
        >
          GENERATE INVOICE →
        </button>
        <span className="font-mono text-[10px] tracking-wider uppercase text-mute">
          / FIGURES UPDATE LIVE AS YOU LOG HOURS
        </span>
      </div>
    </div>
  );
}

function Cell({ label, value, highlight }) {
  return (
    <div className="border-r last:border-r-0 border-line px-5 py-5">
      <div className="text-[10px] tracking-[0.22em] uppercase text-mute">
        {label}
      </div>
      <div
        className={`mt-2 text-[22px] tracking-wider ${
          highlight ? "text-orange" : "text-ink"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
