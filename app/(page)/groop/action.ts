
import { TablesInsert, TablesUpdate } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEmployedCrew(insertData: TablesInsert<"employed_crew">) {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from('employed_crew')
      .update(insertData)

    if (error) {
      console.error(`Error creating employed_crew:`, error);
      return null;
    }
  
    return data;
  }
  
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
  