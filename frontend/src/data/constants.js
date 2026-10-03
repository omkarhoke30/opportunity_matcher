// Change the brand name here and it updates everywhere.
export const APP_NAME = "OpportunityHub";

// Matches the "type" enum in opportunity.model.js
export const opportunityTypes = {
  hackathon:   { label: "Hackathon",   icon: "fa-code" },
  workshop:    { label: "Workshop",    icon: "fa-lightbulb" },
  competition: { label: "Competition", icon: "fa-trophy" },
  internship:  { label: "Internship",  icon: "fa-briefcase" },
  event:       { label: "Event",       icon: "fa-calendar-days" },
  project:     { label: "Project",     icon: "fa-diagram-project" },
  scholarship: { label: "Scholarship", icon: "fa-award" },
  job:         { label: "Job",         icon: "fa-suitcase" },
  other:       { label: "Other",       icon: "fa-star" },
};

// Donut chart colours on the admin dashboard
export const typeColors = {
  hackathon: "#4f7cff",
  workshop: "#22d3ee",
  competition: "#19c39a",
  internship: "#f5c542",
  event: "#f59e42",
  project: "#f472b6",
  scholarship: "#fb923c",
  job: "#2dd4bf",
  other: "#94a3b8",
};
