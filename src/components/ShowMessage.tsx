import React from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Clipboard, Download, FileCheck2 } from "lucide-react";
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
    <div className="surface-card flex w-full flex-col gap-5 rounded-[24px] p-5 sm:p-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.06]">
          <FileCheck2 className="h-5 w-5 text-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">Your Secret</h1>
          <p className="text-sm text-muted-foreground">
            This content is available for this session only.
          </p>
        </div>
      </div>
      {inputType === "file" ? (
        null
      ) : (
        <p className="min-w-full break-words rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-foreground">
          {message}
        </p>
      )}

      <div className="flex justify-center">
        {inputType === "file" ? (
          <Button
            variant="default"
            className="w-full justify-center gap-2 sm:w-auto"
            onClick={downloadFile}
          >
            <Download aria-hidden="true" className="h-4 w-4" />
            Download
          </Button>
        ) : (
          <>
            <Button
              variant="default"
              className="mx-auto w-full gap-2 sm:w-auto"
              onClick={() => {
                navigator.clipboard.writeText(message);
                toast.success("Copied to clipboard");
              }}
            >
              <Clipboard aria-hidden="true" className="hidden h-4 w-4 md:block" />
              Copy
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ShowMessage;
