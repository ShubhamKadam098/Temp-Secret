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
    <section className="flex flex-col gap-10 text-white items-center justify-center ">
      <div className="flex flex-col flex-wrap lg:max-w-[80%] max-w-[70%] grow bg-dark-1 border border-slate-500 rounded-lg mx-auto mt-10 px-6 gap-8 p-8">
        <Button
          variant={"ghost"}
          className="w-fit flex items-center gap-2 hover:bg-slate-800 rounded-xl text-xs md:text-base hover:text-white"
          onClick={() => setReturnedLink("")}
        >
          <Undo2 width={"15px"} height={"15px"} />
          Create new secrets
        </Button>

        <h1 className="rounded-lg px-4 py-4 border border-slate-400 truncate  max-w-[80%] md:max-w-[full]  mx-auto">
          {returnedLink ? returnedLink : "Ooops! Something went wrong"}
        </h1>

        <div className="flex flex-wrap gap-3 items-center justify-around">
          <CopyBtn inputText={returnedLink} />
          {/* <ShareBtn inputText={returnedLink} /> */}
          <VisitLinkBtn inputLink={returnedLink} />
        </div>
      </div>
    </section>
  );
};

export default DisplayLink;
