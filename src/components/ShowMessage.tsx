import React from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Clipboard, Download } from "lucide-react";
import { saveAs } from "file-saver";

const ShowMessage = ({
  inputType,
  message,
  contentType,
  fileName,
}: {
  inputType: string;
  message: string;
  contentType?: string;
  fileName?: string;
}) => {
  const downloadFile = () => {
    if (inputType !== "file" || !message) return;
    try {
      // Check if message is base64 (new approach) or URL (old approach)
      const isBase64 = message.length > 200 && !message.startsWith("http");

      if (isBase64) {
        // New approach: message is base64 data
        const byteCharacters = atob(message);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType || "application/octet-stream" });
        saveAs(blob, fileName || "downloaded_file");
        toast.success("Download successful");
      } else {
        // Old approach: message is a URL
        fetch(message)
          .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.blob();
          })
          .then((blob) => {
            const url = new URL(message);
            const filename =
              url.pathname.split("/").pop()?.split("?")[0] || "downloaded_file";
            saveAs(blob, filename);
            toast.success("Download successful");
          })
          .catch((error) => {
            console.error(error);
            toast.error("Download failed");
          });
      }
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
