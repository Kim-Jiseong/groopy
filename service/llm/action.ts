"use server";
import { TablesInsert, TablesUpdate } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const getLlms = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('llm')
      .select('*')
  
    if (error) {
      throw new Error('llm 목록 조회 중 오류가 발생했습니다.');
    }
  
    return data; 
  };
