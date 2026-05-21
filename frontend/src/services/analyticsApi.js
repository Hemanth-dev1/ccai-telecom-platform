// Uses relative /api/ path — nginx reverse proxy routes to backend

export async function getAnalytics() {

  try {

    const response = await fetch(
      `/api/analytics/`
    );

    if (!response.ok) {

      throw new Error(
        "Failed to fetch analytics"
      );
    }

    return await response.json();

  } catch (error) {

    console.error(
      "Analytics API Error:",
      error
    );

    return null;
  }
}