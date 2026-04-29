import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  loadProjects,
  setActiveProjectId,
  getViewMode,
  setViewMode,
} from "@/lib/storage";
import { scopeHealth, toneColor } from "@/lib/scope";
import { useState } from "react";

const TABS = [
  { to: "/app/board", label: "BOARD" },
  { to: "/app/scope", label: "SCOPE" },
  { to: "/app/billing", label: "BILLING" },
  { to: "/app/client", label: "CLIENT VIEW" },
];

export default function TopNav({ project, stats, refresh }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const projects = loadProjects();
  const view = getViewMode();
  const health = stats ? scopeHealth(stats.pct) : null;
  const color = health ? toneColor(health.tone) : "#2D6A4F";

  function selectProject(id) {
    setActiveProjectId(id);
    setOpen(false);
    refresh && refresh();
    navigate("/app/board");
  }

  function toggleView() {
    const next = view === "client" ? "provider" : "client";
    setViewMode(next);
    if (next === "client") navigate("/app/client");
    else navigate("/app/board");
    refresh && refresh();
  }

  return (
    <nav
      className="sticky top-0 z-30 bg-surface border-b border-line"
      data-testid="app-topnav"
    >
      <div className="flex items-center px-6 h-[60px] gap-6">
        <Link
          to="/"
          className="font-mono text-[13px] font-bold tracking-[0.2em] text-ink"
          data-testid="brand-link"
        >
          SENTINEL
        </Link>
        <span className="text-line">/</span>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 font-mono text-[12px] tracking-wider uppercase text-ink hover:text-orange"
            data-testid="project-switcher"
          >
            {project ? project.name : "NO PROJECT"}
            <span className="text-mute">▾</span>
          </button>
          {open && (
            <div className="absolute top-full left-0 mt-2 bg-surface border border-line min-w-[260px] z-40">
              {projects.length === 0 && (
                <div className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-mute">
                  NO PROJECTS YET
                </div>
              )}
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProject(p.id)}
                  className="block w-full text-left px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-ink hover:bg-decoration border-b border-line"
                  data-testid={`switcher-item-${p.id}`}
                >
                  {p.name}
                </button>
              ))}
              <Link
                to="/new"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-orange hover:bg-decoration"
                data-testid="switcher-new"
              >
                + NEW PROJECT
              </Link>
            </div>
          )}
        </div>

        <div className="flex-1 hidden md:flex items-center justify-center gap-8">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `font-mono text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  isActive ? "text-ink" : "text-mute hover:text-ink"
                }`
              }
              data-testid={`nav-${t.label.toLowerCase().replace(" ", "-")}`}
            >
              {t.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-4">
          {health && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 ${health.pulse ? "scope-pulse" : ""}`}
                style={{ background: color }}
                data-testid="health-dot"
              />
              <span
                className="font-mono text-[11px] tracking-wider uppercase"
                style={{ color }}
                data-testid="health-label"
              >
                SCOPE: {health.label}
              </span>
            </div>
          )}
          <button
            onClick={toggleView}
            className="hidden md:inline-block font-mono text-[10px] tracking-wider uppercase border border-line px-3 py-1.5 text-mute hover:text-ink hover:border-ink transition-colors"
            data-testid="view-toggle"
          >
            {view === "client" ? "← BACK TO PROVIDER" : "SWITCH TO CLIENT VIEW ↔"}
          </button>
        </div>
      </div>
      {/* mobile tabs */}
      <div className="flex md:hidden items-center justify-between px-6 py-2 border-t border-line overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `font-mono text-[10px] tracking-[0.15em] uppercase whitespace-nowrap mr-4 ${
                isActive ? "text-ink" : "text-mute"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
