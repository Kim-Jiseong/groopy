"use server";
import { Tables, TablesUpdate } from "@/types/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const getMyProfile = async () => {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", user.id)
      .single();
    revalidatePath("/", "layout");
    return { user: user, profile: profile as Tables<"profile"> };
  }
  return null;
};

export const updateMyProfile = async ({updateData}:{updateData:TablesUpdate<"profile">}) => {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (user) {
    const { data: updatedProfile, error: profileUpdateError } = await supabase
      .from("profile")
      .update(updateData)
      .eq("user_id", user.id)
      .select()
      .single();
    revalidatePath("/", "layout");
    if (profileUpdateError) {
      console.log(profileUpdateError )
      throw new Error('profile 업데이트 중 오류가 발생했습니다.');

      }
      return updatedProfile
  }
  return null;
};
