const API_BASE =
  import.meta.env.VITE_API_BASE
  || "http://localhost:8000";

export async function getAnalytics() {

  try {

    const response = await fetch(
      `${API_BASE}/analytics/`
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