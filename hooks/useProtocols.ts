import { actions } from "@/actions/serverActions/actions";
import { create } from "zustand";

export const useProtocols = create<{
  protocols: any;
  fetch: () => void;
  get: (name: string) => any;
}>()((set) => ({
  protocols: null,
  fetch: async () => {
    let protocols = await actions.client.protocols.BusinessProtocols.listAll();
    if (protocols.status === 200) {
      let temp = {};
      for (const protocol of protocols.data) {
        temp = { ...temp, [protocol.name]: Number(protocol.value) };
      }
      protocols = temp;
    }
    set({ protocols });
  },
  get: (name: string) => {
    return useProtocols.getState().protocols[name];
  },
}));
