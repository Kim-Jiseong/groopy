import { Tables } from "@/types/database.types";
import React, { useEffect, useRef, useState } from "react";
import { Agent } from "./knowledgeEditor";
import { AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, Upload, Loader2, Trash2, Save, File } from "lucide-react";
import Typography from "@/components/common/Typography";
import { getKnowledgesByAgentID } from "@/service/knowledge/action";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatFileSize } from "@/utils/formatFileSize";

interface KnowledgeItemProps {
  agent: Agent;
  openAccordion: string[];
  setOpenAccordion: React.Dispatch<React.SetStateAction<string[]>>;
}

// FileMetadata 인터페이스 정의
interface FileMetadata {
  name: string;
  size: number;
}

// KnowledgeItem 인터페이스 수정
interface KnowledgeItem extends Omit<Tables<"knowledge">, "file_metadata"> {
  localId: string; // 고유한 localId 추가
  file_metadata: FileMetadata | null;
  file?: File; // 새로 추가된 파일을 저장하기 위한 필드
  needsSaving?: boolean; // 저장이 필요한지 여부
}

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1024MB in bytes

const KnowledgeItemComponent: React.FC<KnowledgeItemProps> = ({
  agent,
  openAccordion,
  setOpenAccordion,
}) => {
  const toggleOpen = () => {
    if (openAccordion.includes(agent.id.toString())) {
      setOpenAccordion(
        openAccordion.filter((id) => id !== agent.id.toString())
      );
    } else {
      setOpenAccordion([...openAccordion, agent.id.toString()]);
    }
  };

  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast(); // toast 훅 사용

  // 음수 ID 카운터
  const negativeIdRef = useRef(0);

  const getKnowledges = async () => {
    const knowledgeData = await getKnowledgesByAgentID(agent.id);
    if (knowledgeData) {
      const knowledgeItems = knowledgeData.map((knowledge) => ({
        ...knowledge,
        localId: knowledge.id.toString(),
      })) as KnowledgeItem[];
      setKnowledgeList(knowledgeItems);
    } else {
      setKnowledgeList([]);
    }
  };

  useEffect(() => {
    getKnowledges();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const validFiles: KnowledgeItem[] = [];
      for (const file of fileArray) {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            title: "File Size Exceeded",
            description: `File "${file.name}" exceeds the maximum size of 1024MB.`,
            variant: "destructive",
          });
          continue;
        }
        negativeIdRef.current -= 1; // 고유한 음수 ID 생성
        const negativeId = negativeIdRef.current;
        validFiles.push({
          localId: `temp_${negativeId}`, // 고유한 localId 생성
          id: negativeId,
          agent_id: agent.id,
          file_metadata: { name: file.name, size: file.size },
          file_path: null,
          is_deleted: false,
          created_at: new Date().toISOString(),
          file: file, // 실제 파일 객체
          needsSaving: true, // 저장이 필요함
          published_agent_id: null,
        } as KnowledgeItem);
      }
      if (validFiles.length > 0) {
        setKnowledgeList((prevList) => [...prevList, ...validFiles]);
      }
      // 파일 입력 값 초기화하여 같은 파일을 다시 선택할 수 있도록 함
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges) return; // 변경사항이 없으면 저장하지 않음
    setIsLoading(true);
    const itemsToSave = knowledgeList.filter((k) => k.needsSaving);

    for (const knowledge of itemsToSave) {
      if (knowledge.id < 0 && !knowledge.is_deleted) {
        // 새로 추가된 파일 저장
        const file = knowledge.file;
        if (!file) continue;
        const fileExt = file.name.split(".").pop();
        const timestamp = Date.now().toString();
        const filePath = `knowledge/${agent.id}/${timestamp}.${fileExt}`;

        const { data: storageData, error: storageError } =
          await supabase.storage.from("knowledge").upload(filePath, file);

        if (storageError) {
          console.error("Error uploading file:", storageError.message);
          toast({
            title: "Upload Error",
            description: `Failed to upload "${file.name}".`,
            variant: "destructive",
          });
          continue;
        }
        console.log(`${filePath} uploaded`, storageData);
        const { data: knowledgeData, error: knowledgeError } = await supabase
          .from("knowledge")
          .insert({
            agent_id: agent.id,
            file_path: filePath,
            file_metadata: knowledge.file_metadata,
            is_deleted: false,
          })
          .select()
          .single();
        console.log(`knowledge uploaded`, knowledgeData);
        if (knowledgeError) {
          console.error("Error inserting knowledge:", knowledgeError.message);
          toast({
            title: "Database Error",
            description: `Failed to save knowledge for "${file.name}".`,
            variant: "destructive",
          });
          continue;
        }
        // 저장된 항목의 정보를 업데이트
        knowledge.id = knowledgeData.id;
        knowledge.localId = knowledgeData.id.toString();
        knowledge.file_path = knowledgeData.file_path;
        knowledge.created_at = knowledgeData.created_at;
        knowledge.file = undefined;
        knowledge.needsSaving = false;
      } else if (knowledge.id > 0) {
        // 기존 파일의 삭제 여부 업데이트
        const { data, error } = await supabase
          .from("knowledge")
          .update({ is_deleted: knowledge.is_deleted })
          .eq("id", knowledge.id);

        if (error) {
          console.error("Error updating knowledge:", error.message);
          toast({
            title: "Update Error",
            description: `Failed to update knowledge with ID ${knowledge.id}.`,
            variant: "destructive",
          });
          continue;
        }
        knowledge.needsSaving = false;
      }
    }

    // 저장 후 최신 데이터로 상태 업데이트
    await getKnowledges();

    // 파일 입력 값 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsLoading(false);
    toast({
      title: "Successfully Updated",
      description: `Your knowledge files have been successfully updated`,
      variant: "brand",
    });
  };

  const handleDeleteKnowledge = (knowledge: KnowledgeItem) => {
    if (isLoading) return; // 로딩 중에는 삭제 불가
    if (knowledge.id < 0) {
      // 아직 저장되지 않은 파일은 리스트에서 제거합니다.
      setKnowledgeList((prevList) =>
        prevList.filter((k) => k.localId !== knowledge.localId)
      );
    } else {
      // 이미 저장된 파일은 is_deleted를 true로 설정하고 저장 필요 표시
      setKnowledgeList((prevList) =>
        prevList.map((k) =>
          k.localId === knowledge.localId
            ? { ...k, is_deleted: true, needsSaving: true }
            : k
        )
      );
    }
  };

  // 저장되지 않은 변경사항이 있는지 확인합니다.
  const hasUnsavedChanges = knowledgeList.some((k) => k.needsSaving);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
              <Typography variant={"subtitle2"}>{agent.name}</Typography>
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
            <div className="flex items-center gap-2">
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.docx,.csv,.xml" // 허용된 파일 형식
                onChange={handleFileUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <Button onClick={handleUploadButtonClick} disabled={isLoading}>
                <Upload className="mr-2 h-4 w-4" />
                Upload files...
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isLoading}
                isLoading={isLoading}
                variant={"brand"}
              >
                {isLoading ? "" : <Save size={18} className="mr-1" />}
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>

            <div className="mt-4">
              <Typography variant="subtitle2">File List</Typography>
              {knowledgeList.length === 0 ? (
                <Typography variant="text">
                  No files have been uploaded.
                </Typography>
              ) : (
                knowledgeList
                  .filter((knowledge) => !knowledge.is_deleted)
                  .map((knowledge) => (
                    <div
                      key={knowledge.localId} // localId를 key로 사용
                      className="flex items-center justify-between mt-2"
                    >
                      <div className="flex items-center gap-2">
                        <File size={18} />
                        <Typography variant="caption" ellipsis lines={1}>
                          {knowledge.file_metadata?.name} (
                          {formatFileSize(knowledge.file_metadata?.size || 0)})
                        </Typography>
                      </div>
                      <Button
                        className="ml-2"
                        size={"icon"}
                        variant={"destructive"}
                        onClick={() => handleDeleteKnowledge(knowledge)}
                        disabled={isLoading}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

export default KnowledgeItemComponent;
