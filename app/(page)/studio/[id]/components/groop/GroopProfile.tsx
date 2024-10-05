import { CrewFullData } from "@/types/data";
import React from "react";
import Image from "next/image";
import { TablesUpdate } from "@/types/database.types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function GroopProfile({
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
  return (
    <div className="container w-full flex justify-center gap-4 bg-content2 p-4">
      <Image
        src={
          crewData.image ||
          "https://vufqadhpxvvugtkaeyjx.supabase.co/storage/v1/object/public/assets/image/default_user.webp?t=2024-10-03T10%3A47%3A19.027Z"
        }
        alt={`${crewData.name} profile`}
        width={80}
        height={80}
        className="rounded-full w-fit h-fit"
      />
      <div className="w-[50%] flex flex-col gap-2">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="name" className="font-semibold">
            Name
          </Label>
          <Input
            name="name"
            value={crewData.name}
            onChange={handleChange}
            placeholder="Groop Name"
            className="bg-content1"
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="description" className="font-semibold">
            Description
          </Label>
          <Textarea
            rows={2}
            id="description"
            name="description"
            value={crewData.description || ""}
            onChange={handleChange}
            placeholder="Explain your groop in short."
            className="bg-content1"
          />
        </div>
      </div>
    </div>
  );
}

export default GroopProfile;
