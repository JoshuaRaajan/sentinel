import { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TopNav from "@/components/TopNav";
import ScopeBar from "@/components/ScopeBar";
import { ensureSeed } from "@/lib/seed";
import { getActiveProject, getViewMode } from "@/lib/storage";
import { computeStats } from "@/lib/scope";

// AppShell wires top-nav, scope bar and provides project + stats to children
// via outlet context.
export default function AppShell() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tick, setTick] = useState(0);
  const view = getViewMode();

  const refresh = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    ensureSeed();
    const active = getActiveProject();
    if (!active) {
      navigate("/new");
      return;
    }
    setProject(active);
  }, [tick, navigate]);

  const stats = computeStats(project);

  return (
    <div className="min-h-screen bg-canvas" data-testid="app-shell">
      <TopNav project={project} stats={stats} refresh={refresh} />
      {view === "provider" && project && (
        <ScopeBar project={project} stats={stats} />
      )}
      <main className="px-6 py-6 max-w-[1400px] mx-auto">
        <Outlet context={{ project, stats, refresh }} />
      </main>
    </div>
  );
}
