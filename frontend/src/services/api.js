// All backend calls live here. Pages never call fetch directly.
// In development Vite forwards "/api" to the Express server (see vite.config.js),
// so the browser sees one origin and the login cookie just works.

const BASE = "/api";

// this is function form where parameter decides the which request will be send 
async function request(path, { method = "GET", body } = {}) {
  const response = await fetch(BASE + path, {
    method,
    credentials: "include", // send the login cookie
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

// { search: "react", type: "" } → "?search=react"  (empty values are skipped)
function toQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export const authApi = {
  register: (body) => request("/auth/register", { method: "POST", body }),
  login: (body) => request("/auth/login", { method: "POST", body }),
  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }),
};

export const opportunityApi = {
  list: (params) => request(`/opportunities${toQuery(params)}`),
  get: (id) => request(`/opportunities/${id}`),
  create: (body) => request("/opportunities", { method: "POST", body }),
  update: (id, body) => request(`/opportunities/${id}`, { method: "PUT", body }),
  remove: (id) => request(`/opportunities/${id}`, { method: "DELETE" }),
};

export const profileApi = {
  get: () => request("/profile"),
  update: (body) => request("/profile", { method: "PUT", body }),
};

export const applicationApi = {
  list: () => request("/applications"),
  get: (id) => request(`/applications/${id}`),
  apply: (opportunityId) => request("/applications", { method: "POST", body: { opportunityId } }),
};

export const savedApi = {
  list: () => request("/saved"),
  save: (id) => request(`/saved/${id}`, { method: "POST" }),
  unsave: (id) => request(`/saved/${id}`, { method: "DELETE" }),
};

export const adminApi = {
  stats: () => request("/admin/stats"),
  students: () => request("/admin/students"),
  removeStudent: (id) => request(`/admin/students/${id}`, { method: "DELETE" }),
};
