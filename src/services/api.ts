import axios from "axios";
import { forceLogout } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BASE,
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
  withCredentials: true, // Cookie HttpOnly otomatis ikut
});

// Logout otomatis
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);

export default api;
