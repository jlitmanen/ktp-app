import api from "./api";

export const authService = {
  login: async (credentials) => {
    const data = await api.post("/api/login", credentials);
    // Token is now stored in httpOnly cookie by backend
    return data;
  },
  logout: async () => {
    await api.post("/api/logout");
  },
  checkStatus: () => api.get("/api/auth/status"),
};
export default {
  auth: authService,
};
