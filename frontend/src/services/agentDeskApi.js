// Uses relative /api/ path — nginx reverse proxy routes to backend

export async function getEscalations() {

  try {

    const response = await fetch(
      `/api/agent-desk/escalations`
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