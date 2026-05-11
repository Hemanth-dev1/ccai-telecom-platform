export const conversation = {
  id: "CV-48291",

  startedAt: "14:02 CET",

  language: "English",

  customer: {
    name: "Marcus Lindqvist",
    tenure: "4y 2mo",
    plan: "Unlimited 5G",
  },

  intent: {
    label: "Roaming activation issue",
    confidence: 94,
  },

  flow: {
    name: "Roaming Diagnostic v2.4",
    step: "Verify SIM provisioning",
    progress: 3,
    total: 5,
  },

  escalation: {
    status: "Monitored",
    risk: 0.32,
    reasons: [
      "Mild sentiment dip",
      "Repeated query",
    ],
  },

  sources: [
    {
      title: "Roaming activation — Nordics",
      type: "KNOWLEDGE BASE",
      confidence: 0.91,
    },
    {
      title: "SIM provisioning troubleshooting",
      type: "RUNBOOK",
      confidence: 0.86,
    },
    {
      title: "International data fair-use policy",
      type: "POLICY",
      confidence: 0.71,
    },
  ],
};