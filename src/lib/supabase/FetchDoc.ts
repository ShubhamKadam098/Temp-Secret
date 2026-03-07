import { supabase } from "@/Supabase/config";
import { Secret } from "@/types/api";

const FetchDoc = async ({ docId }: { docId: string }): Promise<Secret | null> => {
  try {
    const { data, error } = await supabase
      .from("secrets")
      .select("*")
      .eq("id", docId)
      .single();

    if (error) throw error;

    if (data) {
      return {
        id: data.id,
        inputType: data.input_type,
        encryptedContent: data.encrypted_content,
        iv: data.iv,
        filePath: data.file_path,
        contentType: data.content_type,
        password: data.password,
        createdAt: data.created_at,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
};

export default FetchDoc;
