import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/Firebase/config";

interface UploadResponse {
  success: boolean;
  url?: string;
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

    const storageRef = ref(storage, `files/${id}/${input.name}`);
    const snapshot = await uploadBytes(storageRef, input);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { success: true, url: downloadURL };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return { success: false, error: error.message };
  }
};
