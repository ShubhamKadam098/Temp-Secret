import { db } from "@/Firebase/config";
import { doc, getDoc } from "firebase/firestore";

const FetchDoc = async ({ docId }: { docId: string }) => {
  try {
    const docRef = doc(db, "secrets", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error("Error removing document:", error);
    return null;
  }
};

export default FetchDoc;
