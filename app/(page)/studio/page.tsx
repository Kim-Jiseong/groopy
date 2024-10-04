"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";

function StudioPage() {
  const [selectedTab, setSelectedTab] = useState("crew");

  return (
    <div>
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
    </div>
  );
}

export default StudioPage;
