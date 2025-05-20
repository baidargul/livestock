import { create } from "zustand";

export const useSession = create((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("session") || "null")
      : null,
  getUser: () => {
    if (typeof window === "undefined") return null;
    return JSON.parse(localStorage.getItem("session") || "null");
  },
  logoutUser: () => {
    set({ user: null });
    localStorage.removeItem("session");
  },
  setUser: (user: any) => {
    localStorage.setItem("session", JSON.stringify(user));
    set({ user });
  },
}));
