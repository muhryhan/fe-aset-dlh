import axios from "axios";
import Cookies from "js-cookie";
export function logoutUser(redirectTo = "/") {
  localStorage.removeItem("auth-storage");
  Cookies.remove("token", { path: "/" });
  Cookies.remove("username");
  Cookies.remove("id_user");

  window.location.href = redirectTo;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BASE,
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
  withCredentials: true,
});

// Tambahkan token ke setiap request jika tersedia
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (Unauthorized) → logout otomatis
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired, logging out...");
      logoutUser();
    }
    return Promise.reject(error);
  }
);

export default api;
