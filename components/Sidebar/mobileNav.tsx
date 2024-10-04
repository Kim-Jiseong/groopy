"use client";

import { Auth } from "@/types/auth";
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { HamburgerMenuIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { siteConfig } from "@/config/site";
import { usePathname, useRouter } from "next/navigation";
import User from "../User/User";
import { Tables } from "@/types/database.types";

export default function Component({
  className,
  auth,
  isExpanded = true,
}: {
  className?: string;
  auth?: any;
  isExpanded?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Close the sheet when the pathname changes
    setIsOpen(false);
  }, [pathname]);

  const handleClick = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <div
      className={`
        ${className} border-b-divider border-b w-full flex items-center gap-6 justify-between
      `}
    >
      <Button variant="ghost" onClick={() => router.back()}>
        <ChevronLeftIcon />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <HamburgerMenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle
              className="text-left"
              role="button"
              onClick={() => handleClick("/")}
            >
              groopy
            </SheetTitle>
            <Separator />

            <div className="h-full flex flex-col justify-between">
              <nav className="flex flex-col space-y-2">
                {siteConfig.navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.href}
                      variant={pathname === item.href ? "brand" : "ghost"}
                      className="w-full justify-start px-3"
                      onClick={() => handleClick(item.href)}
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
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
