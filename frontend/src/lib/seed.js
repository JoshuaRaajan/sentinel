// Seeds a single demo project on first run so the app is never empty.
import { loadProjects, saveProjects, setActiveProjectId } from "./storage";

const LUMIERE_SOW = `Lumière Brand Website — Statement of Work

Deliverables:
- Single-page marketing website (Home, About, Services, Contact)
- Fully responsive layout (desktop, tablet, mobile)
- Brand-aligned visual design using existing brand guidelines
- Two rounds of revisions on design and copy
- Content management for the team to update Services and Contact pages
- Launch on the client's existing hosting

Excluded:
- Blog or editorial section
- Mobile applications (iOS / Android)
- E-commerce functionality
- Third-party chatbot integrations
- New brand identity work or logo redesign

Timeline: 6 weeks from kickoff
Total agreed hours: 40
Hourly rate: $200/hr
Total agreed budget: $8,000`;

const TASKS = [
  {
    name: "Wireframe homepage",
    estHours: 6,
    actualHours: 6,
    status: "done",
    scopeStatus: "IN_SCOPE",
    scopeReason: "Homepage wireframe is part of the agreed marketing site.",
  },
  {
    name: "Design system + components",
    estHours: 8,
    actualHours: 9,
    status: "done",
    scopeStatus: "IN_SCOPE",
    scopeReason: "Required to build the agreed responsive layout.",
  },
  {
    name: "Build About + Services pages",
    estHours: 10,
    actualHours: 8,
    status: "in_progress",
    scopeStatus: "IN_SCOPE",
    scopeReason: "Listed deliverable in the SOW.",
  },
  {
    name: "Add a chatbot to the homepage",
    estHours: 6,
    actualHours: 4,
    status: "in_progress",
    scopeStatus: "OUT_OF_SCOPE",
    scopeReason:
      "Third-party chatbot integration is explicitly excluded from the SOW.",
  },
  {
    name: "Redo mobile version entirely",
    estHours: 8,
    actualHours: 2,
    status: "todo",
    scopeStatus: "OUT_OF_SCOPE",
    scopeReason:
      "Original SOW already covers a responsive layout; a full redesign is new work.",
  },
  {
    name: "Launch on client hosting",
    estHours: 4,
    actualHours: 0,
    status: "todo",
    scopeStatus: "IN_SCOPE",
    scopeReason: "Listed deliverable in the SOW.",
  },
];

function uid() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

export function ensureSeed() {
  const existing = loadProjects();
  if (existing.length > 0) return existing;

  const projectId = uid();
  const startedAgo = 1000 * 60 * 60 * 24 * 30; // 30 days back so burn rate looks real
  const project = {
    id: projectId,
    name: "Lumière Brand Website",
    client: "Lumière Studio",
    type: "Fixed",
    rate: 200,
    agreedHours: 40,
    startDate: new Date(Date.now() - startedAgo).toISOString(),
    scopeText: LUMIERE_SOW,
    scopeLocked: true,
    structuredScope: {
      included_items: [
        "Single-page marketing website (Home, About, Services, Contact)",
        "Fully responsive layout (desktop, tablet, mobile)",
        "Brand-aligned visual design using existing brand guidelines",
        "Two rounds of revisions on design and copy",
        "Content management for Services and Contact pages",
        "Launch on the client's existing hosting",
      ],
      excluded_items: [
        "Blog or editorial section",
        "Mobile applications (iOS / Android)",
        "E-commerce functionality",
        "Third-party chatbot integrations",
        "New brand identity work or logo redesign",
      ],
      revision_count: 2,
      timeline: "6 weeks from kickoff",
      total_hours: 40,
    },
    tasks: TASKS.map((t) => ({
      id: uid(),
      ...t,
      createdAt: new Date().toISOString(),
    })),
    createdAt: new Date(Date.now() - startedAgo).toISOString(),
  };

  saveProjects([project]);
  setActiveProjectId(projectId);
  return [project];
}
