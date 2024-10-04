"use client";
import { Button } from "@/components/ui/button";
import { createCrew } from "@/service/crew/action";
import { createEmployedCrew } from "@/service/employed_crew/action";
import { Tables } from "@/types/database.types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function CreateGroopBtn({ profile }: { profile: Tables<"profile"> }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setPending(true);
    try {
      const createCrewRes = await createCrew({
        name: "Untitled Groop",
        profile_id: profile.id,
      });
      console.log(createCrewRes);
      if (createCrewRes) {
        const createEmployedCrewRes = await createEmployedCrew(profile.id, 0, {
          crew_id: createCrewRes.id,
          profile_id: profile.id,
          is_owner: true,
          is_favorite: false,
        });
        console.log(createEmployedCrewRes);
      }
      router.push(`/studio/${createCrewRes.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setPending(false);
    }
  };
  return (
    <Button
      variant="brand"
      className=""
      isLoading={pending}
      onClick={handleClick}
    >
      {!pending && <Plus size={16} className="mr-2" />}
      Create New Groop
    </Button>
  );
}

export default CreateGroopBtn;
