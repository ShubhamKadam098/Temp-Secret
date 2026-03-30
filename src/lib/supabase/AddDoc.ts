import { AddSecretPayload } from "@/types/api";
import { SupabaseClient } from "@supabase/supabase-js";

const AddDoc = async ({
  supabase,
  id,
  payLoad,
}: {
  supabase: SupabaseClient;
  id: string;
  payLoad: AddSecretPayload;
}) => {
  try {
    const { error } = await supabase.from("secrets").insert({
      id,
      input_type: payLoad.inputType,
      encrypted_content: payLoad.encryptedContent || null,
      iv: payLoad.iv || null,
      file_path: payLoad.filePath || null,
      content_type: payLoad.contentType || null,
      password: payLoad.password || null,
    });

    if (error) throw error;
    return { id };
  } catch (error) {
    console.error("Error adding document:", error);
    return null;
  }
};

export default AddDoc;