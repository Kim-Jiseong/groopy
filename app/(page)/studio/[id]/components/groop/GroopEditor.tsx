"use client";
import Typography from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { CrewFullData } from "@/types/data";
import { Tables, TablesUpdate } from "@/types/database.types";
import { DropResult } from "@hello-pangea/dnd";
import { CloudUpload, Save } from "lucide-react";
import React, { useState } from "react";
import GroopProfile from "./GroopProfile";
import { Separator } from "@/components/ui/separator";
import TagNdetail from "./tagNdetail";
import GreetingNpq from "./greetingNpq";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

//name
//description
//image

//detail
//tag
//greeting
//pre_questions

function GroopEditor({
  crewInfo,
  setSaveTrigger,
  llms,
}: {
  crewInfo: CrewFullData;
  setSaveTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  llms: Tables<"llm">[];
}) {
  const [crewData, setCrewData] = useState(crewInfo);
  const [pendingSave, setPendingSave] = useState(false);

  const handleSave = async () => {
    setPendingSave(true);
    try {
      const { agents, tasks, ...crewUpdateData } = crewData;
      const { data: updatedCrew, error: crewUpdateError } = await supabase
        .from("crew")
        .update(crewUpdateData)
        .eq("id", crewInfo.id)
        .select()
        .single();
      if (crewUpdateError) throw crewUpdateError;
      console.log("crew_updated", updatedCrew);
      toast({
        title: "Changes saved!",
        description: "Groop change updated successfully!",
        variant: "brand",
      });
      setSaveTrigger((prev) => !prev);
    } catch (e) {
      console.log(e);
      toast({
        title: "Error saving groop:",
        variant: "destructive",
      });
    } finally {
      // await supabase.from("crew").upsert(crewData);
      setPendingSave(false);
    }
  };

  const handleUpdateCrew = (updatedFields: TablesUpdate<"crew">) => {
    setCrewData({ ...crewData, ...updatedFields });
  };

  return (
    <div className="relative flex flex-col mx-auto w-full ">
      <header className="sticky top-0 left-0 w-full h-14 px-4 py-2 bg-background border-b border-divider flex justify-between items-center gap-4 z-20">
        <Typography variant="subtitle1">Groop Setting</Typography>
        <div className="flex gap-2">
          <Button variant={"default"}>
            <CloudUpload size={18} className="mr-1" />
            Publish
          </Button>
          <Button
            onClick={handleSave}
            variant={"brand"}
            isLoading={pendingSave}
          >
            {!pendingSave && <Save size={18} className="mr-1" />}
            Save
          </Button>
        </div>
      </header>
      <div className="flex flex-col">
        <GroopProfile crewData={crewData} onUpdate={handleUpdateCrew} />
        <div className="flex w-full min-h-[calc(100vh-14.5rem)]">
          <div className="flex flex-col flex-1">
            <TagNdetail crewData={crewData} onUpdate={handleUpdateCrew} />
          </div>
          <Separator orientation={"vertical"} />
          <div className="flex flex-col flex-1">
            <GreetingNpq crewData={crewData} onUpdate={handleUpdateCrew} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroopEditor;
