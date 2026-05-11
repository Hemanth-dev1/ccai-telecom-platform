const API_BASE =
  "http://localhost:8000";

export async function sendMessage(
  message
) {

  try {

    const response = await fetch(
      `${API_BASE}/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          message,

          session_id: "session-001",

        }),
      }
    );

    if (!response.ok) {

      throw new Error(
        "Failed to fetch response"
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "API Error:",
      error
    );

    return {

      reply:
        "Backend unavailable.",

      intent: "unknown",

      flow: "unknown",

      confidence: 0,

      sources: [],

      escalation: false,

      trace: {},
    };
  }
}