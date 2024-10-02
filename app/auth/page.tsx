"use client";
import Typography from "@/components/common/Typography";
import { motion } from "framer-motion";
import React from "react";
import { OAuthButtons } from "./oauth-signin";
import { useParams } from "next/navigation";

function Auth({ searchParams }: { searchParams: any }) {
  // console.log(searchParams.next);
  const next = searchParams?.next || null;
  // const next = searchParams.get("next") || null;
  return (
    <div
      className={"w-full h-screen flex flex-col items-center justify-center "}
    >
      {/* <div className="max-w-xl text-center justify-center flex flex-col gap-4 p-8">
        <Typography variant={"headings"}>Groopy&nbsp;</Typography>
        <Typography variant={"subtitle2"}>
          Try out a professional AI Agent team in just 10 seconds.
          <br /> Make your own AI team in 10 minutes
        </Typography>
        <OAuthButtons next={next} />
      </div> */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-background p-8 rounded-lg shadow-2xl w-full max-w-xl relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-center mb-6 text-foreground"
        >
          Welcome to groopy
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center text-lg text-foreground/50 mb-6"
        >
          Try out a professional AI Agent team just in 10 seconds.
          <br /> Make your own AI team in 10 minutes
        </motion.p>
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <OAuthButtons next={next} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Auth;
