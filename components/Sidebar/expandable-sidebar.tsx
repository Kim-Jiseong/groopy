"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { HelpCircle, Home, Menu, Settings } from "lucide-react";
import { useCallback, useState } from "react";
import { siteConfig } from "@/config/site";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "../ui/separator";
import User from "../User/User";
import { Auth } from "@/types/auth";
import GroopyIcon from "../common/GroopyIcon";
import { CapLogo, NoCapLogo } from "../icons";

export function ExpandableSidebar({
  className,
  auth,
}: {
  className?: string;
  auth?: any;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const handleMouseEnter = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsExpanded(false);
  }, []);
  return (
    <div
      className={`${className} fixed left-0 top-0 h-full transition-all duration-300 ease-in-out overflow-hidden border-r border-divider bg-background z-50`}
      style={{ width: isExpanded ? "240px" : "4rem" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-expanded={isExpanded}
    >
      <div className="flex flex-col h-full  ">
        {/* <div className="flex items-center h-16 border-b border-divider px-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div> */}
        <div
          role="button"
          className="flex leading-4 items-center text-he h-16 px-5 text-2xl font-extrabold mb-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          {/* <img
            className="mr-1"
            width={16}
            src="https://vufqadhpxvvugtkaeyjx.supabase.co/storage/v1/object/public/assets/logo/CapBlack.svg?t=2024-09-30T01%3A31%3A16.989Z"
          /> */}
          g
          <div
            className={`transition-opacity duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* <img
              width={88}
              src="https://vufqadhpxvvugtkaeyjx.supabase.co/storage/v1/object/public/assets/logo/NoCapLogoBlack.svg?t=2024-09-30T01%3A56%3A30.234Z"
            /> */}
            roopy
          </div>
          {/* <img
            // width={88}
            src={`https://vufqadhpxvvugtkaeyjx.supabase.co/storage/v1/object/public/assets/logo/FullLogoBlack.svg`}
          /> */}
        </div>
        <Separator />
        <div className="h-full flex flex-col justify-between">
          <nav className="flex flex-col space-y-2 px-2 py-4">
            {siteConfig.navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={pathname.startsWith(item.href) ? "brand" : "ghost"}
                  className="w-full justify-start px-3"
                  onClick={() => router.push(item.href)}
                >
                  <Icon className="h-5 w-5 min-w-[20px]" />
                  <span
                    className={`ml-4 transition-opacity duration-300 ${
                      isExpanded ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </nav>
          <div className="px-2">
            <User isExpanded={isExpanded} auth={auth} />
          </div>
        </div>
      </div>
    </div>
  );
}
