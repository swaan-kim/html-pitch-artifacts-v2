window.PITCH_SLIDES.push(
  {
    id: "team-business",
    layout: "team",
    tone: "light",
    meta: "TEAM · BUSINESS",
    claim: "Show that the team already understands the first customer.",
    members: [
      { initials: "AA", role: "USER INSIGHT", proof: "Direct problem experience" },
      { initials: "BB", role: "DISTRIBUTION", proof: "Access to the first community" },
      { initials: "CC", role: "BUSINESS", proof: "A path to paid validation" }
    ],
    footer: "Use real portraits only when identity itself supports the execution proof."
  },
  {
    id: "first-customer",
    layout: "growth",
    tone: "light",
    meta: "01 · FIRST CUSTOMER",
    claim: "Start where trust and access already exist.",
    metric: "01",
    metricLabel: "specific customer group with a painful repeat problem",
    stages: ["Own use", "Peers", "Paid users"],
    source: "Evidence · Interviews, community access, or existing channel"
  },
  {
    id: "go-to-market",
    layout: "growth",
    tone: "light",
    meta: "02 · GO-TO-MARKET",
    claim: "Turn one reachable community into a measurable funnel.",
    metric: "X→Y",
    metricLabel: "contact, activation, and payment targets",
    stages: ["Reach", "Try", "Pay"],
    source: "Assumption · State the period and conversion definition"
  },
  {
    id: "market-expansion",
    layout: "growth",
    tone: "light",
    meta: "03 · MARKET",
    claim: "Expand through adjacent customers, not a giant circle chart.",
    metric: "3",
    metricLabel: "credible stages from beachhead to larger market",
    stages: ["Individual", "Organization", "Global"],
    source: "Source · Primary market data for the chosen entry segment"
  },
  {
    id: "differentiation",
    layout: "contrast",
    tone: "light",
    meta: "04 · DIFFERENTIATION",
    claim: "Compare against the current operating method, not only products.",
    left: { label: "CURRENT ALTERNATIVE", value: "Manual + generic", detail: "Familiar but costly and inconsistent" },
    right: { label: "YOUR ADVANTAGE", value: "Specific + compounding", detail: "Clear wedge and accumulated learning" }
  },
  {
    id: "pricing",
    layout: "metric",
    tone: "dark",
    meta: "05 · BUSINESS MODEL",
    claim: "Make the charging unit understandable in one sentence.",
    metric: "$X",
    metricLabel: "per outcome the customer can predict and trust",
    note: "Separate the free entry point from the exact paid event.",
    source: "Assumption · Define unit, free allowance, and billing timing"
  },
  {
    id: "unit-economics",
    layout: "metric",
    tone: "dark",
    meta: "06 · COST CONTROL",
    claim: "Show what remains after the variable cost of one unit.",
    metric: "XX%",
    metricLabel: "contribution margin under the stated usage assumption",
    note: "Do not call infrastructure margin total company profit.",
    source: "Calculation · Price − variable cost; list excluded costs"
  },
  {
    id: "team-development",
    layout: "team",
    tone: "light",
    meta: "TEAM · DEVELOPMENT",
    claim: "Prove that the team can keep improving the system.",
    members: [
      { initials: "FE", role: "FRONTEND", proof: "Usable product flow" },
      { initials: "BE", role: "BACKEND", proof: "Reliable integration" },
      { initials: "AI", role: "MODEL", proof: "Data and evaluation loop" }
    ],
    footer: "Replace role labels with concrete shipped evidence and ownership."
  }
);
