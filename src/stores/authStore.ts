import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "kepalaDinas" | "bendahara" | "admin";

type AuthState = {
  isLoggedIn: boolean;
  role: Role | null;
  user: {
    id: string;
    name: string;
  } | null;

  login: (data: {
    role: Role | null;
    user: { id: string; name: string };
  }) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      role: null,
      user: null,

      login: ({ role, user }) =>
        set({
          isLoggedIn: true,
          role,
          user,
        }),

      logout: () => {
        set({
          isLoggedIn: false,
          role: null,
          user: null,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
