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
import { popularTags } from "@/constant/popularTags";
import { CrewFullData } from "@/types/data";
import { TablesUpdate } from "@/types/database.types";
import React from "react";

function TagNdetail({
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

  const getProcessedList = () => {
    const processedData = popularTags.map((item) => {
      return {
        value: item,
        label: item,
      };
    });
    // console.log(processedData);
    return processedData;
  };

  const handleStatusChange = (e: string) => {
    onUpdate({ status: e });
  };

  const handleTagsChange = (e: string[]) => {
    onUpdate({ tags: e });
  };
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="tags" className="font-semibold">
          Status
        </Label>
        <Select
          value={crewData.status}
          onValueChange={(e) => handleStatusChange(e)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Groop Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Groop Status</SelectLabel>

              <SelectItem value={"PUBLIC"}>Public</SelectItem>
              <SelectItem value={"PRIVATE"}>Private</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="tags" className="font-semibold">
          Tags
        </Label>
        <MultiSelect
          id="tags"
          options={getProcessedList()}
          onValueChange={handleTagsChange}
          defaultValue={crewData.tags?.map((item) => item) || []}
          variant="inverted"
          //   animation={2}
          maxCount={3}
          placeholder="Select tags(Optional)"
          asChild
          className="w-full"
        />
      </div>
      <div className="grid w-full gap-1.5">
        <Label htmlFor="detail" className="font-semibold">
          Detail
        </Label>
        <Textarea
          rows={10}
          id="detail"
          name="detail"
          value={crewData.detail || ""}
          onChange={handleChange}
          placeholder="Please explain this groop in detail. Markdown syntax is supported."
          className="bg-content1"
        />
      </div>
    </div>
  );
}

export default TagNdetail;
