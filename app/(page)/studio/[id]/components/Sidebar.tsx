import Typography from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import React from "react";

function Sidebar({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
}) {
  const subMenu = [
    { name: "Groop", key: "crew" },
    { name: "Tasks", key: "tasks" },
    { name: "Agents", key: "agents" },
  ];
  return (
    <div className="w-32 h-full flex flex-col justify-between border-r border-divider shrink-0">
      <nav className="flex flex-col space-y-2 px-2 py-4">
        {subMenu.map((menu) => (
          <Button
            key={menu.key}
            variant={selectedTab === menu.key ? "brand" : "ghost"}
            className="w-full justify-start px-3 font-bold"
            onClick={() => setSelectedTab(menu.key)}
          >
            {menu.name}
          </Button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
