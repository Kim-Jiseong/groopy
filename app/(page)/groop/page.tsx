import { getMyProfile } from "@/service/user/action";
import MyGroopPage from "./components/myGroop";

async function GroopPage() {
  const auth = await getMyProfile();
  return (
    <div className=" w-full">
      {auth?.profile && <MyGroopPage profile={auth?.profile} />}
    </div>
  );
}

export default GroopPage;
