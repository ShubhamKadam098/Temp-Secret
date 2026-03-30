import { SupabaseClient } from "@supabase/supabase-js";

interface FetchFileResponse {
  success: boolean;
  data?: string;
  contentType?: string;
  fileName?: string;
  error?: string;
}

export const FetchFileFromStorage = async ({
  supabase,
  filePath,
}: {
  supabase: SupabaseClient;
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

    const fileName = filePath.split("/").pop() || "file";

    const ext = fileName.split(".").pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      pdf: "application/pdf",
    };
    const contentType = contentTypeMap[ext || ""] || "application/octet-stream";

    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

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