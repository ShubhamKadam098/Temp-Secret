import { getStorage, ref, listAll, deleteObject } from "firebase/storage";

const DeleteStorageFolder = async (id: string): Promise<void> => {
  const storage = getStorage();
  const folderRef = ref(storage, `files/${id}/`);

  try {
    // List all files in the folder
    const listResult = await listAll(folderRef);

    // Create a batch delete operation
    const deletePromises = listResult.items.map((itemRef) =>
      deleteObject(itemRef)
    );

    // Execute all delete operations
    await Promise.all(deletePromises);

    console.log(`Folder ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting folder ${id}:`, error);
  }
};

export default DeleteStorageFolder;
