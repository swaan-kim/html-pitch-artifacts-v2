window.PITCH_SLIDES.push(
  {
    id: "api-contract",
    layout: "api",
    tone: "light",
    meta: "SYSTEM · API CONTRACT",
    claim: "Reduce the product flow to the few APIs that prove it works.",
    endpoints: [
      { method: "PUT", path: "/profile", role: "Save the user standard" },
      { method: "POST", path: "/items/classify", role: "Return decision and reason" },
      { method: "POST", path: "/items/{id}/action", role: "Apply and record the outcome" }
    ]
  },
  {
    id: "frontend-architecture",
    layout: "architecture",
    tone: "dark",
    meta: "FRONTEND ARCHITECTURE",
    claim: "Show how the interface proves the end-to-end flow.",
    layers: [
      { label: "VIEW", items: ["Dashboard", "Decision UI"] },
      { label: "ADAPTER", items: ["API client", "Mock / live switch"] },
      { label: "SERVER", items: ["REST API", "Events"] }
    ]
  },
  {
    id: "backend-architecture",
    layout: "architecture",
    tone: "dark",
    meta: "SYSTEM ARCHITECTURE",
    claim: "Separate synchronous product actions from background work.",
    layers: [
      { label: "INPUT", items: ["Client", "Webhook"] },
      { label: "CORE", items: ["API", "Worker", "Model"] },
      { label: "STATE", items: ["Database", "Audit log"] }
    ]
  },
  {
    id: "database-architecture",
    layout: "architecture",
    tone: "dark",
    meta: "DATA ARCHITECTURE",
    claim: "Organize data around decisions, feedback, and traceability.",
    layers: [
      { label: "CONTEXT", items: ["User", "Content", "Item"] },
      { label: "DECISION", items: ["Label", "Score", "Rule"] },
      { label: "LEARNING", items: ["Action", "Feedback", "Version"] }
    ]
  }
);
