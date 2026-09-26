const productRows = [
  { name: "Item A", state: "PASS", value: "0.12" },
  { name: "Item B", state: "REVIEW", value: "0.61" },
  { name: "Item C", state: "ACTION", value: "0.94" }
];

window.PITCH_SLIDES.push(
  {
    id: "product-start",
    layout: "product",
    tone: "light",
    meta: "PRODUCT · START",
    claim: "Start with the state the user needs to understand now.",
    productLabel: "CONNECTED WORKSPACE",
    focus: "Status overview",
    rows: productRows,
    bullets: ["Connection is visible", "Risk is summarized", "The next action is obvious"]
  },
  {
    id: "product-content",
    layout: "product",
    tone: "light",
    meta: "PRODUCT · CONTENT",
    claim: "Move from the account level to the work item level.",
    productLabel: "CONTENT LIST",
    focus: "Prioritized view",
    rows: productRows,
    bullets: ["Sort by need", "Preserve context", "Avoid raw data overload"]
  },
  {
    id: "product-action",
    layout: "product",
    tone: "light",
    meta: "PRODUCT · ACTION",
    claim: "Make the core action feel immediate and reversible.",
    productLabel: "ACTION PANEL",
    focus: "Decision required",
    rows: productRows,
    bullets: ["Reason stays visible", "Action is one step", "Recovery remains available"]
  },
  {
    id: "product-history",
    layout: "product",
    tone: "light",
    meta: "PRODUCT · HISTORY",
    claim: "Keep a trace of what happened and why.",
    productLabel: "DECISION HISTORY",
    focus: "Audit trail",
    rows: productRows,
    bullets: ["Past action is searchable", "Rule and reason remain linked", "Changes can be explained"]
  },
  {
    id: "one-item-flow",
    layout: "steps",
    tone: "dark",
    meta: "ONE ITEM FLOW",
    claim: "Explain one complete path instead of the whole system at once.",
    steps: [
      { number: "01", title: "Input", detail: "Collect one real item." },
      { number: "02", title: "Decision", detail: "Combine signal and standard." },
      { number: "03", title: "Outcome", detail: "Act and retain evidence." }
    ]
  },
  {
    id: "ax-paradox",
    layout: "contrast",
    tone: "dark",
    meta: "THE AX PARADOX",
    claim: "Automation should reduce work, not move it elsewhere.",
    left: { label: "BAD AUTOMATION", value: "More review", detail: "Volume moves, responsibility stays" },
    right: { label: "TRUSTED AUTOMATION", value: "Only needed judgment", detail: "Routine work disappears" }
  },
  {
    id: "trusted-operation",
    layout: "steps",
    tone: "dark",
    meta: "TRUSTED OPERATION",
    claim: "Leave people only the decisions that require people.",
    steps: [
      { number: "01", title: "Auto-pass", detail: "Clear low-risk cases" },
      { number: "02", title: "Ask", detail: "Only ambiguous cases" },
      { number: "03", title: "Explain", detail: "Reason, rule, and outcome" }
    ]
  },
  {
    id: "model-strategy",
    layout: "contrast",
    tone: "dark",
    meta: "BUILD · BUY STRATEGY",
    claim: "Explain what becomes a defensible product asset.",
    left: { label: "RENTED CAPABILITY", value: "Generic API", detail: "Fast start · limited ownership" },
    right: { label: "COMPOUNDING ASSET", value: "Domain system", detail: "Feedback, data, and workflow improve together" }
  }
);
