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
        const { data: crew, error: crewError } =
            await supabase
                .from("crew").select("*").eq("id", crew_id).single()
        return crew

    }

export const getCrewFullInfoByID = async (crew_id: number) => {
        const supabase = createClient();
        const { data: crewData, error: crewError } = 
        await supabase
            .from("crew")
            .select("*")
            .eq("id", crew_id)
            .single();
    
        if (crewData && crewData.task_ids) {
            // task_ids 배열에 맞춰 tasks를 가져오기
            const { data: tasksData, error: tasksError } = 
                await supabase
                    .from("task")
                    .select("*")
                    .in("id", crewData.task_ids);  // task_ids 배열 내에 있는 task들만 선택
    
            // 각 task에 연결된 agents 가져오기
            const { data: agentsData, error: agentsError } = 
                await supabase
                    .from("agent")
                    .select("*")
                    .in("task_id", crewData.task_ids);  // task_ids 배열 내의 task에 연결된 agents 선택
    
            if (tasksData && agentsData && crewData.task_ids) {
                // task_ids 배열이 null이 아닌지 다시 한 번 체크 후 non-null assertion 사용
                const sortedTasks = tasksData.sort((a, b) => 
                    crewData.task_ids!.indexOf(Number(a.id)) - crewData.task_ids!.indexOf(Number(b.id))
                );
    
                const result = {
                    ...crewData,
                    tasks: sortedTasks, 
                    agents: agentsData 
                };
    
                console.log(result, tasksData, agentsData);
                return result;
            }
        }
    };
    