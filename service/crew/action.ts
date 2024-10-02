"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const getCrewInfoByID = async (crew_id:string | number) => {
    const supabase = createClient();
        const { data: crew, error: crewError } =
            await supabase
                .from("crew").select("*").eq("id", crew_id).single()
        return crew

    }