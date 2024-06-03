import { db } from "@/Firebase/config";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const DeleteDoc = async ({ docId }: { docId: string }) => {
  try {
    const docRef = doc(db, "secrets", docId);
    await deleteDoc(docRef);
    console.log("Entire Document has been deleted successfully.");
  } catch (error) {
    console.error("Error removing document:", error);
    throw new Error("Error removing document: " + error);
  }
};

export default DeleteDoc;
