"use client";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GroopCard from "./components/groopCard";
import { popularTags } from "@/constant/popularTags";
import { supabase } from "@/lib/supabaseClient";

import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/types/database.types";

function StorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [groopList, setGroopList] = useState<Tables<"crew">[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    getGroopList(searchTerm);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag((prevTag) => (prevTag === tag ? null : tag));
  };

  const getGroopList = async (searchText: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.rpc(`search_crew_${sortBy}`, {
      search_text: searchText,
    });

    if (error) {
      console.error("Error searching crew:", error);
      setGroopList([]);
    } else {
      // console.log("data", data);
      setGroopList(data);
    }
    setIsLoading(false);
  };
  const filteredAndSortedGroops = useMemo(() => {
    return groopList.filter((groop) =>
      selectedTag ? groop.tags?.includes(selectedTag) : true
    );
  }, [groopList, selectedTag]);

  useEffect(() => {
    if (searchTerm === "") {
      getGroopList(searchTerm);
    }
  }, [selectedTag, searchTerm, sortBy]);
  return (
    <div className="container w-full mx-auto p-4">
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
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "brand" : "outline"}
              className="cursor-pointer"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Trending Groops</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredAndSortedGroops.slice(0, 3).map((groop) => (
            <GroopCard key={groop.id} groop={groop} />
          ))}
        </div>
      </div> */}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">All Groops</h2>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!isLoading
            ? filteredAndSortedGroops.map((groop) => (
                <GroopCard key={groop.id} groop={groop} />
              ))
            : Array(3)
                .fill(0)
                .map((_, index) => (
                  <Skeleton
                    key={index}
                    className="flex flex-col h-[280px] transition-all duration-300 ease-in-out cursor-pointer"
                  />
                ))}
        </div>
      </div>
    </div>
  );
}

export default StorePage;
