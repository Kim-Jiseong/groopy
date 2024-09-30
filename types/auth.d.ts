import { User } from "@supabase/supabase-js";
import { Tables } from "./database.types";

export interface Auth{
    user: User | null;
    profile: Tables<"profile"> | null;
}