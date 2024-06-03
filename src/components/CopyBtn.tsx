import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import toast from "react-hot-toast";

const CopyBtn = ({ inputText }: { inputText: string }) => {
  return (
    <Button
      variant={"secondary"}
      className="w-fit flex items-center gap-2"
      onClick={() => {
        toast.success("Link copied to clipboard");
        navigator.clipboard.writeText(inputText);
      }}
    >
      <Link width={"15px"} height={"15px"} />
      Copy Link
    </Button>
  );
};

export default CopyBtn;
