"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

import { Tables } from "@/types/database.types";
import {
  createEmployedCrew,
  getEmployedCrewListByProfileId,
} from "@/service/employed_crew/action";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

function HireBtn({
  profile,
  publishedCrewInfo,
}: {
  profile: Tables<"profile">;
  publishedCrewInfo: Tables<"published_crew">;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCrewEmployed, setIsCrewEmployed] = useState<
    Tables<"employed_crew"> | false
  >(false);
  const router = useRouter();

  const handleClick = async () => {
    if (isCrewEmployed) {
      console.log(isCrewEmployed);
      router.push(`/board/${isCrewEmployed.id}`);
    } else {
      setIsLoading(true);
      const InsertEmployedCrew = await createEmployedCrew(
        profile.id,
        publishedCrewInfo.usage,
        {
          crew_id: publishedCrewInfo.crew_id as number,
          profile_id: profile.id,
          is_owner: false,
          is_favorite: false,
        }
      );
      if (InsertEmployedCrew.data) {
        toast({
          title: "Groop Hired!",
          description: "You have successfully hired this groop.",
          action: (
            <ToastAction
              altText="Use this grooop"
              onClick={() => {
                router.push(`/board/${InsertEmployedCrew.data.id}`);
              }}
            >
              Go Now
            </ToastAction>
          ),
        });
        setIsCrewEmployed(InsertEmployedCrew.data);
      }
      setIsLoading(false);
    }
  };

  const checkIsHired = async () => {
    try {
      const employedCrewList = await getEmployedCrewListByProfileId(profile.id);

      const matchedCrew = employedCrewList.find(
        (crew) => crew.crew_id === publishedCrewInfo.crew_id
      );

      // console.log(matchedCrew);
      setIsCrewEmployed(matchedCrew || false);
    } catch (error) {
      console.error("employed_crew 조회 중 오류:", error);
      setIsCrewEmployed(false);
    }
  };
  useEffect(() => {
    checkIsHired();
  }, []);
  return (
    <Button
      className="w-full"
      size="lg"
      isLoading={isLoading}
      onClick={handleClick}
    >
      {isCrewEmployed ? "Use this groop" : "Hire this groop"}
    </Button>
  );
}

export default HireBtn;
