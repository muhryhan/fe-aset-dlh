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
  token: string | null;

  login: (data: {
    token: string;
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
      token: null,

      login: ({ token, role, user }) =>
        set({
          isLoggedIn: true,
          token,
          role,
          user,
        }),

      logout: () => {
        set({
          isLoggedIn: false,
          role: null,
          user: null,
          token: null,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
