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
    <div className="flex flex-col p-5 bg-dark-1 border border-slate-500 rounded-lg min-h-32 gap-6 min-w-64 lg:min-w-[600px] max-w-[600px]">
      <h1 className="border-b border-slate-500 pb-2 font-semibold text-base">
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
            variant={"secondary"}
            className="w-fit flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white text-sx"
            onClick={downloadFile}
          >
            <Download width={"15px"} height={"15px"} />
            Download
          </Button>
        ) : (
          <>
            <Button
              variant={"secondary"}
              className="w-[30%] flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white"
              onClick={() => {
                navigator.clipboard.writeText(message);
                toast.success("Copied to clipboard");
              }}
            >
              <Clipboard width={"15px"} height={"15px"} />
              Copy
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowMessage;
