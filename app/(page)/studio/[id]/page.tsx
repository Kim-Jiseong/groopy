"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import GroopEditor from "./components/groop/GroopEditor";
import TasksEditor from "./components/task/TasksEditor";
import AgentsEditor from "./components/agents/AgentsEditor";
import ToolsEditor from "./components/ToolsEditor";
// import { useQuery } from "@tanstack/react-query";
// import { getCrewInfo } from "@/service/crew/axios";
import Typography from "@/components/common/Typography";
import { Frown, Loader2 } from "lucide-react";
// import LoadingStudioId from "./loading";
import { getCrewFullData } from "@/service/crew/action";
import { CrewFullData } from "@/types/data";
import { Tables } from "@/types/database.types";
import { getLlms } from "@/service/llm/action";
import { getTools } from "@/service/tool/action";
import KnowledgeEditor from "./components/knowledge/knowledgeEditor";

const renderTabContent = (
  selectedTab: string,
  crewInfo: any,
  setSaveTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  llms: Tables<"llm">[],
  tools: Tables<"tool">[]
) => {
  switch (selectedTab) {
    case "crew":
      return (
        <GroopEditor
          crewInfo={crewInfo}
          setSaveTrigger={setSaveTrigger}
          llms={llms}
        />
      );
    case "tasks":
      return (
        <TasksEditor crewInfo={crewInfo} setSaveTrigger={setSaveTrigger} />
      );
    case "agents":
      return (
        <AgentsEditor
          crewInfo={crewInfo}
          setSaveTrigger={setSaveTrigger}
          llms={llms}
          tools={tools}
        />
      );
    case "knowledge":
      return <KnowledgeEditor crewInfo={crewInfo} />;
    default:
      return <div>Error: Not proper tab</div>;
  }
};

function StudioPage({ params }: { params: { id: number } }) {
  const [selectedTab, setSelectedTab] = useState("crew");
  const [saveTrigger, setSaveTrigger] = useState(false);
  const [crewInfo, setCrewInfo] = useState<CrewFullData | null>(null);
  const [tools, setTools] = useState<Tables<"tool">[]>([]);
  const [llms, setLlms] = useState<Tables<"llm">[]>([]);
  // const {
  //   data: crewInfo,
  //   status,
  //   error,
  // } = useQuery({
  //   queryKey: ["crewInfo", params.id],
  //   queryFn: () => getCrewInfo({ crewId: params.id }),
  //   refetchOnWindowFocus: false,
  //   staleTime: 2000,
  //   gcTime: 1000 * 60 * 60,
  // });

  // if (status === "pending") {
  //   return <LoadingStudioId />;
  // }

  // if (status === "error") {
  //   console.log("error", error);
  //   return <div>Something went wrong</div>;
  // }

  const getCrewFullInfo = async () => {
    const crewInfo = await getCrewFullData(params.id);
    console.log(crewInfo);
    setCrewInfo(crewInfo);
  };

  const getLLMList = async () => {
    const llms = await getLlms();
    // console.log(llms);
    setLlms(llms);
  };
  const getToolList = async () => {
    const tools = await getTools();
    // console.log(tools);
    setTools(tools);
  };

  useEffect(() => {
    getCrewFullInfo();
    getToolList();
  }, [saveTrigger]);

  useEffect(() => {
    getLLMList();
  }, []);

  return (
    <>
      <div className="hidden md:flex flex-row w-full">
        <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <div className="w-full  h-screen overflow-auto flex flex-col mx-auto">
          {crewInfo ? (
            renderTabContent(selectedTab, crewInfo, setSaveTrigger, llms, tools)
          ) : (
            <div className="w-full h-screen flex flex-col justify-center items-center">
              <Loader2 className="text-brand h-10 w-10 animate-spin" />
            </div>
          )}
        </div>
      </div>
      <div className="flex md:hidden flex-col w-full h-96 items-center justify-center p-4 text-center gap-4">
        <Frown size={100} />
        <Typography variant={"subtitle2"}>
          We don&apos;t support mobile studio yet. <br /> Please use desktop.
        </Typography>
      </div>
    </>
  );
}

export default StudioPage;
