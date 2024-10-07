import { getCrewListByProfileID } from "@/service/crew/action";
import { getMyProfile } from "@/service/user/action";
import React, { useState } from "react";
import GroopCard from "./components/groopCard";
import Typography from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateGroopBtn from "./components/createGroopBtn";
import { redirect } from "next/navigation";

async function StudioPage() {
  const auth = await getMyProfile();
  if (!auth) return redirect("/auth");

  const crewList = await getCrewListByProfileID(auth?.profile.id);
  return (
    <div className="w-full mx-auto p-4">
      <div
        className={
          "flex flex-col text-center md:flex-row md:text-left items-center justify-between gap-4 mb-8"
        }
      >
        <Typography variant={"subtitle1"}>
          Welcome to groopy studio, {auth?.profile.name}!
        </Typography>
        <CreateGroopBtn profile={auth.profile} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {crewList &&
          (crewList?.length === 0 ? (
            <div>
              <Typography
                variant="text"
                className="p-4 text-center text-gray-500"
              >
                You don&apos;t have any groop yet. <br />
                Click the button above to start building new groop.
              </Typography>
            </div>
          ) : (
            crewList.map((crew) => <GroopCard key={crew.id} groop={crew} />)
          ))}
      </div>
    </div>
  );
}

export default StudioPage;
