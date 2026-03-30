import { SupabaseClient } from "@supabase/supabase-js";

const DeleteDoc = async ({
  supabase,
  docId,
}: {
  supabase: SupabaseClient;
  docId: string;
}) => {
  try {
    const { error } = await supabase
      .from("secrets")
      .delete()
      .eq("id", docId);

    if (error) throw error;
    console.log("Document deleted successfully.");
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Error deleting document: " + error);
  }
};

export default DeleteDoc;