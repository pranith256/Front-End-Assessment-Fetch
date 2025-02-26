const BASE_URL = process.env.BASE_URL || "https://frontend-take-home-service.fetch.com";


export const login = async (name: string, email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    return response.ok;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};
