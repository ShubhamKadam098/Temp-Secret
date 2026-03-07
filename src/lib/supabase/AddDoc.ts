import { supabase } from "@/Supabase/config";
import { addDocPayload } from "@/types/AddDocPayload";

const AddDoc = async ({
  id,
  payLoad,
}: {
  id: string;
  payLoad: addDocPayload;
}) => {
  try {
    const { error } = await supabase.from("secrets").insert({
      id,
      input_type: payLoad.inputType,
      iv: payLoad.iv,
      input: payLoad.input,
      is_visited: payLoad.isVisited,
      password: payLoad.password,
      file_path: payLoad.filePath,
    });

    if (error) throw error;
    return { id };
  } catch (error) {
    console.error("Error adding document:", error);
    return null;
  }
};

export default AddDoc;
