import React from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Clipboard, Download } from "lucide-react";
import { saveAs } from "file-saver";

const ShowMessage = ({
  inputType,
  message,
}: {
  inputType: string;
  message: string;
}) => {
  const downloadFile = async () => {
    if (inputType !== "file" || !message) return;
    try {
      const response = await fetch(message);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();

      const url = new URL(message);

      // Extract filename from URL
      const filename =
        url.pathname.split("/").pop()?.split("?")[0] || "downloaded_file";

      saveAs(blob, filename);
      toast.success("Download successful");
    } catch (error) {
      console.error(error);
      toast.error("Download failed");
    }
  };

  return (
    <div className="flex flex-wrap flex-col gap-8 border border-border rounded-lg bg-card px-4 py-8 w-full">
      <h1 className="border-b border-border pb-2 font-semibold text-base">
        Your Secret
      </h1>
      {inputType == "file" ? (
        ""
      ) : (
        <p className="break-words min-w-full">{message}</p>
      )}

      <div className="flex justify-center">
        {inputType === "file" ? (
          <Button
            variant="default"
            className="w-fit flex items-center justify-center gap-2"
            onClick={downloadFile}
          >
            <Download width={"15px"} height={"15px"} />
            Download
          </Button>
        ) : (
          <>
            <Button
              variant="default"
              className="mx-auto flex items-center gap-2 w-fit"
              onClick={() => {
                navigator.clipboard.writeText(message);
                toast.success("Copied to clipboard");
              }}
            >
              <Clipboard width={20} height={20} className="hidden md:block" />
              Copy
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowMessage;
