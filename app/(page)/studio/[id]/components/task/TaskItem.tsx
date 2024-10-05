import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import { ChevronDown, Trash2 } from "lucide-react";

type Task = Omit<TablesInsert<"task">, "id"> & { id: number };
interface TaskItemProps {
  task: Task;
  tasks: Task[];
  agents: Tables<"agent">[];
  index: number;
  onUpdate: (taskId: any, updatedFields: TablesUpdate<"task">) => void;
  onDelete: (taskId: any) => void;
  openAccordion: string;
  setOpenAccordion: (taskId: string) => void;
}

export default function TaskItem({
  task,
  tasks,
  agents,
  index,
  onUpdate,
  onDelete,
  openAccordion,
  setOpenAccordion,
}: TaskItemProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onUpdate(task.id, {
      [e.target.name]: e.target.value,
    });
  };
  const toggleOpen = () => {
    if (openAccordion === task.id.toString()) {
      setOpenAccordion("");
    } else {
      setOpenAccordion(task.id.toString());
    }
  };

  const handleAgentChange = (e: string) => {
    onUpdate(task.id, {
      agent_id: Number(e),
    });
  };
  const handleContextChange = (e: string[]) => {
    onUpdate(task.id, {
      context_task_ids: e.map((item) => Number(item)),
    });
  };

  const getProcessedList = (data: Task[], index: number) => {
    const processedData = data.slice(0, index).map((item) => {
      const label = item.name
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        value: item.id.toString(),
        label: label,
      };
    });
    console.log(processedData);
    return processedData;
  };

  return (
    <AccordionItem value={task.id.toString()}>
      <Card
        className={`group duration-300 ${
          openAccordion === task.id.toString() ? "border-brand" : ""
        }`}
      >
        {/* <AccordionTrigger> */}
        <CardHeader className="w-full flex flex-col " onClick={toggleOpen}>
          <div className="w-full flex gap-2 justify-between">
            <div className="flex flex-col mb-2">
              <div className="flex  justify-between gap-8">
                <div className="w-[400px] flex flex-col gap-2">
                  <Label className="font-semibold">
                    #{index + 1} Task name
                  </Label>
                  <Input
                    name="name"
                    value={task.name}
                    onChange={handleChange}
                    placeholder="Task Name"
                  />
                </div>
              </div>
              <div
                className={`
                text-sm  p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out text-brand
                `}
              >
                Drag to change order
              </div>
            </div>
            <ChevronDown
              className={`duration-300 ${
                openAccordion === task.id.toString() ? "rotate-180" : ""
              }`}
            />
          </div>
        </CardHeader>
        {/* </AccordionTrigger> */}

        <AccordionContent>
          <CardContent>
            <div className="flex flex-row gap-4">
              <div className=" flex flex-col gap-2 w-[200px] shrink-0">
                <Label className="font-semibold">Agent</Label>
                <Select
                  value={task.agent_id?.toString()}
                  onValueChange={handleAgentChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an Agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Available agents</SelectLabel>
                      {agents.map((agent) => (
                        <SelectItem value={agent.id.toString()} key={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label className="font-semibold">Context</Label>
                <MultiSelect
                  options={getProcessedList(tasks, index)}
                  onValueChange={handleContextChange}
                  defaultValue={task.context_task_ids?.map((item) =>
                    item.toString()
                  )}
                  variant="inverted"
                  //   animation={2}
                  maxCount={3}
                  placeholder="Select tasks(Optional)"
                  asChild
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Choose tasks to pass results as context
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="description" className="font-semibold">
                  Task description
                </Label>
                <Textarea
                  rows={5}
                  id="description"
                  name="description"
                  value={task.description || ""}
                  onChange={handleChange}
                  placeholder="Describe the task."
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="expected_output" className="font-semibold">
                  Expected Output
                </Label>
                <Textarea
                  rows={5}
                  id="expected_output"
                  name="expected_output"
                  value={task.expected_output || ""}
                  onChange={handleChange}
                  placeholder="Explain what the expected output should be."
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              size={"sm"}
              onClick={() => onDelete(task.id)}
            >
              <Trash2 size={18} className="mr-1" />
              Delete
            </Button>
          </CardFooter>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
