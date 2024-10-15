'use server'
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getKnowledgesByAgentID(agentId:number) {
    const supabase = createClient();
  
    const { data: knowledge, error: knowledgeError } = await supabase
    .from("knowledge").select("*").eq("agent_id", agentId).eq("is_deleted", false).order("created_at", {ascending:true})

  
    if (knowledgeError) {
        console.error(`Error fetching knowledge data(agent_id:${agentId}):`, knowledgeError);
        throw knowledgeError;
    }
    return knowledge;
  }
  