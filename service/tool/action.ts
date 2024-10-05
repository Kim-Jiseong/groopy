"use server";
import { TablesInsert, TablesUpdate } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const getTools = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tool')
      .select('*').eq('is_deleted', false).order('created_at', { ascending: false });
  
    if (error) {
      throw new Error('tool 목록 조회 중 오류가 발생했습니다.');
    }
  
    return data; 
  };
