"use client";
import React, { use, useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import ChatRoom from "./components/ChatRoom";
import { getChatListByECID } from "@/service/chat/action";
import { Tables } from "@/types/database.types";
import { useQuery } from "@tanstack/react-query";
import LoadingStudioId from "../../studio/[id]/loading";
import { getChatFullInfo } from "@/service/chat/axios";
import { getEmployedCrewWithPublishedCrewData } from "@/service/employed_crew/action";

type Message = {
  id: number;
  text: string;
  sender: "user" | "assistant";
};

type Chat = {
  id: number;
  name: string;
  lastMessage: string;
  messages: Message[];
};

function BoardPage({ params }: { params: { id: number } }) {
  const [selectedChat, setSelectedChat] = useState<number | null | "new">(null);
  const [employedCrewData, setEmployedCrewData] = useState<
    | (Tables<"employed_crew"> & {
        latest_published_crew: Tables<"published_crew">;
      })
    | null
    | undefined
  >(null);

  useEffect(() => {
    getEmployedCrewWithPublishedCrewData(params.id).then((data) => {
      setEmployedCrewData(data);
    });
  }, [params.id]);
  return (
    <div className="w-full flex flex-col md:flex-row">
      <ChatList
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        employedCrewId={params.id}
      />

      <ChatRoom
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        employed_crew_id={params.id}
      />
    </div>
  );
}

export default BoardPage;
