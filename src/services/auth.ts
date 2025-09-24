import api from "./api";
import { useAuthStore } from "../stores/authStore";

export function forceLogout() {
  useAuthStore.getState().logout();
  // panggil logout backend (hapus cookie)
  api.post("/api/logout").finally(() => {
    window.location.href = "/";
  });
}
