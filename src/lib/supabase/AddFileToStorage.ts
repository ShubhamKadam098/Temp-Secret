import { SupabaseClient } from "@supabase/supabase-js";

interface UploadResponse {
  success: boolean;
  filePath?: string;
  error?: string;
}

const sanitizeFileName = (name: string): string => {
  return name
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_+/g, "_")
    .substring(0, 100);
};

export const AddFileToStorage = async ({
  supabase,
  input,
  id,
}: {
  supabase: SupabaseClient;
  input: File;
  id: string;
}): Promise<UploadResponse> => {
  try {
    if (!input) {
      throw new Error("No file provided");
    }

    const sanitizedName = sanitizeFileName(input.name);
    const filePath = `files/${id}/${sanitizedName}`;

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