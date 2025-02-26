const BASE_URL = process.env.BASE_URL ||  "https://frontend-take-home-service.fetch.com";

export const getLocationsByZip = async (zipCodes: string[]) => {
  if (zipCodes.length === 0) return [];

  try {
    const response = await fetch(`${BASE_URL}/locations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(zipCodes),
    });

    if (!response.ok) throw new Error("Failed to fetch locations");
    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};


export const searchLocations = async (
  city?: string,
  states?: string[],
  geoBoundingBox?: {
    top?: { lat: number; lon: number };
    left?: { lat: number; lon: number };
    bottom?: { lat: number; lon: number };
    right?: { lat: number; lon: number };
    bottom_left?: { lat: number; lon: number };
    top_left?: { lat: number; lon: number };
  },
  size: number = 25,
  from: number = 0
) => {
  try {
    const body: any = { size, from };
    if (city) body.city = city;
    if (states) body.states = states;
    if (geoBoundingBox) body.geoBoundingBox = geoBoundingBox;

    const response = await fetch(`${BASE_URL}/locations/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Failed to search locations");
    return await response.json();
  } catch (error) {
    console.error("Error searching locations:", error);
    return { results: [], total: 0 };
  }
};
