import api from "./api";

export const authService = {
  login: async (credentials) => {
    const data = await api.post("/api/login", credentials);
    if (data.token) localStorage.setItem("token", data.token);
    return data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  // ADD THIS FUNCTION:
  checkStatus: () => api.get("/api/auth/status"),
};
export default {
  auth: authService,
};
