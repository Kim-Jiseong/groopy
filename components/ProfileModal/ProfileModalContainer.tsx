import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Tables } from "@/types/database.types";
import ProfileCard from "./ProfileCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Typography from "../common/Typography";
import { ModeToggle } from "../theme-switch";

function ProfileModalContainer({
  isOpen,
  onOpenChange,
  profile,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  profile: Tables<"profile">;
}) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
        </DialogHeader>
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div> */}
        <ProfileCard profile={profile} onClose={onOpenChange} />
        <Card>
          <CardHeader>
            <CardTitle>Others</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center justify-between">
              <Typography variant={"caption"} style={{ fontWeight: 500 }}>
                Theme
              </Typography>
              <ModeToggle />
            </div>
          </CardContent>
        </Card>
        <DialogFooter>
          {/* <Button type="submit">Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileModalContainer;
