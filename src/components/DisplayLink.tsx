import React from "react";
import { Button } from "./ui/button";
import { Globe, Undo2 } from "lucide-react";
import CopyBtn from "@/components/CopyBtn";
import VisitLinkBtn from "./VisitLinkBtn";

const DisplayLink = ({
  returnedLink = "",
  setReturnedLink,
}: {
  returnedLink: string;
  setReturnedLink: (link: string) => void;
}) => {
  return (
    <section className="flex flex-col gap-10 text-foreground items-center justify-center ">
      <div className="flex flex-col flex-wrap lg:max-w-[80%] max-w-[70%] grow bg-card border border-border rounded-lg mx-auto mt-10 px-6 gap-8 p-8">
        <Button
          variant={"ghost"}
          className="w-fit flex items-center gap-2 hover:bg-accent rounded-xl text-xs md:text-base hover:text-foreground"
          onClick={() => setReturnedLink("")}
        >
          <Undo2 width={"15px"} height={"15px"} />
          Create new secrets
        </Button>

        <h1 className="rounded-lg px-4 py-4 border border-border truncate  max-w-[80%] md:max-w-[full]  mx-auto">
          {returnedLink ? returnedLink : "Ooops! Something went wrong"}
        </h1>

        <div className="flex flex-wrap gap-3 items-center justify-around">
          <CopyBtn inputText={returnedLink} />
          <VisitLinkBtn inputLink={returnedLink} />
        </div>
      </div>
    </section>
  );
};

export default DisplayLink;
