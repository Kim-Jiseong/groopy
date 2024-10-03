import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tables } from "@/types/database.types";
import { useRouter } from "next/navigation";

export default function GroopCard({ groop }: { groop: Tables<"crew"> }) {
  const router = useRouter();
  return (
    <Card
      className="flex flex-col h-[280px] transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:scale-105 group"
      onClick={() => router.push(`/board/${groop.id}`)}
    >
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center gap-4">
          <Avatar className="transition-transform duration-300 ease-in-out group-hover:scale-110">
            <AvatarImage src={groop.image as string} alt={groop.name} />
            <AvatarFallback>
              {groop.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold truncate transition-colors duration-300 ease-in-out group-hover:text-primary">
            {groop.name}
          </h3>
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
          Click to see more details{" "}
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
  );
}
