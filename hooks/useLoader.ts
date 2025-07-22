import { LoaderState } from "@/types/useLoader";
import { create } from "zustand";

export const useLoader = create<LoaderState>()((set) => ({
  loading: false,
  text: "",
  setLoading: (loading, text?: string) =>
    set(() => {
      if (loading === false) {
        return { loading: loading, text: "" };
      }
      return { loading: loading, text: loading === true ? text ?? "" : "" };
    }),
}));
