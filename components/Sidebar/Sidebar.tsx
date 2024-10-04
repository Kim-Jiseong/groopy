import React from "react";
import { ExpandableSidebar } from "./expandable-sidebar";
import { getMyProfile } from "@/service/user/action";
import MobileNav from "./mobileNav";

async function Sidebar() {
  const auth = await getMyProfile();
  return (
    <header>
      <ExpandableSidebar className="hidden md:block" auth={auth} />
      <MobileNav className="block md:hidden" auth={auth} />
    </header>
  );
}

export default Sidebar;
