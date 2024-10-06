import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { publishCrew, verifyCrew } from "@/service/crew/axios";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload } from "lucide-react";
import React, { useState } from "react";

function PublishBtn({ crewId }: { crewId: number }) {
  const [pending, setPending] = useState(false);
  const {
    mutate: verify,
    mutateAsync: verifyAsync,
    isPending: isPendingVerify,
    status: verifyStatus,
  } = useMutation({
    mutationFn: () => verifyCrew({ crewId: crewId }),
    onSuccess: async (data) => {
      toast({
        title: "Groop verified!",
        description: "Groop is good to go! Now start publishing...",
        variant: "default",
      });
      publishAsync();
    },
    onError: async (error) => {
      console.log("error", error);
      toast({
        title: "Error verifying groop:",
        description: "Please try again later.",
        variant: "destructive",
      });
      setPending(false);
    },
  });
  const {
    mutate: publish,
    mutateAsync: publishAsync,
    isPending: isPendingPublish,
    status: publishStatus,
  } = useMutation({
    mutationFn: () => publishCrew({ crewId: crewId }),
    onSuccess: async (data) => {
      toast({
        title: "Groop Published!",
        description: "Your groop is now live!",
        variant: "brand",
      });
      setPending(false);
    },
    onError: async (error) => {
      console.log("error", error);
      toast({
        title: "Error publishing groop:",
        description: "Please try again later.",
        variant: "destructive",
      });
      setPending(false);
    },
  });

  const handleSubmit = async () => {
    setPending(true);
    const verification = await verifyAsync();
    console.log("verification", verification);
  };
  return (
    <div>
      <Button variant={"default"} onClick={handleSubmit} isLoading={pending}>
        {!pending && <CloudUpload size={18} className="mr-1" />}
        Publish
      </Button>
    </div>
  );
}

export default PublishBtn;
