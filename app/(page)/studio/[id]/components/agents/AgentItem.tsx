import { TablesUpdate } from "@/types/database.types";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Agent } from "./AgentsEditor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AgentItemProps {
  agent: Agent;
  onUpdate: (agentId: number, updatedFields: TablesUpdate<"agent">) => void;
  onDelete: (agentId: number) => void;
}

const AgentItem: React.FC<AgentItemProps> = ({ agent, onUpdate, onDelete }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onUpdate(agent.id, {
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-4 border border-divider rounded-md">
      <div className="flex justify-between items-center mb-2">
        <Input
          name="name"
          value={agent.name as string}
          onChange={handleChange}
          placeholder="Agent Name"
          className="flex-1 mr-2"
        />
        <Button variant="destructive" onClick={() => onDelete(agent.id)}>
          <Trash size={18} />
        </Button>
      </div>
      <Input
        name="role"
        value={agent.role || ""}
        onChange={handleChange}
        placeholder="Agent Role"
        className="mb-2"
      />
      <Textarea
        name="goal"
        value={agent.goal || ""}
        onChange={handleChange}
        placeholder="Agent Goal"
        className="mb-2"
        rows={5}
      />
      <Textarea
        name="backstory"
        value={agent.backstory || ""}
        onChange={handleChange}
        placeholder="Agent Backstory"
        rows={5}
      />
      {/* 필요한 다른 필드들도 추가하세요 */}
    </div>
  );
};

export default AgentItem;
