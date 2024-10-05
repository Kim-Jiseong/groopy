import { CrewFullData } from "@/types/data";
import { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import AgentItem from "./AgentItem";
import isEqual from "lodash/isEqual";
import { toast } from "@/hooks/use-toast";
import Typography from "@/components/common/Typography";
import { Plus, Save } from "lucide-react";

// Agent 타입 정의
export type Agent = Omit<TablesInsert<"agent">, "id"> & {
  id: number;
  tools?: Tool[];
};
type Tool = Tables<"tool">;

export default function AgentEditor({
  crewInfo,
  setSaveTrigger,
}: {
  crewInfo: CrewFullData;
  setSaveTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [agents, setAgents] = useState<Agent[]>(crewInfo.agents as Agent[]);
  const [pendingSave, setPendingSave] = useState(false);

  const lastAgentRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    lastAgentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Agent 업데이트 핸들러
  const handleUpdateAgent = (
    agentId: number,
    updatedFields: TablesUpdate<"agent">
  ) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) =>
        agent.id === agentId ? { ...agent, ...updatedFields } : agent
      )
    );
  };

  // Agent 삭제 핸들러
  const handleDeleteAgent = (agentId: number) => {
    setAgents((prevAgents) =>
      prevAgents
        // 삭제할 Agent 중 새로 생성된 Agent(id < 0)는 아예 제거
        .filter((agent) => !(agent.id === agentId && agent.id < 0))
        // 기존의 Agent(id > 0)는 is_deleted를 true로 설정(soft delete)
        .map((agent) => {
          if (agent.id === agentId && agent.id > 0) {
            return { ...agent, is_deleted: true };
          }
          return agent;
        })
    );
  };

  // 새로운 Agent 추가 핸들러
  const handleAddAgent = () => {
    const newAgent: Agent = {
      id: -Date.now(), // 임시 음수 ID 사용
      name: "",
      role: "",
      goal: "",
      backstory: "",
      is_deleted: false,
      created_at: new Date().toISOString(),
      crew_id: crewInfo.id,
      tool_ids: [],
      tools: [], // 클라이언트 측에서 사용하는 필드
      // 다른 필드들 초기화
    };
    setAgents([...agents, newAgent]);
    setTimeout(scrollToBottom, 100);
  };

  // 저장 핸들러
  const handleSave = async () => {
    setPendingSave(true);
    try {
      // 새로운 Agent들 (임시 음수 ID를 가진 Agent들)
      const agentsToCreate = agents.filter(
        (agent) => agent.id < 0 && !agent.is_deleted
      );

      // 수정된 기존 Agent들
      const agentsToUpdate = agents.filter((agent) => {
        const initialAgent = crewInfo.agents.find((a) => a.id === agent.id);
        return (
          initialAgent && !isEqual(initialAgent, agent) && !agent.is_deleted
        );
      });

      // 삭제된 Agent들
      const agentsToDelete = agents.filter(
        (agent) => agent.is_deleted && agent.id > 0
      );

      // 새로운 Agent들 삽입
      let insertedAgents: Tables<"agent">[] = [];
      let updatedAgents = agents;

      if (agentsToCreate.length > 0) {
        // 임시 ID 제거하고 데이터 준비 (tools 필드 제외)
        const agentsData = agentsToCreate.map(({ id, tools, ...agent }) => ({
          ...agent,
          crew_id: crewInfo.id,
        }));

        const { data: insertedData, error: insertError } = await supabase
          .from("agent")
          .insert(agentsData)
          .select("*"); // 삽입된 Agent들의 실제 ID를 가져옴

        if (insertError) throw insertError;
        insertedAgents = insertedData || [];

        // 임시 ID를 실제 ID로 교체
        updatedAgents = agents.map((agent) => {
          if (agent.id < 0) {
            const insertedAgent = insertedAgents.find(
              (a) =>
                a.created_at === agent.created_at &&
                a.name === agent.name &&
                a.role === agent.role
            );
            if (insertedAgent) {
              return { ...agent, id: insertedAgent.id };
            }
          }
          return agent;
        });

        setAgents(updatedAgents);
      }

      // 수정된 Agent들 업데이트
      if (agentsToUpdate.length > 0) {
        const updates = agentsToUpdate.map((agent) => {
          // tools 필드 제외
          const { tools, ...agentData } = agent;
          return supabase.from("agent").update(agentData).eq("id", agent.id);
        });
        await Promise.all(updates);
      }

      // 삭제된 Agent들 업데이트 (soft delete)
      if (agentsToDelete.length > 0) {
        const deletions = agentsToDelete.map((agent) =>
          supabase.from("agent").update({ is_deleted: true }).eq("id", agent.id)
        );
        await Promise.all(deletions);
      }

      toast({
        title: "Changes saved!",
        description: "Agents change updated successfully!",
        variant: "brand",
      });
      setSaveTrigger((prev) => !prev);
    } catch (error) {
      console.error("Error saving agents:", error);
      toast({
        title: "Error saving agents:",
        variant: "destructive",
      });
    } finally {
      setPendingSave(false);
    }
  };

  useEffect(() => {
    console.log("agents", agents);
  }, [agents.length]);

  return (
    <div className="relative flex flex-col mx-auto w-full ">
      <header className="sticky top-0 left-0 w-full h-14 px-4 py-2 bg-background border-b border-divider flex justify-between items-center gap-4">
        <Typography variant="subtitle1">Agents Setting</Typography>
        <div className="flex gap-2">
          <Button onClick={handleAddAgent}>
            <Plus size={18} className="mr-1" />
            Add new agent
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
      <div id="agent-container" className="flex flex-col p-4">
        <ul className="flex flex-col gap-2">
          {agents
            .filter((agent) => !agent.is_deleted)
            .map((agent, index) => (
              <li key={agent.id}>
                <AgentItem
                  agent={agent}
                  onUpdate={handleUpdateAgent}
                  onDelete={handleDeleteAgent}
                />
              </li>
            ))}
          <div ref={lastAgentRef}></div>
        </ul>
      </div>
    </div>
  );
}
