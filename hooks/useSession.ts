import { create } from "zustand";

export const useSession = create((set) => ({
  user: null,
  getUser: () => JSON.parse(localStorage.getItem("session") || "{}"),
  logoutUser: () => {
    set({ user: null });
    localStorage.removeItem("session");
  },
  setUser: (user: any) => {
    localStorage.setItem("session", JSON.stringify(user));
    set({ user });
  },
}));
