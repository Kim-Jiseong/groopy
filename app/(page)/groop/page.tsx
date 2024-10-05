import { getMyProfile } from "@/service/user/action";
import MyGroopPage from "./components/myGroop";
import { redirect } from "next/navigation";

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
