import { LoaderState } from "@/types/useLoader";
import { create } from "zustand";

export const useLoader = create<LoaderState>()((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
