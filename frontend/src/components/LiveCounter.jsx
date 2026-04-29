import { useEffect, useState } from "react";

// Anchored at $284,731 per the spec, slowly increments to give the navbar
// a "live" pulse. Persists across navigations within session.
export default function LiveCounter() {
  const [n, setN] = useState(284731);

  useEffect(() => {
    const id = setInterval(() => {
      // Random small increment 1-9 dollars every 2.4s — feels alive, not spammy.
      setN((prev) => prev + Math.floor(Math.random() * 9) + 1);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="w-full bg-ink text-canvas font-mono text-[11px] tracking-wider uppercase flex items-center px-6"
      style={{ height: 40 }}
      data-testid="live-counter-bar"
    >
      <span className="text-orange mr-3">/ LIVE</span>
      <span className="opacity-90">
        — ${n.toLocaleString("en-US")} IN SCOPE CREEP DETECTED THIS MONTH ACROSS ALL SENTINEL PROJECTS
      </span>
    </div>
  );
}
