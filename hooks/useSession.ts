import { actions } from "@/actions/serverActions/actions";
import { create } from "zustand";

export const useSession = create((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("session") || "null")
      : null,
  balance: 0,
  isFetchingBalance: false,
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
    set({ user: user });
  },
  fetchBalance: async () => {
    set({ isFetchingBalance: true }); // Start loading

    try {
      const state: any = useSession.getState();
      const id = state.user?.id;

      if (!id) return 0;

      const response = await actions.client.user.account.getBalance(id);

      if (response.status === 200) {
        const balance = response.data.balance ?? 0;
        set({ balance, isFetchingBalance: false }); // Update state
        return balance;
      }
    } catch (error) {
      console.error("Balance fetch failed:", error);
    }

    set({ isFetchingBalance: false }); // Stop loading on error
    return 0;
  },
}));
