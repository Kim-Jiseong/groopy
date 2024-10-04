"use client";
import React, { useState } from "react";
import ChatList from "./components/ChatList";
import ChatRoom from "./components/ChatRoom";

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

function BoardPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: "AI Assistant 1",
      lastMessage: "Hello! How can I help you?",
      messages: [],
    },
    {
      id: 2,
      name: "AI Assistant 2",
      lastMessage: "What would you like to know?",
      messages: [],
    },
  ]);
  return (
    <div className="w-full flex flex-col md:flex-row">
      <ChatList
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        chats={chats}
      />

      <ChatRoom
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        chats={chats}
        setChats={setChats}
      />
    </div>
  );
}

export default BoardPage;
