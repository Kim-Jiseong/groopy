import Typography from "@/components/common/Typography";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CrewFullData } from "@/types/data";
import { Tables, TablesInsert } from "@/types/database.types";
import { Plus, Save } from "lucide-react";
import React, { useRef, useState } from "react";
import KnowledgeItem from "./knowledgeItem";

// Agent 타입 정의
export type Agent = Omit<TablesInsert<"agent">, "id"> & {
  id: number;
  tools?: Tool[];
};
type Tool = Tables<"tool">;

function KnowledgeEditor({ crewInfo }: { crewInfo: CrewFullData }) {
  const [agents, setAgents] = useState<Agent[]>(crewInfo.agents as Agent[]);
  const [pendingSave, setPendingSave] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string[]>([
    crewInfo.agents?.[0]?.id.toString(),
  ]);
  const lastKnowledgeRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {};
  return (
    <div className="relative flex flex-col mx-auto w-full ">
      <header className="sticky top-0 left-0 w-full h-14 px-4 py-2 bg-background border-b border-divider flex justify-between items-center gap-4 z-20">
        <Typography variant="subtitle1">Knowledge Setting</Typography>
        <div className="flex gap-2">
          {/* <Button>
            <Plus size={18} className="mr-1" />
            Add new Knowledge
          </Button> */}
          {/* <Button
            onClick={handleSave}
            variant={"brand"}
            isLoading={pendingSave}
          >
            {!pendingSave && <Save size={18} className="mr-1" />}
            Save
          </Button> */}
        </div>
      </header>
      <div id="agent-container" className="flex flex-col p-4">
        <Accordion
          type={"multiple"}
          value={openAccordion}
          onValueChange={(value) => setOpenAccordion(value)}
        >
          <ul className="flex flex-col gap-2">
            {agents
              .filter((agent) => !agent.is_deleted)
              .map((agent, index) => (
                <li key={agent.id}>
                  <KnowledgeItem
                    openAccordion={openAccordion}
                    setOpenAccordion={setOpenAccordion}
                    agent={agent}
                  />
                </li>
              ))}
            <div ref={lastKnowledgeRef}></div>
          </ul>
        </Accordion>
      </div>
    </div>
  );
}

export default KnowledgeEditor;
