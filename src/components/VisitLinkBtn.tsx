import { Globe } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const VisitLinkBtn = ({ inputLink }: { inputLink: string }) => {
  const router = useRouter();
  return (
    <Button
      value={"Share"}
      variant={"secondary"}
      className="w-fit flex items-center gap-2"
      onClick={() => {
        const path = new URL(`https://${inputLink}`).pathname;
        router.push(path);
      }}
    >
      <Globe width={"17px"} height={"17px"} />
      Visit Link
    </Button>
  );
};

export default VisitLinkBtn;
