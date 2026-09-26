window.PITCH_SLIDES.push(
  {
    id: "setup-comparison",
    layout: "contrast",
    tone: "light",
    meta: "QUICK SETUP",
    claim: "Let users define the boundary with direct comparisons.",
    left: { label: "WEAK EXAMPLE", value: "Keep", detail: "A low-friction choice" },
    right: { label: "STRONG EXAMPLE", value: "Act", detail: "The boundary becomes visible" }
  },
  {
    id: "fast-calibration",
    layout: "steps",
    tone: "light",
    meta: "FAST CALIBRATION",
    claim: "Convert a few choices into a usable starting profile.",
    steps: [
      { number: "01", title: "Choose", detail: "Compare representative cases." },
      { number: "02", title: "Calibrate", detail: "Create the initial threshold." },
      { number: "03", title: "Refine", detail: "Update it with real use." }
    ]
  },
  {
    id: "training-data",
    layout: "metric",
    tone: "light",
    meta: "MODEL · DATA",
    claim: "Prove that the model starts from relevant data.",
    metric: "XXXK",
    metricLabel: "domain examples across the required labels",
    note: "Show dataset size only when label quality and relevance are also clear.",
    source: "Source · Dataset owner, dataset name, version"
  },
  {
    id: "context-inference",
    layout: "contrast",
    tone: "light",
    meta: "MODEL · CONTEXT",
    claim: "Show how context changes an otherwise identical signal.",
    left: { label: "TEXT ONLY", value: "Ambiguous score", detail: "The model sees a surface signal" },
    right: { label: "WITH CONTEXT", value: "Useful decision", detail: "Target and profile resolve the meaning" }
  },
  {
    id: "hybrid-decision",
    layout: "steps",
    tone: "light",
    meta: "HYBRID DECISION ENGINE",
    claim: "Do not present the model score as the final answer.",
    steps: [
      { number: "01", title: "Model signal", detail: "Category, risk, and confidence" },
      { number: "02", title: "User standard", detail: "Personal threshold and preference" },
      { number: "03", title: "Final action", detail: "Pass, review, or execute" }
    ]
  }
);
