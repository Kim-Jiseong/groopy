import { Tables, TablesUpdate } from "@/types/database.types";
import React, { useState } from "react";
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
import { LogOut, Pencil, Upload } from "lucide-react";
import { signOut } from "@/app/auth/login/action";
import { Input } from "../ui/input";
import { updateMyProfile } from "@/service/profile/action";

function ProfileCard({
  profile,
  onClose,
}: {
  profile: Tables<"profile">;
  onClose: (isOpen: boolean) => void;
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileInfo, setProfileInfo] = useState<Tables<"profile">>(profile);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileInfo((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const hadleSave = async () => {
    const updatedProfileData = await updateMyProfile({
      updateData: profileInfo,
    });
    console.log(updatedProfileData);
    setIsEditMode(false);
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        {/* <CardDescription>Deploy your new project in one-click.</CardDescription> */}
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar>
          <AvatarImage
            src={profileInfo.image as string}
            alt={profileInfo.name as string}
          />
          <AvatarFallback>
            {profileInfo.name && profileInfo.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          {isEditMode ? (
            <Input
              name="name"
              defaultValue={profileInfo.name as string}
              className="mb-2"
              onChange={handleChange}
            />
          ) : (
            <h2 className="text-xl font-bold">{profileInfo.name}</h2>
          )}

          <p className="text-sm text-muted-foreground">{profileInfo.email}</p>
        </div>
      </CardContent>
      {isEditMode ? (
        <CardFooter className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size={"sm"}
            //   className={"bg-success text-white"}
            onClick={() => {
              setIsEditMode(false);
            }}
          >
            Cancel
          </Button>
          <Button size={"sm"} variant={"brand"} onClick={hadleSave}>
            <Upload size={16} className="mr-2" />
            Save
          </Button>
        </CardFooter>
      ) : (
        <CardFooter className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size={"sm"}
            //   className={"bg-success text-white"}
            onClick={() => {
              setIsEditMode(true);
            }}
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
      )}
    </Card>
  );
}

export default ProfileCard;
