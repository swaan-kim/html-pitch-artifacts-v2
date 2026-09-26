window.PITCH_SLIDES.push(
  {
    id: "cover",
    layout: "cover",
    tone: "dark",
    meta: "OPENING",
    claim: "One sharp sentence should open the whole story.",
    support: "Name the audience, the problem, and the change you create. Keep the product mark visual, not decorative.",
    accent: "the whole story"
  },
  {
    id: "problem-impact",
    layout: "contrast",
    tone: "dark",
    meta: "PROBLEM",
    claim: "Show that the problem affects more than one person.",
    left: { label: "DIRECT", value: "Primary user", detail: "Time, stress, cost, or risk" },
    right: { label: "SECONDARY", value: "Everyone around them", detail: "Audience, team, or community impact" }
  },
  {
    id: "problem-evidence",
    layout: "metric",
    tone: "dark",
    meta: "PROBLEM · EVIDENCE",
    claim: "Use one sourced number to prove urgency.",
    metric: "XX%",
    metricLabel: "replace with the strongest verified problem statistic",
    note: "The sentence beside the number should explain why the audience should care.",
    source: "Source · Organization, original report, year"
  },
  {
    id: "status-quo-limit",
    layout: "steps",
    tone: "dark",
    meta: "STATUS QUO · LIMIT",
    claim: "Explain why the existing system cannot solve it alone.",
    steps: [
      { number: "01", title: "One rule", detail: "A generic standard misses individual needs." },
      { number: "02", title: "Wrong incentive", detail: "The platform optimizes for a broader goal." },
      { number: "03", title: "Missing context", detail: "The owner knows what the system cannot." }
    ]
  },
  {
    id: "problem-intensity",
    layout: "contrast",
    tone: "dark",
    meta: "LIMITATION · INTENSITY",
    claim: "The category is not enough; intensity changes the decision.",
    left: { label: "LOW", value: "Allow or observe", detail: "Weak signal · low impact" },
    right: { label: "HIGH", value: "Review or act", detail: "Strong signal · high impact" }
  },
  {
    id: "problem-context",
    layout: "contrast",
    tone: "dark",
    meta: "INSIGHT · CONTEXT",
    claim: "The same input means something different by context.",
    left: { label: "CONTEXT A", value: "Acceptable", detail: "Audience, category, relationship" },
    right: { label: "CONTEXT B", value: "Harmful", detail: "Target, intent, accumulated history" }
  },
  {
    id: "platform-gap",
    layout: "contrast",
    tone: "dark",
    meta: "PLATFORM GAP",
    claim: "Turn the unsolved gap into the product opportunity.",
    left: { label: "PLATFORM", value: "Common baseline", detail: "Protects everyone with one broad rule" },
    right: { label: "PRODUCT", value: "Owner-specific layer", detail: "Adds the decision the platform cannot know" }
  }
);
