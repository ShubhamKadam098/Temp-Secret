import { supabase } from "@/Supabase/config";

interface FetchFileResponse {
  success: boolean;
  data?: string;
  contentType?: string;
  fileName?: string;
  error?: string;
}

export const FetchFileFromStorage = async ({
  filePath,
}: {
  filePath: string;
}): Promise<FetchFileResponse> => {
  try {
    const { data, error } = await supabase.storage
      .from("files")
      .download(filePath);

    if (error) throw error;

    if (!data) {
      throw new Error("No data received from storage");
    }

    // Extract file name from path
    const fileName = filePath.split("/").pop() || "file";

    // Determine content type based on file extension
    const ext = fileName.split(".").pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      pdf: "application/pdf",
    };
    const contentType = contentTypeMap[ext || ""] || "application/octet-stream";

    // Convert to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get pure base64
        const base64Data = result.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(data);
    });

    return {
      success: true,
      data: base64,
      contentType,
      fileName,
    };
  } catch (error: any) {
    console.error("Error fetching file:", error);
    return { success: false, error: error.message };
  }
};
