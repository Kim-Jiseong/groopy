"use server";
import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const getMyProfile = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if(user){
        const { data: profile, error: profileError } = await supabase.from("profile").select("*").eq("user_id", user.id).single()
        revalidatePath("/", "layout");
        return { user: user, profile: profile as Tables<"profile"> };
      }
      return null
    }