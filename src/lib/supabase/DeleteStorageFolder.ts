import { supabase } from "@/Supabase/config";

const DeleteStorageFolder = async (id: string): Promise<void> => {
  try {
    const { data, error } = await supabase.storage
      .from("files")
      .list(`files/${id}/`);

    if (error) throw error;

    if (data && data.length > 0) {
      const filePaths = data.map((file) => `files/${id}/${file.name}`);
      
      const { error: deleteError } = await supabase.storage
        .from("files")
        .remove(filePaths);

      if (deleteError) throw deleteError;
    }

    console.log(`Folder ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting folder ${id}:`, error);
  }
};

export default DeleteStorageFolder;
