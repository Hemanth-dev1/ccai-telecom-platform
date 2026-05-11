const API_BASE =
  import.meta.env.VITE_API_BASE
  || "http://localhost:8000";


export async function getEscalations() {

  try {

    const response = await fetch(
      `${API_BASE}/agent-desk/escalations`
    );

    if (!response.ok) {

      throw new Error(
        "Failed to fetch escalations"
      );
    }

    return await response.json();

  } catch (error) {

    console.error(error);

    return {

      queue: [],

      total: 0,
    };
  }
}