import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
  timeout: 90_000,
});

export async function checkScope({ taskName, taskDescription = "", sow }) {
  const { data } = await client.post("/check-scope", {
    task_name: taskName,
    task_description: taskDescription,
    sow,
  });
  return data; // { verdict, reason }
}

export async function structureScope(sow) {
  const { data } = await client.post("/structure-scope", { sow });
  return data; // { included_items, excluded_items, revision_count, timeline, total_hours }
}

export async function generateChangeOrder({
  projectName,
  clientName,
  taskName,
  taskDescription = "",
  originalSow,
  estimatedHours,
  hourlyRate,
  timelineImpactDays = null,
}) {
  const { data } = await client.post("/generate-change-order", {
    project_name: projectName,
    client_name: clientName,
    task_name: taskName,
    task_description: taskDescription,
    original_sow: originalSow,
    estimated_hours: estimatedHours,
    hourly_rate: hourlyRate,
    timeline_impact_days: timelineImpactDays,
  });
  return data.email; // string
}
