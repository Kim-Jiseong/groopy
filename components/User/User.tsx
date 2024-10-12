import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { getMyProfile } from "@/service/profile/action";
import { useRouter } from "next/navigation";
import Typography from "../common/Typography";
import ProfileModalContainer from "../ProfileModal/ProfileModalContainer";

function User({ isExpanded, auth }: { isExpanded: boolean; auth: any }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (auth?.user) {
      console.log(auth);
      setIsOpen(true);
    } else {
      router.push("/auth");
    }
  };

  const returnUserId = (email: string) => {
    return email.split("@")[0];
  };
  return (
    <>
      <Button
        variant={"ghost"}
        className="w-full justify-start px-1 my-2 h-16"
        onClick={handleClick}
      >
        <Avatar>
          <AvatarImage
            src={auth ? auth.profile.image : "https://github.com/shadcn"}
            alt={auth ? auth.profile.name : "Anonymous"}
          />
          <AvatarFallback>
            {auth ? auth.profile.name : "Anonymous"}
          </AvatarFallback>
        </Avatar>
        <div
          className={`ml-4 last:flex flex-col transition-opacity duration-300 text-left ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          <span>{auth ? auth.profile.name : "Click to sign in"}</span>
          <Typography variant={"caption"} className={`text-content4`}>
            {auth ? "@" + returnUserId(auth.profile.email) : ""}
          </Typography>
        </div>
      </Button>
      {auth && (
        <ProfileModalContainer
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          profile={auth.profile}
        />
      )}
    </>
  );
}

export default User;
