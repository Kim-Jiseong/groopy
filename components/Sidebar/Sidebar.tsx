import React from "react";
import { ExpandableSidebar } from "./expandable-sidebar";
import { getMyProfile } from "@/service/user/action";
import MobileNav from "./mobileNav";

async function Sidebar() {
  const auth = await getMyProfile();
  return (
    <div>
      <ExpandableSidebar className="hidden md:block" auth={auth} />
      <MobileNav className="block md:hidden" auth={auth} />
    </div>
  );
}

export default Sidebar;
