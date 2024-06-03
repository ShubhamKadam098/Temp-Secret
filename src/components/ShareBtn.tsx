import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Share2, Twitter } from "lucide-react";
import { useState } from "react";

const ShareBtn = ({ inputText }: { inputText: string }) => {
  const [position, setPosition] = useState("bottom");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"secondary"}
          className="w-[30%] flex items-center gap-2"
        >
          <div className="flex items-center gap-4">
            <Share2 width={"15px"} height={"15px"} />
            Share Secret
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="flex items-center flex-wrap gap-3">
          <>
            <Facebook /> Facebook
          </>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center flex-wrap gap-3">
          <>
            <Twitter /> Twitter
          </>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center flex-wrap gap-3">
          <>
            <Instagram /> Instagram
          </>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareBtn;
