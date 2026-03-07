import { supabase } from "@/Supabase/config";

const FetchDoc = async ({ docId }: { docId: string }) => {
  try {
    const { data, error } = await supabase
      .from("secrets")
      .select("*")
      .eq("id", docId)
      .single();

    if (error) throw error;

    if (data) {
      return {
        inputType: data.input_type,
        iv: data.iv,
        input: data.input,
        isVisited: data.is_visited,
        password: data.password,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
};

export default FetchDoc;
