import { client } from "./client/client";
import { server } from "./server/server";

export interface ProtocolType {
  model?: string;
  name: string;
  value: string;
}

export const actions = {
  client,
  server,
};
