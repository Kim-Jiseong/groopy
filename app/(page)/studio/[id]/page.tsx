"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import GroopEditor from "./components/GroopEditor";
import TasksEditor from "./components/TasksEditor";
import AgentsEditor from "./components/AgentsEditor";
import ToolsEditor from "./components/ToolsEditor";
import { getCrewFullInfoByID } from "@/service/crew/action";

const renderTabContent = (selectedTab: string) => {
  switch (selectedTab) {
    case "crew":
      return <GroopEditor />;
    case "tasks":
      return <TasksEditor />;
    case "agents":
      return <AgentsEditor />;
    case "tools":
      return <ToolsEditor />;
    default:
      return <div>Error: Not proper tab</div>;
  }
};

function StudioPage({ params }: { params: { id: number } }) {
  const [selectedTab, setSelectedTab] = useState("crew");

  const getCrewInfo = async () => {
    const crewInfo = await getCrewFullInfoByID(params.id);
    console.log(crewInfo);
  };
  useEffect(() => {
    getCrewInfo();
  }, []);
  return (
    <div className="flex flex-row w-full">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="w-full flex flex-col mx-auto">
        {renderTabContent(selectedTab)}
      </div>
    </div>
  );
}

export default StudioPage;
