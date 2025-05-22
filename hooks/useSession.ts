import { create } from "zustand";

export const useSession = create((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("session") || "null")
      : null,
  getUser: () => {
    if (typeof window === "undefined") return null;
    const raw = JSON.parse(localStorage.getItem("session") || "null");
    if (raw && raw.id) {
      return raw;
    } else {
      return null;
    }
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
