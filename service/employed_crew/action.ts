"use server";
import { TablesInsert, TablesUpdate } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const getEmployedCrewListByProfileId = async (profileId: number) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('employed_crew')
      .select('*')
      .eq('profile_id', profileId)
      .eq('is_deleted', false);
  
    if (error) {
      throw new Error('employed_crew 목록 조회 중 오류가 발생했습니다.');
    }
  
    return data; 
  };
  
export const getEmployedCrewWithPublishedCrewData = async (employed_crew_id: number) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('employed_crew')
      .select('*')
      .eq('id', employed_crew_id).single();
  
    if(data){
        const { data: crewData, error: crewError } = await supabase
          .from('published_crew')
          .select('*')
          .eq('crew_id', data.crew_id)
        if (crewError) {
          throw new Error('published_crew 데이터 조회 중 오류가 발생했습니다.');
        }
        return {...data, latest_published_crew:crewData?.[crewData.length-1]};
    }

    if (error) {
      throw new Error('employed_crew 목록 조회 중 오류가 발생했습니다.');
    }
  
  };

export const createEmployedCrew = async (
    profileId: number,
    prevView: number|null,
    insertData: TablesInsert<"employed_crew">
  ) => {
    const supabase = createClient();
    // profile_id로 employed_crew 테이블에서 내역 조회
    const { data, error } = await supabase
      .from('employed_crew')
      .select('*')
      .eq('profile_id', profileId)
      .eq('crew_id', insertData.crew_id);
  
    if (error) {
      throw new Error('조회 중 오류가 발생했습니다.');
    }
  try{
  
    if (data.length === 0) {
      // 동일한 내역이 없을 때 insertData로 새로운 employed_crew 생성
      const { data: insertedData, error: insertError } = await supabase
      .from('employed_crew')
      .insert(insertData)
      .select().single(); 
      
      if (insertError) {
        throw new Error('employed_crew 생성 중 오류가 발생했습니다.');
      }
      const currentViewCount = prevView ?? 0;
      const { error: updateError } = await supabase
      .from('crew')
      .update({ usage: currentViewCount + 1 })
      .eq('id', insertData.crew_id);
      return { message: '새로운 employed_crew 생성 완료', data:insertedData };
    } else {
      const crew = data[0];
      
      if (!crew.is_deleted) {
        // 이미 존재하고 is_deleted가 false인 경우
        return { message: '이미 등록된 crew입니다.' };
      } else {
        // is_deleted가 true인 경우 is_deleted를 false로 업데이트
        const {data: updatedData, error: updateError} = await supabase
        .from('employed_crew')
        .update({ is_deleted: false })
        .eq('profile_id', profileId)
        .eq('crew_id', insertData.crew_id)
        .select().single();
          
        if (updateError) {
        throw new Error('employed_crew 업데이트 중 오류가 발생했습니다.');
        }
  
        
        return { message: 'is_deleted를 false로 업데이트했습니다.', data: updatedData };
      }
    }
  }finally{
    revalidatePath('/','layout');
  }
  };
  
export async function updateEmployedCrew(id:number, updateData:TablesUpdate<"employed_crew">) {
      const supabase = createClient();
    
      const { data, error } = await supabase
        .from('employed_crew')
        .update(updateData)
        .eq('id', id);
    
      if (error) {
        console.error(`Error updating employed_crew ${id}:`, error);
        return null;
      }
      revalidatePath('/groop');
      return data;
    }
    