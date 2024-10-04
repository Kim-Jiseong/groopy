import React from "react";

function ChatList({
  selectedChat,
  setSelectedChat,
  chats,
}: {
  selectedChat: number | null;
  setSelectedChat: (id: number | null) => void;
  chats: any;
}) {
  return (
    <div
      className={`w-full md:w-1/3 bg-content1 border-r border-divider ${
        selectedChat ? "hidden md:block" : ""
      }`}
    >
      <h2 className="text-xl font-bold p-4 border-b">Chats</h2>
      {chats.map((chat: any) => (
        <div
          key={chat.id}
          className={` transition-all duration-300 p-4 border-b border-divider cursor-pointer hover:bg-content2 ${
            selectedChat === chat.id ? "bg-content3" : ""
          }`}
          onClick={() => {
            setSelectedChat(chat.id);
            console.log(chat.id, selectedChat);
          }}
        >
          <h3 className="font-semibold">{chat.name}</h3>
          <p className="text-sm text-gray-500">{chat.lastMessage}</p>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
