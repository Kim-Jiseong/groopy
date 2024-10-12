import { getMyProfile } from "@/service/profile/action";

import { redirect } from "next/navigation";
import MyGroopPage from "./groop/components/myGroop";

async function GroopPage() {
  const auth = await getMyProfile();
  if (!auth) return redirect("/auth");
  return (
    <div className=" w-full">
      {auth?.profile && <MyGroopPage profile={auth?.profile} />}
    </div>
  );
}

export default GroopPage;
