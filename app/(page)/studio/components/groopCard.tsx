"use client";
import Typography from "@/components/common/Typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tables } from "@/types/database.types";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { updateCrew } from "@/service/crew/action";

export default function GroopCard({ groop }: { groop: Tables<"crew"> }) {
  const router = useRouter();
  const [deletePending, setDeletePending] = useState(false);

  const handleDeleteClick = async (e: React.MouseEvent) => {
    setDeletePending(true);
    const deleteCrew = await updateCrew(groop.id, { is_deleted: true });
    console.log(deleteCrew);
    setDeletePending(false);
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          className="flex flex-col h-[280px] transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:scale-105 group"
          onClick={() => router.push(`/studio/${groop.id}`)}
        >
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center gap-4">
              <Avatar className="transition-transform duration-300 ease-in-out group-hover:scale-110">
                <AvatarImage src={groop.image as string} alt={groop.name} />
                <AvatarFallback>
                  {groop.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="w-full flex flex-col">
                <Typography variant="subtitle2" ellipsis lines={1}>
                  {/* <div className="line-clamp-2"> */}
                  {groop.name}
                  {/* </div> */}
                </Typography>
                <Badge variant="outline" className="text-xs w-fit">
                  {groop.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col justify-between items-start flex-grow overflow-hidden pb-4">
            <ScrollArea className="h-[100px]">
              <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground">
                {groop.description}
              </p>
            </ScrollArea>
            <div
              className={`
              text-sm  p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out text-brand
              `}
            >
              Click to start editing
            </div>
          </CardContent>
          <CardFooter className="flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              {groop.tags &&
                groop.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    // className="transition-colors duration-300 ease-in-out group-hover:bg-brand group-hover:text-brand-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </CardFooter>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent className="min-w-48">
        <ContextMenuItem>
          <Button
            variant={"destructive"}
            className="w-full flex items-center justify-between"
            onClick={handleDeleteClick}
            isLoading={deletePending}
          >
            {!deletePending && <Trash2 size={18} className="mr-2" />}
            Delete this groop
            <div></div>
          </Button>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
