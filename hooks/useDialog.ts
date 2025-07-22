import { DialogState } from "@/types/useDialog";
import { create } from "zustand";

export const useDialog = create<DialogState>()((set) => ({
  isVisible: false,
  title: "",
  content: null,
  response: null,
  showDialog: (title: string, content: React.ReactNode) =>
    set(() => ({ isVisible: true, title, content })),
  closeDialog: () =>
    set(() => ({ isVisible: false, title: "", content: null })),
  setResponse: (response: any) => set((state) => ({ ...state, response })),
}));
