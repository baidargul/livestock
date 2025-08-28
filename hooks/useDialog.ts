import { DialogState } from "@/types/useDialog";
import { create } from "zustand";

export const useDialog = create<DialogState>()((set) => ({
  isVisible: false,
  title: "",
  message: "",
  layer: "",
  secondLayer: "",
  content: null,
  response: null,
  showDialog: (title: string, content?: React.ReactNode, message?: string) =>
    set(() => ({ isVisible: true, title, content, message })),
  closeDialog: () =>
    set(() => ({ isVisible: false, title: "", content: null, message: "" })),
  setLayer: (newLayer: string) =>
    set((state) => ({ ...state, layer: newLayer })),
  setSecondLayer: (newLayer: string) =>
    set((state) => ({ ...state, secondLayer: newLayer })),
  setResponse: (response: any) => set((state) => ({ ...state, response })),
}));
