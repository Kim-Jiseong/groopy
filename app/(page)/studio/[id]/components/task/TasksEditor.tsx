import { CrewFullData } from "@/types/data";
import { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import TaskItem from "./TaskItem";
import isEqual from "lodash/isEqual";
import { toast } from "@/hooks/use-toast";
import Typography from "@/components/common/Typography";
import { Plus, Save } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";

// Task 타입 정의
type Task = Omit<TablesInsert<"task">, "id"> & { id: number };

export default function TaskEditor({
  crewInfo,
  setSaveTrigger,
}: {
  crewInfo: CrewFullData;
  setSaveTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [tasks, setTasks] = useState<Task[]>(crewInfo.tasks as Task[]);
  const [openAccordion, setOpenAccordion] = useState<string[]>([
    tasks?.[0]?.id.toString(),
  ]);
  const [pendingSave, setPendingSave] = useState(false);

  const lastTaskRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    lastTaskRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onDragStart = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(100);
  };
  // Drag and Drop 후 Task 순서 업데이트
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newTasks = Array.from(tasks);
    const [movedTask] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, movedTask);

    setTasks(newTasks);
  };

  // Task 업데이트 핸들러
  const handleUpdateTask = (
    taskId: number,
    updatedFields: TablesUpdate<"task">
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedFields } : task
      )
    );
  };

  // Task 삭제 핸들러
  const handleDeleteTask = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks
        // 삭제할 Task 중 새로 생성된 Task(id < 0)는 아예 제거
        .filter((task) => !(task.id === taskId && task.id < 0))
        // 기존의 Task(id > 0)는 is_deleted를 true로 설정(soft delete)
        .map((task) => {
          if (task.id === taskId && task.id > 0) {
            return { ...task, is_deleted: true };
          }
          return task;
        })
    );
  };

  // 새로운 Task 추가 핸들러
  const handleAddTask = () => {
    const newTask: Task = {
      id: -Date.now(), // 임시 음수 ID 사용
      name: "",
      description: "",
      is_deleted: false,
      created_at: new Date().toISOString(),
      crew_id: crewInfo.id,
      // 다른 필드들 초기화
    };
    setTasks([...tasks, newTask]);
    setOpenAccordion([...openAccordion, newTask.id.toString()]);
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  // 저장 핸들러
  const handleSave = async () => {
    setPendingSave(true);
    try {
      // 새로운 Task들 (임시 음수 ID를 가진 Task들)
      const tasksToCreate = tasks.filter(
        (task) => task.id < 0 && !task.is_deleted
      );

      // 수정된 기존 Task들
      const tasksToUpdate = tasks.filter((task) => {
        const initialTask = crewInfo.tasks.find((t) => t.id === task.id);
        return initialTask && !isEqual(initialTask, task) && !task.is_deleted;
      });

      // 삭제된 Task들
      const tasksToDelete = tasks.filter(
        (task) => task.is_deleted && task.id > 0
      );

      // 새로운 Task들 삽입
      let insertedTasks: Tables<"task">[] = [];
      let updatedTasks = tasks;

      if (tasksToCreate.length > 0) {
        // 임시 ID 제거하고 데이터 준비
        const tasksData = tasksToCreate.map(({ id, ...task }) => ({
          ...task,
          crew_id: crewInfo.id,
        }));

        const { data: insertedData, error: insertError } = await supabase
          .from("task")
          .insert(tasksData)
          .select("*"); // 삽입된 Task들의 실제 ID를 가져옴

        if (insertError) throw insertError;
        insertedTasks = insertedData || [];

        // 임시 ID를 실제 ID로 교체
        updatedTasks = tasks.map((task) => {
          if (task.id < 0) {
            const insertedTask = insertedTasks.find(
              (t) =>
                t.created_at === task.created_at &&
                t.name === task.name &&
                t.description === task.description
            );
            if (insertedTask) {
              return { ...task, id: insertedTask.id };
            }
          }
          return task;
        });

        setTasks(updatedTasks);
      }

      // 수정된 Task들 업데이트
      if (tasksToUpdate.length > 0) {
        const updates = tasksToUpdate.map((task) =>
          supabase.from("task").update(task).eq("id", task.id)
        );
        await Promise.all(updates);
      }

      // 삭제된 Task들 업데이트 (soft delete)
      if (tasksToDelete.length > 0) {
        const deletions = tasksToDelete.map((task) =>
          supabase.from("task").update({ is_deleted: true }).eq("id", task.id)
        );
        await Promise.all(deletions);
      }

      // 업데이트된 Task들로 task_ids 생성
      const nonDeletedTasks = updatedTasks.filter((task) => !task.is_deleted);
      const taskIds = nonDeletedTasks.map((task) => task.id);

      // crew의 task_ids 업데이트
      const { error: crewUpdateError } = await supabase
        .from("crew")
        .update({ task_ids: taskIds })
        .eq("id", crewInfo.id);

      if (crewUpdateError) throw crewUpdateError;
      toast({
        title: "Changes saved!",
        description: "Tasks change updated successfully!",
        variant: "brand",
      });
      setSaveTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error saving tasks and crew:", error);
      toast({
        title: "Error saving tasks and grooop:",
        variant: "destructive",
      });
    } finally {
      setPendingSave(false);
    }
  };

  return (
    <div className="relative flex flex-col mx-auto w-full ">
      <header className="sticky top-0 left-0 w-full h-14 px-4 py-2 bg-background border-b border-divider flex justify-between items-center gap-4 z-20">
        <Typography variant="subtitle1">Tasks Setting</Typography>
        <div className="flex gap-2">
          <Button onClick={handleAddTask}>
            <Plus size={18} className="mr-1" />
            Add new task
          </Button>
          <Button
            onClick={handleSave}
            variant={"brand"}
            isLoading={pendingSave}
          >
            {!pendingSave && <Save size={18} className="mr-1" />}
            Save
          </Button>
        </div>
      </header>
      <div id="task container" className="flex flex-col p-4">
        <Accordion
          type={"multiple"}
          value={openAccordion}
          onValueChange={(value) => setOpenAccordion(value)}
        >
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-4"
                >
                  {tasks
                    .filter((task) => !task.is_deleted)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        index={index}
                        draggableId={task.id.toString()}
                      >
                        {(draggableProvided) => (
                          <li
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            ref={draggableProvided.innerRef}
                          >
                            <TaskItem
                              key={task.id}
                              task={task}
                              tasks={crewInfo.tasks}
                              agents={crewInfo.agents}
                              index={index}
                              onUpdate={handleUpdateTask}
                              onDelete={handleDeleteTask}
                              openAccordion={openAccordion}
                              setOpenAccordion={setOpenAccordion}
                            />
                          </li>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  <div ref={lastTaskRef}></div>
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </Accordion>
      </div>
    </div>
  );
}
