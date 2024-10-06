import { Tables, TablesUpdate } from "./database.types";

export type AgentWithTools = Tables<"agent"> & { tools: Tables<"tool">[] };


export type CrewFullData = Tables<"crew"> & {
    tasks: Tables<"task">[];
    agents: AgentWithTools[];
  };


export type Cycle = TablesUpdate<"cycle"> & {
    messages: Tables<"message">[]; 
  };
   
  
export type ChatFullData = TablesUpdate<"chat"> & {
  cycles: Cycle[];
  };

