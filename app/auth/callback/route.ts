import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions

export async function GET(request: Request) {
  console.log("Started Callback", );
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  
  if (code) {
    console.log("Callback code", code);
    const supabase = createClient();
    const { data: sessionData, error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);
    if (!sessionError) {
      const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", sessionData.user.id);
      console.log("Session Data:", sessionData);
      console.log("Callback profile", profile);
      if(profileError){
        console.log(profileError)
      }
      if (profile?.length === 0) {
        console.log("Create Profile");
        // next = "/onboarding";
        const { data: insertData, error: insertError } = await supabase
        .from("profile")
        .insert([
          {
            user_id: sessionData.user.id,
            name: sessionData.user.user_metadata.full_name,
            email: sessionData.user.email,
            image: sessionData.user.user_metadata.avatar_url,
            coin: 0,
          },
        ])
        .select();
        console.log("Callback insert", insertData, insertError);

      }
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(
    `${origin}/login?message=${encodeURIComponent(
      "Login failed. Please try again."
    )}`
  ); 
  // return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
