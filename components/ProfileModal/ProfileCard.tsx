import { Tables } from "@/types/database.types";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, Pencil } from "lucide-react";
import { signOut } from "@/app/auth/login/action";

function ProfileCard({
  profile,
  onClose,
}: {
  profile: Tables<"profile">;
  onClose: (isOpen: boolean) => void;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar>
          <AvatarImage
            src={profile.image as string}
            alt={profile.name as string}
          />
          <AvatarFallback>
            {profile.name && profile.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size={"sm"}
          //   className={"bg-success text-white"}
        >
          <Pencil size={16} className="mr-2" />
          Edit
        </Button>
        <Button
          size={"sm"}
          variant={"destructive"}
          onClick={async () => {
            await signOut();
            onClose(false);
          }}
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProfileCard;
