"use client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GroopCard from "./groopCard";

// 더미 데이터
const dummyGroops = [
  {
    id: 1,
    name: "First Groop",
    description:
      "This is a description for the first groop. It can be quite long and will scroll if needed.",
    image: "/placeholder.svg",
    tags: ["tag1", "tag2"],
    popularity: 100,
    createdAt: "2023-09-01",
  },
  {
    id: 2,
    name: "Second Groop with a Very Long Name That Will Be Truncated",
    description: "Short description.",
    image: "/placeholder.svg",
    tags: ["tag3"],
    popularity: 50,
    createdAt: "2023-09-15",
  },
  {
    id: 3,
    name: "Third Groop",
    description:
      "Another description here. This one is also quite long to demonstrate the scrolling feature.",
    image: "/placeholder.svg",
    tags: ["tag1", "tag4", "tag5"],
    popularity: 75,
    createdAt: "2023-08-20",
  },
  {
    id: 4,
    name: "Fourth Groop",
    description: "This is the fourth groop with some unique tags.",
    image: "/placeholder.svg",
    tags: ["tag6", "tag7"],
    popularity: 30,
    createdAt: "2023-09-10",
  },
  {
    id: 5,
    name: "Fifth Groop",
    description: "The fifth groop in our collection with a mix of tags.",
    image: "/placeholder.svg",
    tags: ["tag2", "tag5", "tag7"],
    popularity: 60,
    createdAt: "2023-08-25",
  },
];

const allTags = Array.from(new Set(dummyGroops.flatMap((groop) => groop.tags)));

export default function Store() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // 여기에 실제 검색 로직 구현
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag((prevTag) => (prevTag === tag ? null : tag));
  };

  const filteredAndSortedGroops = useMemo(() => {
    return dummyGroops
      .filter(
        (groop) =>
          (selectedTag ? groop.tags.includes(selectedTag) : true) &&
          (searchTerm
            ? groop.name.toLowerCase().includes(searchTerm.toLowerCase())
            : true)
      )
      .sort((a, b) => {
        if (sortBy === "latest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else {
          return b.popularity - a.popularity;
        }
      });
  }, [selectedTag, searchTerm, sortBy]);

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          type="search"
          placeholder="Search groops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </form>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Trending Groops</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredAndSortedGroops.slice(0, 3).map((groop) => (
            <GroopCard key={groop.id} groop={groop} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">All Groops</h2>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredAndSortedGroops.map((groop) => (
            <GroopCard key={groop.id} groop={groop} />
          ))}
        </div>
      </div>
    </div>
  );
}
