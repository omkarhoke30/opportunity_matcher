export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Whole days from today until the deadline (negative = already passed).
// Returns null when the opportunity has no deadline.
export function getDaysLeft(deadline) {
  if (!deadline) return null;
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((new Date(deadline).getTime() - today) / 86400000);
}

// "active" | "closed", derived from the deadline so the DB needs no status field
export function getStatus(deadline) {
  const days = getDaysLeft(deadline);
  return days === null || days >= 0 ? "active" : "closed";
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

// "react, node ,  " → ["react", "node"]
export function splitList(text = "") {
  return text.split(",").map((item) => item.trim()).filter(Boolean);
}

// "2026-11-28T00:00:00.000Z" → "2026-11-28" (what <input type="date"> needs)
export function toDateInput(value) {
  return value ? String(value).slice(0, 10) : "";
}
