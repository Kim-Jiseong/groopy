import { Tables } from "./database.types";

export type AgentWithTools = Tables<"agent"> & { tools: Tables<"tool">[] };


export type CrewFullData = Tables<"crew"> & {
    tasks: Tables<"task">[];
    agents: AgentWithTools[];
  };