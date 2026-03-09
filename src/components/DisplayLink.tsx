import React from "react";
import { Button } from "./ui/button";
import { LockKeyhole, Undo2 } from "lucide-react";
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
    <section className="surface-card flex flex-col gap-4 rounded-[20px] p-4 sm:p-5">
      <div className="space-y-2.5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Secret created
        </p>
        <h2 className="text-[22px] font-semibold text-foreground sm:text-2xl">
          Share this link with the intended recipient
        </h2>
        <p className="text-[13px] leading-5 text-muted-foreground sm:text-sm sm:leading-6">
          The secret is revealed once. If you added a password, the recipient will need it before they can open the payload.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 p-3.5">
        <div className="mb-2.5 flex items-center gap-2 text-sm text-muted-foreground">
          <LockKeyhole aria-hidden="true" className="h-4 w-4" />
          Generated link
        </div>
        <p className="break-all text-sm leading-6 text-foreground">
          {returnedLink || "Something went wrong while generating the link."}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <CopyBtn inputText={returnedLink} />
        <VisitLinkBtn inputLink={returnedLink} />
      </div>

      <Button
        variant={"ghost"}
        className="w-fit gap-2 px-0 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
        onClick={() => setReturnedLink("")}
      >
        <Undo2 aria-hidden="true" className="h-4 w-4" />
        Create Another Secret
      </Button>
    </section>
  );
};

export default DisplayLink;
