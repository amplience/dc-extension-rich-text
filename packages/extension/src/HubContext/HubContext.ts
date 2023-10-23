import { createContext } from "react";
export interface HubContext {
  hub?: any;
}

export default createContext<HubContext>({});
