const BASE_URL = process.env.BASE_URL || "https://frontend-take-home-service.fetch.com";


export const getBreeds = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/dogs/breeds`, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to fetch breeds");
    return await response.json();
  } catch (error) {
    console.error("Error fetching breeds:", error);
    return [];
  }
};

export const searchDogs = async (breed: string = "", size: number = 25, from: number = 0, sort: string = "") => {
    try {
      let url = `${BASE_URL}/dogs/search?size=${size}&from=${from}`;
      if (breed) url += `&breeds=${breed}`;
      if (sort) url += `&sort=${sort}`;
  
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to search dogs");
      return await response.json();
    } catch (error) {
      console.error("Error searching for dogs:", error);
      return { resultIds: [], total: 0, next: null, prev: null };
    }
  };


export const getDogsByIds = async (dogIds: string[]) => {
  try {
    const response = await fetch(`${BASE_URL}/dogs`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dogIds),
    });

    if (!response.ok) throw new Error("Failed to fetch dog details");
    return await response.json();
  } catch (error) {
    console.error("Error fetching dogs by IDs:", error);
    return [];
  }
};


export const getMatch = async (dogIds: string[]) => {
  try {
    const response = await fetch(`${BASE_URL}/dogs/match`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dogIds),
    });

    if (!response.ok) throw new Error("Failed to fetch match");
    const data = await response.json();
    return data.match;
  } catch (error) {
    console.error("Error fetching match:", error);
    return null;
  }
};
