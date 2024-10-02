"use client";

import { Provider } from "@supabase/supabase-js";

import { GoogleIcon } from "@/components/icons";
import { oAuthSignIn } from "./login/action";
import Typography from "@/components/common/Typography";
import { Button } from "@/components/ui/button";

// type OAuthProvider = {
//   name: Provider;
//   displayName: string;
//   icon?: JSX.Element;
// };

export function OAuthButtons({
  next,
  lastSignedInMethod,
}: {
  next?: string | null;
  lastSignedInMethod?: string;
}) {
  // const oAuthProviders: OAuthProvider[] = [
  //   {
  //     name: "google",
  //     displayName: "구글",
  //     icon: <GoogleIcon />,
  //   },
  // ];

  return (
    <>
      {/* {oAuthProviders.map((provider) => (
        <Button
          key={provider.name}
          className="relative w-full flex items-center justify-center gap-2"
          //   variant="outline"
          onClick={async () => {
            await oAuthSignIn(provider.name);
          }}
        >
          {provider.icon}
          Login with {provider.displayName}
          {lastSignedInMethod === "google" && (
            <div className="absolute top-1/2 -translate-y-1/2 left-full whitespace-nowrap ml-8 bg-accent px-4 py-1 rounded-md text-xs text-foreground/80">
              <div className="absolute -left-5 top-0 border-background border-[12px] border-r-accent" />
              Recently signed in
            </div>
          )}
        </Button>
      ))} */}
      <Button
        // onClick={() => console.log(callbackUrl)}
        variant={"secondary"}
        onClick={async () => {
          await oAuthSignIn("google", next);
        }}
        size="lg"
        className={"gap-2 border-2 border-brand mt-10 hover:bg-brand/30"}
      >
        <GoogleIcon />
        <Typography variant={"text"} style={{ fontWeight: 700 }}>
          Continue with Google
        </Typography>
      </Button>
    </>
  );
}
