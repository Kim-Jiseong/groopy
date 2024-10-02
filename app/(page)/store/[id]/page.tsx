import { getCrewInfoByID } from "@/service/crew/action";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

async function StoreDetailPage({ params }: Props) {
  const groopDetail = await getCrewInfoByID(params.id);
  return <div>StoreDetailPage: {groopDetail?.name}</div>;
}

export default StoreDetailPage;
