"use client";
import Typography from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, Loader2, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

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
function ChatRoom({
  selectedChat,
  setSelectedChat,
  chats,
  setChats,
}: {
  selectedChat: number | null;
  setSelectedChat: (id: number | null) => void;
  chats: Chat[];
  setChats: any;
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, chats]);

  const updateChatList = (chatId: number, newMessage: Message) => {
    setChats((prevChats: any) =>
      prevChats
        .map((chat: any) =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: newMessage.text,
                messages: [...chat.messages, newMessage],
              }
            : chat
        )
        .sort((a: any, b: any) => b.messages.length - a.messages.length)
    );
  };
  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" || !selectedChat) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
    };

    updateChatList(selectedChat, newMessage);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: "This is a simulated AI response.",
        sender: "assistant",
      };
      updateChatList(selectedChat, aiMessage);
      setIsLoading(false);
    }, 1000);
  };
  return (
    <div
      className={`w-full h-screen flex-1 flex flex-col  ${
        !selectedChat ? "hidden md:flex" : ""
      }`}
    >
      {selectedChat ? (
        <>
          <div className="py-2 px-4 fixed md:relative flex items-center w-full bg-background shadow top-0 left-0">
            <Button
              variant="ghost"
              size={"icon"}
              className="md:hidden"
              onClick={() => setSelectedChat(null)}
            >
              <ChevronLeftIcon />
            </Button>
            <Typography variant="subtitle2" ellipsis>
              {chats.find((chat: any) => chat.id === selectedChat)?.name}
            </Typography>
          </div>
          <div className="flex-1 overflow-y-auto pb-16 md:pb-0 p-4">
            {chats
              .find((chat: any) => chat.id === selectedChat)
              ?.messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-brand text-brand-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.text}
                  </span>
                </div>
              ))}
            {isLoading && (
              <div className="text-center">
                <Loader2 className="animate-spin inline-block" />
                <span className="ml-2">AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 fixed md:relative bottom-0 left-0 w-full bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center"
            >
              <Input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 mr-2"
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl text-gray-500">
            Select a chat or create new chat to start chatting.
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
