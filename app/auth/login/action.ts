"use server";
// auth error code: https://supabase.com/docs/reference/javascript/auth-error-codes

import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
// import { getURL } from "@/utils/helpers";
import { cookies } from "next/headers";
import { getURL } from "@/utils/helpers";

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut({ scope: "local" });
  revalidatePath("/", "layout");
  redirect("/", RedirectType.push);
}

export async function oAuthSignIn(provider: Provider, nextUrl?: string | null) {
  if (!provider) {
    return redirect(
      `/login?message=${encodeURIComponent(
        "Something went wrong. Please try again."
      )}`
    );
  }

  const supabase = createClient();
  const next = nextUrl ? `?next=${nextUrl}` : "";
    const redirectUrl = getURL("/auth/callback");
    // console.log("redirectUrl", redirectUrl);
    // const redirectUrl = getURL("/auth/callback" + next);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
      redirectTo: redirectUrl,
      queryParams: {
        // we need this to be able to select an account from google consent page when logging in after logging out
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  
  if (error) {
    redirect(`/login?message=${encodeURIComponent("로그인에 실패했습니다.")}`);
  }

  const cookieJar = cookies();
  cookieJar.set("lastSignedInMethod", provider);
  revalidatePath("/", "layout");

  return redirect(data.url);
}

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
