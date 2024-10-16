import { Tables, TablesUpdate } from "@/types/database.types";

import { Button } from "@/components/ui/button";
import { ChevronDown, Trash } from "lucide-react";
import { Agent } from "./AgentsEditor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Separator } from "@/components/ui/separator";

interface AgentItemProps {
  agent: Agent;
  llms: Tables<"llm">[];
  tools: Tables<"tool">[];
  onUpdate: (agentId: number, updatedFields: TablesUpdate<"agent">) => void;
  onDelete: (agentId: number) => void;
  openAccordion: string[];
  setOpenAccordion: React.Dispatch<React.SetStateAction<string[]>>;
}

const AgentItem: React.FC<AgentItemProps> = ({
  agent,
  llms,
  tools,
  onUpdate,
  onDelete,
  openAccordion,
  setOpenAccordion,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onUpdate(agent.id, {
      [e.target.name]: e.target.value,
    });
  };

  const toggleOpen = () => {
    if (openAccordion.includes(agent.id.toString())) {
      // Remove the id from the array
      setOpenAccordion(
        openAccordion.filter((id) => id !== agent.id.toString())
      );
    } else {
      // Add the id to the array
      setOpenAccordion([...openAccordion, agent.id.toString()]);
    }
  };

  const getProcessedList = (data: Tables<"tool">[]) => {
    const processedData = data.map((item) => {
      const label = item.name
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        value: item.id.toString(),
        label: label,
      };
    });
    // console.log(processedData);
    return processedData;
  };

  const handleLLMChange = (e: string) => {
    onUpdate(agent.id, {
      llm_id: Number(e),
    });
  };
  const handleToolChange = (e: string[]) => {
    onUpdate(agent.id, {
      tool_ids: e.map((item) => Number(item)),
    });
  };

  return (
    <AccordionItem value={agent.id.toString()}>
      <Card
        className={`group duration-300 ${
          openAccordion.includes(agent.id.toString()) ? "border-brand" : ""
        }`}
      >
        <CardHeader onClick={toggleOpen} className="cursor-pointer">
          <div className="w-full flex gap-2 justify-between">
            <div className="w-[400px] flex flex-col gap-2">
              <Label className="font-semibold">Agent name</Label>
              <Input
                name="name"
                value={agent.name as string}
                onChange={handleChange}
                placeholder="Agent Name"
              />
            </div>
            <ChevronDown
              className={`duration-300 ${
                openAccordion.includes(agent.id.toString()) ? "rotate-180" : ""
              }`}
            />
          </div>
        </CardHeader>
        <AccordionContent className="pb-0">
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="role" className="font-semibold">
                  Agent Role
                </Label>
                <Input
                  name="role"
                  value={agent.role || ""}
                  onChange={handleChange}
                  placeholder="Describe the role of the agent"
                  className="mb-2"
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="goal" className="font-semibold">
                  Agent Goal
                </Label>
                <Textarea
                  name="goal"
                  value={agent.goal || ""}
                  onChange={handleChange}
                  placeholder="Describe the goal of the agent"
                  className="mb-2"
                  rows={5}
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="goal" className="font-semibold">
                  Agent Backstory
                </Label>
                <Textarea
                  name="backstory"
                  value={agent.backstory || ""}
                  onChange={handleChange}
                  placeholder="Add a backstory for the agent. This can be used to enhance the agent's personality and performance."
                  rows={5}
                />
              </div>
              <div className="flex flex-row gap-4">
                <div className=" flex flex-col gap-2 w-[200px] shrink-0">
                  <Label className="font-semibold">LLM</Label>
                  <Select
                    value={agent.llm_id?.toString()}
                    onValueChange={handleLLMChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an Agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Popular Models</SelectLabel>
                        {llms
                          .filter((llm) => llm.is_popular)
                          .map((llm) => (
                            <SelectItem value={llm.id.toString()} key={llm.id}>
                              {llm.display_name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                      <Separator orientation={"horizontal"} />
                      <SelectGroup>
                        <SelectLabel>Other Models</SelectLabel>
                        {llms
                          .filter((llm) => !llm.is_popular)
                          .map((llm) => (
                            <SelectItem value={llm.id.toString()} key={llm.id}>
                              {llm.display_name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Label className="font-semibold">Tools</Label>
                  <MultiSelect
                    options={getProcessedList(tools)}
                    onValueChange={handleToolChange}
                    defaultValue={agent?.tool_ids?.map((item) =>
                      item.toString()
                    )}
                    variant="inverted"
                    //   animation={2}
                    maxCount={3}
                    placeholder="Select tools(Optional)"
                    asChild
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Please select the tools for the agent to use
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              size={"sm"}
              onClick={() => onDelete(agent.id)}
            >
              <Trash size={16} className="mr-1" /> Delete agent
            </Button>
          </CardFooter>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

export default AgentItem;
