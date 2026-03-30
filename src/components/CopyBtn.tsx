import React from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const CopyBtn = ({ inputText }: { inputText: string }) => {
  return (
    <Button
      variant={"secondary"}
      className="w-full gap-2 sm:w-auto"
      onClick={() => {
        toast.success("Link copied to clipboard");
        navigator.clipboard.writeText(inputText);
      }}
    >
      <Copy aria-hidden="true" className="h-4 w-4" />
      Copy Link
    </Button>
  );
};

export default CopyBtn;
