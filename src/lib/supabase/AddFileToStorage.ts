import { supabase } from "@/Supabase/config";

interface UploadResponse {
  success: boolean;
  filePath?: string;
  error?: string;
}

export const AddFileToStorage = async ({
  input,
  id,
}: {
  input: File;
  id: string;
}): Promise<UploadResponse> => {
  try {
    if (!input) {
      throw new Error("No file provided");
    }

    const filePath = `files/${id}/${input.name}`;

    const { data, error } = await supabase.storage
      .from("files")
      .upload(filePath, input, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    return { success: true, filePath };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return { success: false, error: error.message };
  }
};
