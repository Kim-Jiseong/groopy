"use client";
import Typography from "@/components/common/Typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createUserMessage, getChatFullData } from "@/service/chat/action";
import { ChatFullData, Cycle } from "@/types/data";
import { Tables } from "@/types/database.types";
import { ChevronLeftIcon, Loader2, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import MessageList from "./MessageList";
import { kickOffChat } from "@/service/chat/axios";
import { supabase } from "@/lib/supabaseClient";

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

  const getChatFullDataList = async () => {
    setIsLoading(true);
    if (selectedChat && selectedChat !== "new") {
      const chatList = await getChatFullData(selectedChat);
      console.log("chatList", chatList);
      if (chatList) {
        setChatFullData(chatList);
        if (chatList.cycles[chatList.cycles.length - 1].status === "STARTED") {
          setIsWaitingAI(true);
        }
      }
    }
    setIsLoading(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    getChatFullDataList();
    setIsWaitingAI(false);
    setInputMessage("");
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [chatFullData]);

  // const updateChatList = (chatId: number, newMessage: Message) => {
  //   setChats((prevChats: any) =>
  //     prevChats
  //       .map((chat: any) =>
  //         chat.id === chatId
  //           ? {
  //               ...chat,
  //               lastMessage: newMessage.text,
  //               messages: [...chat.messages, newMessage],
  //             }
  //           : chat
  //       )
  //       .sort((a: any, b: any) => b.messages.length - a.messages.length)
  //   );
  // };

  // ----------------------
  // const {
  //   data: chatFullData,
  //   status,
  //   error,
  // } = useQuery({
  //   queryKey: ["chatInfo", selectedChat],
  //   queryFn: () => {
  //     if (selectedChat) {
  //       return getChatFullInfo({
  //         employed_crew_id: employed_crew_id,
  //         chat_id: selectedChat,
  //       });
  //     }
  //   },
  // });

  // if (status === "pending") {
  //   return <LoadingStudioId />;
  // }

  // if (status === "error") {
  //   console.log("error", error);
  //   return <div>Something went wrong</div>;
  // }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Optimistic UI 업데이트 (임시 ID 사용)
    const tempCycleId = -Date.now(); // 고유성을 보장하는 음수 타임스탬프
    const tempMessageId = tempCycleId - 1;

    const newMessage = {
      id: tempMessageId,
      created_at: new Date().toISOString(),
      cost: null,
      input_token: null,
      output_token: null,
      content: inputMessage,
      task_id: null,
      cycle_id: tempCycleId,
      role: "user",
      chat_id: selectedChat as number,
      type: null,
      agent_id: null,
    };

    const newCycle = {
      id: tempCycleId,
      created_at: new Date().toISOString(),
      status: "STARTED",
      cost: null,
      price: null,
      total_token: null,
      chat_id: selectedChat as number, // Force cast to number | null
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
          id: selectedChat as number, // Force cast to number
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
      const createdCycleAndMessage = await createUserMessage({
        chat_id: selectedChat as number,
        message: inputMessage,
      });

      if (createdCycleAndMessage) {
        console.log(createdCycleAndMessage);
        await kickOffChat({
          employed_crew_id: employed_crew_id,
          chat_id: selectedChat as number,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // // Supabase 실시간 업데이트 구독
  // useEffect(() => {
  //   if (!supabase || !selectedChat) return;

  //   const channel = supabase
  //     .channel(`public:message`)
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "INSERT",
  //         schema: "public",
  //         table: "message",
  //         // 필터링은 불가능하므로 모든 메시지에 대해 구독
  //       },
  //       async (payload) => {
  //         const newMessage = payload.new as Tables<"message">;
  //         console.log("newMessage", newMessage);
  //         // 새로운 메시지의 cycle_id를 통해 cycle의 chat_id를 가져옴
  //         const { data: cycleData, error: cycleError } = await supabase
  //           .from("cycle")
  //           .select("chat_id")
  //           .eq("id", (newMessage.cycle_id as number) + 1)
  //           .single();

  //         if (cycleError || !cycleData) {
  //           console.error("Cycle 정보를 가져오는 데 실패했습니다:", cycleError);
  //           return;
  //         }

  //         // cycle의 chat_id가 현재 selectedChat과 일치하는지 확인
  //         if (cycleData.chat_id === selectedChat) {
  //           // 상태 업데이트
  //           setChatFullData((prevChatFullData) => {
  //             if (!prevChatFullData) return prevChatFullData;

  //             const updatedCycles = prevChatFullData.cycles.map((cycle) => {
  //               if (cycle.id === newMessage.cycle_id) {
  //                 return {
  //                   ...cycle,
  //                   messages: [...cycle.messages, newMessage],
  //                 };
  //               }
  //               return cycle;
  //             });

  //             // 만약 해당 cycle이 기존에 없던 새로운 cycle이라면 추가
  //             const isNewCycle = !prevChatFullData.cycles.some(
  //               (cycle) => cycle.id === newMessage.cycle_id
  //             );

  //             if (isNewCycle) {
  //               const newCycle: Cycle = {
  //                 id: newMessage.cycle_id!,
  //                 chat_id: cycleData.chat_id,
  //                 created_at: new Date().toISOString(),
  //                 status: "STARTED",
  //                 cost: null,
  //                 price: null,
  //                 total_token: null,
  //                 execution_id: null,
  //                 thread_id: null,
  //                 messages: [newMessage],
  //               };

  //               return {
  //                 ...prevChatFullData,
  //                 cycles: [...prevChatFullData.cycles, newCycle],
  //               };
  //             }

  //             return {
  //               ...prevChatFullData,
  //               cycles: updatedCycles,
  //             };
  //           });
  //         }
  //       }
  //     )
  //     .subscribe();

  //   // 컴포넌트 언마운트 시 구독 해제
  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [chatFullData, selectedChat]);
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
