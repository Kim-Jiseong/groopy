import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createNewChatWithPreQuestion,
  kickOffChat,
} from "@/service/chat/axios";
import { getEmployedCrewWithPublishedCrewData } from "@/service/employed_crew/action";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

function NewChat({
  selectedChat,
  setSelectedChat,
  employedCrewId,
  getChatRoomList,
}: {
  selectedChat: number | null | "new";
  setSelectedChat: (id: number | null) => void;
  employedCrewId: number;
  getChatRoomList: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [preQuestion, setPreQuestion] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  type ChatData = {
    content: string;
    role: string;
  };

  const {
    mutate: createNewChat,
    mutateAsync: createNewChatAsync,
    isPending: isPendingCreateChat,
    status: createChatStatus,
  } = useMutation({
    mutationFn: (chat: ChatData[]) =>
      createNewChatWithPreQuestion({
        employed_crew_id: employedCrewId,
        data: chat,
      }),
    onSuccess: async (data) => {
      console.log("Chat created", data);
      setSelectedChat(data.id);
      getChatRoomList();
      setIsModalOpen(false);
      const kickOffChatResponse = await kickOffChat({
        employed_crew_id: employedCrewId,
        chat_id: data.id,
      });
    },
  });

  const handleSubmit = async () => {
    const chatData = preQuestion.flatMap((question, index) => [
      { content: question, role: "assistant" },
      { content: answers[index] || "", role: "user" },
    ]);
    console.log("chatData", chatData);

    await createNewChatAsync(chatData);
  };

  const getCrewData = async () => {
    setIsLoading(true);
    const response = await getEmployedCrewWithPublishedCrewData(employedCrewId);
    console.log("response", response);
    if (response?.latest_published_crew?.pre_questions) {
      const preQuestions = response.latest_published_crew?.pre_questions;
      setPreQuestion([...preQuestions, "Do you have any other requests?"]);
      setAnswers(
        new Array(
          response.latest_published_crew?.pre_questions.length + 1
        ).fill("")
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCrewData();
  }, []);

  useEffect(() => {
    setAnswers([]);
    getChatRoomList();
  }, [isModalOpen]);

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);

    // 모든 답변이 비어있지 않을 때만 isFormValid를 true로 설정
    const allAnswered = updatedAnswers.every((answer) => answer.trim() !== "");
    setIsFormValid(allAnswered);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      {/* <DialogTrigger asChild> */}
      <Button
        size={"sm"}
        variant={"brand"}
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={18} className="mr-1" />
        New Chat
      </Button>
      {/* </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start New Chat</DialogTitle>
          <DialogDescription>
            Please fill in the answers of the following questions to start a new
            chat
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <div className="flex flex-col w-full items-center py-4">
              <Loader2 className="text-brand mr-2 h-4 w-4 animate-spin " />
            </div>
          ) : (
            preQuestion.map((question, index) => (
              <div key={index} className="flex flex-col gap-4">
                <Label htmlFor={`answer_${index}`}>
                  {index + 1}. {question}
                </Label>
                <Input
                  id={`answer_${index}`}
                  value={answers[index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="col-span-3"
                />
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid}
            isLoading={isPendingCreateChat}
          >
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewChat;
