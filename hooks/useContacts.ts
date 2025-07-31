import { actions } from "@/actions/serverActions/actions";
import { create } from "zustand";

export const useContacts = create<any>()((set) => ({
  contacts: [],
  isAdding: false,
  addToContact: (contact: any) => {
    set({ isAdding: true }); //

    set((state: any) => ({
      contacts: [...state.contacts, contact],
      // isAdding: false,
    }));
  },
  removeContact: (userId: string) => {
    const prev = useContacts.getState();
    prev.contacts = prev.contacts.filter(
      (contact: any) => contact.userId !== userId
    );
    set(prev);
  },
  find: (userId: string) => {
    const prev = useContacts.getState();
    return prev.contacts.find((contact: any) => contact?.userId === userId);
  },
  fetchContacts: async (userId: string) => {
    const response = await actions.client.user.contacts.listAll(userId);
    if (response.status === 200) {
      set({ contacts: response.data });
    } else {
      set({ contacts: [] });
    }
  },
  toggleIsAdding: (val: boolean) =>
    set((state: any) => ({ ...state, isAdding: val })),
}));
