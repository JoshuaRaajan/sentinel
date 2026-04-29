// Tiny localStorage wrapper. All app state lives here for now — swap to
// Mongo/Postgres post-deploy with no API change.
const KEY_PROJECTS = "sentinel.projects";
const KEY_ACTIVE = "sentinel.activeProjectId";
const KEY_VIEW = "sentinel.viewMode"; // 'provider' | 'client'

export function loadProjects() {
  try {
    const raw = localStorage.getItem(KEY_PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveProjects(projects) {
  localStorage.setItem(KEY_PROJECTS, JSON.stringify(projects));
}

export function getActiveProjectId() {
  return localStorage.getItem(KEY_ACTIVE);
}

export function setActiveProjectId(id) {
  if (id) localStorage.setItem(KEY_ACTIVE, id);
  else localStorage.removeItem(KEY_ACTIVE);
}

export function getViewMode() {
  return localStorage.getItem(KEY_VIEW) || "provider";
}

export function setViewMode(mode) {
  localStorage.setItem(KEY_VIEW, mode);
}

export function upsertProject(project) {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) projects[idx] = project;
  else projects.unshift(project);
  saveProjects(projects);
  return project;
}

export function getProject(id) {
  return loadProjects().find((p) => p.id === id) || null;
}

export function getActiveProject() {
  const id = getActiveProjectId();
  if (!id) return null;
  return getProject(id);
}

export function deleteProject(id) {
  const projects = loadProjects().filter((p) => p.id !== id);
  saveProjects(projects);
  if (getActiveProjectId() === id) setActiveProjectId(null);
}
