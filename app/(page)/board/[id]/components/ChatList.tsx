import Typography from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { getChatListByECID } from "@/service/chat/action";
import { Tables } from "@/types/database.types";
import { formatDateTime } from "@/utils/formatTime";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import NewChat from "./NewChat";

function ChatList({
  selectedChat,
  setSelectedChat,
  employedCrewId,
}: {
  selectedChat: number | null | "new";
  setSelectedChat: (id: number | null) => void;
  employedCrewId: number;
}) {
  const [chatList, setChatList] = useState<Tables<"chat">[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getChatRoomList = async () => {
    setIsLoading(true);
    const chatList = await getChatListByECID(employedCrewId);
    console.log(chatList);
    if (chatList) {
      setChatList(chatList);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getChatRoomList();
  }, []);

  return (
    <div
      className={`w-full flex flex-col flex-shrink-0 md:w-1/3 bg-content1 border-r border-divider ${
        selectedChat ? "hidden md:block" : ""
      }`}
    >
      <header className="fixed md:relative top-0 left-0 w-full h-14 px-4 py-2 bg-background border-b border-divider flex justify-between items-center gap-4 z-20">
        <Typography variant="subtitle1"> Chats </Typography>
        <div className="flex gap-2">
          <NewChat
            employedCrewId={employedCrewId}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            getChatRoomList={getChatRoomList}
          />
        </div>
      </header>
      <div id="chat_container" className="h-[calc(100vh-3.5rem)] overflow-auto">
        {isLoading ? (
          <div className="flex flex-col w-full items-center py-4">
            <Loader2 className="text-brand mr-2 h-4 w-4 animate-spin " />
          </div>
        ) : (
          chatList.map((chat) => (
            <div
              key={chat.id}
              className={`transition-all duration-300 p-4 border-b border-divider cursor-pointer hover:bg-content2 ${
                selectedChat === chat.id ? "bg-content3" : ""
              }`}
              onClick={() => {
                setSelectedChat(chat.id);
              }}
            >
              <Typography
                variant="text"
                className="font-semibold"
                ellipsis
                lines={1}
              >
                {chat.title}
              </Typography>
              <p className="text-sm text-gray-500">
                {formatDateTime(chat.updated_at, { locale: "en" })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatList;
