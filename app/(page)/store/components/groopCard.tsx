import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GroopCardProps {
  groop: {
    id: number;
    name: string;
    description: string;
    image: string;
    tags: string[];
  };
}

export default function GroopCard({ groop }: GroopCardProps) {
  return (
    <Card className="flex flex-col h-[300px] transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:scale-105 group">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center gap-4">
          <Avatar className="transition-transform duration-300 ease-in-out group-hover:scale-110">
            <AvatarImage src={groop.image} alt={groop.name} />
            <AvatarFallback>
              {groop.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold truncate transition-colors duration-300 ease-in-out group-hover:text-primary">
            {groop.name}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-[100px]">
          <p className="text-sm text-muted-foreground transition-colors duration-300 ease-in-out group-hover:text-foreground">
            {groop.description}
          </p>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {groop.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="transition-colors duration-300 ease-in-out group-hover:bg-primary group-hover:text-primary-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
