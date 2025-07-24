import { BusinessProtocols } from "./BusinessProtocols";

const initializeDefaults = async () => {
  Promise.all([BusinessProtocols.initializeDefaults()]);
};

export const defaults = {
  initializeDefaults,
};
