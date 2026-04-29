// Pure helpers for computing scope health, billing totals, and UI tints.

export function computeStats(project) {
  if (!project) return null;
  const tasks = project.tasks || [];
  const usedHours = tasks.reduce((sum, t) => sum + (Number(t.actualHours) || 0), 0);
  const remaining = Math.max(0, project.agreedHours - usedHours);
  const pct = project.agreedHours > 0 ? (usedHours / project.agreedHours) * 100 : 0;

  const inScopeBilled = tasks
    .filter((t) => t.scopeStatus !== "OUT_OF_SCOPE")
    .reduce(
      (sum, t) => sum + (Number(t.actualHours) || 0) * project.rate,
      0,
    );
  const unbilledCreep = tasks
    .filter((t) => t.scopeStatus === "OUT_OF_SCOPE")
    .reduce(
      (sum, t) =>
        sum + ((Number(t.actualHours) || Number(t.estHours) || 0)) * project.rate,
      0,
    );
  const projectedFinal = inScopeBilled + unbilledCreep + remaining * project.rate;

  // Burn rate: hours used / weeks since start.
  const start = project.startDate ? new Date(project.startDate) : null;
  let burnRate = 0;
  if (start) {
    const weeks = Math.max(1, (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
    burnRate = usedHours / weeks;
  }

  return {
    usedHours,
    remaining,
    pct,
    inScopeBilled,
    unbilledCreep,
    projectedFinal,
    burnRate,
    agreedBudget: project.agreedHours * project.rate,
  };
}

export function scopeHealth(pct) {
  if (pct >= 100) return { label: "BREACHED", tone: "orange", pulse: true };
  if (pct >= 81) return { label: "AT RISK", tone: "orange", pulse: false };
  if (pct >= 61) return { label: "AT RISK", tone: "amber", pulse: false };
  return { label: "HEALTHY", tone: "green", pulse: false };
}

export function toneColor(tone) {
  switch (tone) {
    case "orange":
      return "#FF4D00";
    case "amber":
      return "#B5860D";
    case "green":
    default:
      return "#2D6A4F";
  }
}

export function badgeForVerdict(verdict) {
  switch (verdict) {
    case "OUT_OF_SCOPE":
      return {
        label: "OUT OF SCOPE",
        bg: "#FFE7DA",
        fg: "#FF4D00",
        border: "#FF4D00",
      };
    case "GREY_AREA":
      return {
        label: "GREY AREA",
        bg: "#F5ECD2",
        fg: "#B5860D",
        border: "#B5860D",
      };
    case "PENDING":
      return {
        label: "/ CHECKING SCOPE...",
        bg: "#F2F0EB",
        fg: "#6B6760",
        border: "#E8E4DC",
      };
    case "IN_SCOPE":
    default:
      return {
        label: "IN SCOPE",
        bg: "#DCEAE3",
        fg: "#2D6A4F",
        border: "#2D6A4F",
      };
  }
}

export function fmtUsd(n) {
  if (n == null || isNaN(n)) return "$0";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function fmtHrs(n) {
  if (n == null || isNaN(n)) return "0";
  const r = Math.round(n * 10) / 10;
  return r % 1 === 0 ? String(r.toFixed(0)) : String(r);
}
