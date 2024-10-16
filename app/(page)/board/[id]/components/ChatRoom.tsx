"use client";
import Typography from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createUserMessage } from "@/service/chat/action";
import { ChatFullData, Cycle } from "@/types/data";
import { ChevronLeftIcon, Loader2, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import MessageList from "./MessageList";
import { kickOffChat } from "@/service/chat/axios";
import { Tables } from "@/types/database.types";

function ChatRoom({
  selectedChat,
  setSelectedChat,
  employed_crew_id,
}: {
  selectedChat: number | null | "new";
  setSelectedChat: (id: number | null) => void;
  employed_crew_id: number;
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [isWaitingAI, setIsWaitingAI] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatFullData, setChatFullData] = useState<ChatFullData | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    setChatFullData(null);
    setIsWaitingAI(false);
    setInputMessage("");

    if (selectedChat && selectedChat !== "new") {
      setIsLoading(true);

      // SSE 연결 설정
      const eventSource = new EventSource(
        process.env.NEXT_PUBLIC_API_URL +
          `employed_crews/${employed_crew_id}/chats/${selectedChat}/cycles/sse`
      );
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        // 상태 업데이트
        setChatFullData(data);

        // 마지막 사이클의 상태에 따라 isWaitingAI 설정
        const lastCycle = data.cycles[data.cycles.length - 1];
        if (lastCycle.status === "FINISHED") {
          setIsWaitingAI(false);
        } else {
          setIsWaitingAI(true);
        }

        setIsLoading(false);
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        eventSource.close();
        setIsLoading(false);
      };

      return () => {
        eventSource.close();
      };
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [chatFullData]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Optimistic UI 업데이트 (임시 ID 사용)
    const tempCycleId = -Date.now(); // 고유성을 보장하는 음수 타임스탬프
    const tempMessageId = tempCycleId - 1;

    const newMessage: Tables<"message"> = {
      id: tempMessageId,
      created_at: new Date().toISOString(),
      content: inputMessage,
      role: "user",
      chat_id: selectedChat as number,
      agent_id: null,
      cost: null,
      cycle_id: tempCycleId,
      input_token: null,
      output_token: null,
      task_id: null,
      type: null,
    };

    const newCycle: Cycle = {
      id: tempCycleId,
      created_at: new Date().toISOString(),
      status: "STARTED",
      chat_id: selectedChat as number,
      cost: null,
      price: null,
      total_token: null,
      execution_id: null,
      thread_id: null,
      messages: [newMessage],
    };

    setChatFullData((prevChatFullData) => {
      if (prevChatFullData) {
        return {
          ...prevChatFullData,
          cycles: [...prevChatFullData.cycles, newCycle],
        };
      } else {
        return {
          id: selectedChat as number,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          employed_crew_id: employed_crew_id,
          is_deleted: false,
          title: "Untitled Chat",
          cycles: [newCycle],
        };
      }
    });

    setInputMessage("");
    setIsWaitingAI(true);

    // 서버로 메시지 전송
    try {
      await createUserMessage({
        chat_id: selectedChat as number,
        message: inputMessage,
      });

      await kickOffChat({
        employed_crew_id: employed_crew_id,
        chat_id: selectedChat as number,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`w-full h-screen flex flex-col 
         ${!selectedChat ? "hidden md:flex" : ""}
      `}
    >
      {selectedChat ? (
        isLoading ? (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Loader2 className="text-brand h-10 w-10 animate-spin" />
          </div>
        ) : (
          <>
            <header className="fixed md:relative top-0 left-0 w-full h-14 px-4 py-2 bg-background border-b border-divider flex md:justify-between items-center gap-2 z-20">
              <Button
                variant="ghost"
                size={"icon"}
                className="w-6 h-6 md:hidden"
                onClick={() => setSelectedChat(null)}
              >
                <ChevronLeftIcon size={18} />
              </Button>
              <Typography variant="subtitle2" ellipsis>
                {chatFullData?.title}
              </Typography>
            </header>
            <div className="flex flex-col w-full h-full overflow-y-auto pb-16 md:pb-0 p-4">
              {chatFullData?.cycles.map((cycle) => (
                <MessageList key={cycle.id} messages={cycle.messages} />
              ))}
              {isWaitingAI && (
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
                <Textarea
                  name="input_message"
                  placeholder="Type a message..."
                  value={inputMessage}
                  rows={1}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 mr-2 resize-none min-h-10 h-10 max-h-36 overflow-auto"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "0px";
                    target.style.height = target.scrollHeight + "px";
                  }}
                />
                <Button type="submit" disabled={isWaitingAI}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        )
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl text-gray-500">
            Select a chat or create new chat to start innovation
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
