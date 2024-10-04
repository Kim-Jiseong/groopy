"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";

function SignInBtn() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/auth");
  };
  return (
    <Button className="w-full" size="lg" onClick={handleClick}>
      Sign in for something special!
    </Button>
  );
}

export default SignInBtn;
