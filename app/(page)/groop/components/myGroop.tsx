"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GroopCard from "./groopCard";
import { supabase } from "@/lib/supabaseClient";

import { Skeleton } from "@/components/ui/skeleton";
import { Tables } from "@/types/database.types";
interface GroopProps extends Tables<"employed_crew"> {
  crew_info: Tables<"crew">;
}
function MyGroopPage({ profile }: { profile: Tables<"profile"> }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("last_viewed");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [groopList, setGroopList] = useState<GroopProps[]>([]);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    getGroopList(searchTerm);
  };

  const getGroopList = async (searchText: string) => {
    setIsLoading(true);

    const { data, error } = await supabase.rpc("search_my_crew", {
      p_profile_id: profile.id,
      search_text: searchText,
    });

    if (error) {
      console.error("Error searching crew:", error);
      setGroopList([]);
    } else {
      console.log("data", data);

      // sortBy 조건에 따라 정렬
      const sortedData = data.sort((a: any, b: any) => {
        if (sortBy === "last_viewed") {
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        } else if (sortBy === "date_created") {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
        return 0;
      });

      setGroopList(sortedData);
    }

    setIsLoading(false);
  };

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

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Groops</h2>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_viewed">Last viewed</SelectItem>
              <SelectItem value="date_created">Date created</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!isLoading
            ? groopList.map((groop) => (
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

export default MyGroopPage;
