"use server";
import { Tables, TablesInsert } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";


export const createCrew = async ( insertData:TablesInsert<"crew">) => {
    const supabase = createClient();
    const { data: insertedCrew, error: insertedCrewError } = await supabase
        .from("crew")
        .insert(insertData)
        .select()
        .single()
        if (insertedCrewError) {
            throw new Error('crew 생성 중 오류가 발생했습니다.');
          }
        return insertedCrew as Tables<"crew">
}

export const updateCrew = async ( crewId:number, updateData:TablesInsert<"crew">) => {
    const supabase = createClient();
    const { data: updatedCrew, error: updatedCrewError } = await supabase
        .from("crew")
        .update(updateData).eq("id", crewId)
        .select()
        .single()
        if (updatedCrewError) {
            throw new Error('crew 생성 중 오류가 발생했습니다.');
          }
        revalidatePath(`/`, "layout")
        return updatedCrew as Tables<"crew">
}


export const getCrewListByProfileID = async (profile_id: number) => {
    const supabase = createClient();
        const { data: crewList, error: crewListError } =
            await supabase
                .from("crew").select("*").eq("profile_id", profile_id).eq('is_deleted', false).order("updated_at", { ascending: false })
        return crewList

    }


export const getCrewInfoByID = async (crew_id:string | number) => {
    const supabase = createClient();
        const { data: crew, error: crewError } = await supabase
                .from("crew").select("*").eq("id", crew_id).single()
        return crew

    }

export const getCrewFullData = async (crewId: number) => {
    // Initialize the Supabase client
    const supabase = createClient();
  
    // Fetch the crew data
    const { data: crewData, error: crewError } = await supabase
      .from('crew')
      .select('*')
      .eq('id', crewId)
      .single();
  
    if (crewError) {
      console.error('Error fetching crew data:', crewError);
      throw crewError;
    }
  
    // Fetch tasks associated with the crew
    const { data: tasksData, error: tasksError } = await supabase
      .from('task')
      .select('*')
      .eq('crew_id', crewId)
      .eq('is_deleted', false);
  
    if (tasksError) {
      console.error('Error fetching tasks data:', tasksError);
      throw tasksError;
    }
  
    // Order tasksData according to crewData.task_ids
    let orderedTasks: Tables<'task'>[] = [];
  
    if (crewData.task_ids && crewData.task_ids.length > 0) {
      // Create a map of tasks by their ID for quick lookup
      const taskMap = new Map(tasksData.map((task) => [task.id, task]));
  
      // Map over the task_ids to create an ordered array of tasks
      orderedTasks = crewData.task_ids
        .map((id) => taskMap.get(id))
        .filter((task): task is Tables<'task'> => task !== undefined);
    } else {
      // If no task_ids are specified, use the tasksData as is
      orderedTasks = tasksData;
    }
  
    // Fetch agents associated with the crew
    const { data: agentsData, error: agentsError } = await supabase
      .from('agent')
      .select('*')
      .eq('crew_id', crewId)
      .eq('is_deleted', false);
  
    if (agentsError) {
      console.error('Error fetching agents data:', agentsError);
      throw agentsError;
    }
  
    // For each agent, fetch the associated tools
    const agentsWithTools = await Promise.all(
      agentsData.map(async (agent) => {
        const toolIds = agent.tool_ids || [];
  
        let tools: Tables<'tool'>[] = [];
        if (toolIds.length > 0) {
          const { data: toolsData, error: toolsError } = await supabase
            .from('tool')
            .select('*')
            .in('id', toolIds)
            .eq('is_deleted', false);
  
          if (toolsError) {
            console.error(`Error fetching tools for agent ${agent.id}:`, toolsError);
            throw toolsError;
          }
  
          tools = toolsData || [];
        }
  
        return {
          ...agent,
          tools,
        };
      })
    );
  
    // Construct the final data object with ordered tasks
    const finalData = {
      ...crewData,
      tasks: orderedTasks,
      agents: agentsWithTools,
    };
  
    return finalData;
  };