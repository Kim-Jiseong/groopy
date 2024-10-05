import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CrewFullData } from "@/types/data";
import { TablesUpdate } from "@/types/database.types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import React from "react";

function GreetingNpq({
  crewData,
  onUpdate,
}: {
  crewData: CrewFullData;
  onUpdate: (updatedFields: TablesUpdate<"crew">) => void;
}) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onUpdate({
      [e.target.name]: e.target.value,
    });
  };

  const onDragStart = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(100);
  };

  // 드래그 앤 드롭 후 질문 순서 업데이트
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return; // 리스트 밖으로 드롭된 경우
    const { source, destination } = result;
    const newQuestions = crewData.pre_questions
      ? [...crewData.pre_questions]
      : [];
    const [removed] = newQuestions.splice(source.index, 1);
    newQuestions.splice(destination.index, 0, removed);
    onUpdate({ pre_questions: newQuestions });
  };

  // 질문 내용 변경 처리
  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const newQuestions = crewData.pre_questions
      ? [...crewData.pre_questions]
      : [];
    newQuestions[idx] = e.target.value;
    onUpdate({ pre_questions: newQuestions });
  };

  // 질문 삭제 처리
  const handleDeleteQuestion = (idx: number) => {
    const newQuestions = crewData.pre_questions
      ? [...crewData.pre_questions]
      : [];
    newQuestions.splice(idx, 1);
    onUpdate({ pre_questions: newQuestions });
  };

  // 질문 추가 처리
  const handleAddQuestion = () => {
    const newQuestions = crewData.pre_questions
      ? [...crewData.pre_questions, "New question"]
      : ["New question"];
    onUpdate({ pre_questions: newQuestions });
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="detail" className="font-semibold">
          Greeting
        </Label>
        <Input
          name="greeting"
          value={crewData.greeting || ""}
          onChange={handleChange}
          placeholder="Please write the greeting message that the user will see first"
          className="bg-content1"
        />
      </div>
      <div className="grid w-full gap-1.5">
        <div className="flex justify-between items-center">
          <Label htmlFor="preQuestion" className="font-semibold">
            Pre-Questions
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddQuestion}
            className="p-2"
          >
            <Plus size={14} className="mr-1" /> Add question
          </Button>
        </div>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-crew">
            {(droppableProvided) => (
              <ul
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
                className="flex flex-col gap-2"
              >
                {crewData.pre_questions &&
                  crewData.pre_questions.map(
                    (question: string, index: number) => (
                      <Draggable
                        key={index.toString()}
                        index={index}
                        draggableId={index.toString()}
                      >
                        {(draggableProvided) => (
                          <li
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            ref={draggableProvided.innerRef}
                            className="flex gap-2 items-center"
                          >
                            <Label
                              htmlFor={`question-${index}`}
                              className="flex items-center font-semibold cursor-grab"
                            >
                              <GripVertical size={18} />
                              {index + 1}
                            </Label>
                            <Input
                              id={`question-${index}`}
                              type="text"
                              value={question}
                              onChange={(e) => handleQuestionChange(e, index)}
                              className="bg-content1"
                            />
                            <Button
                              size={"icon"}
                              variant={"destructive"}
                              onClick={() => handleDeleteQuestion(index)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </li>
                        )}
                      </Draggable>
                    )
                  )}
                {droppableProvided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default GreetingNpq;
