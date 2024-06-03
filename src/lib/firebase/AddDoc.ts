import { db } from "@/Firebase/config";
import { addDocPayload } from "@/types/AddDocPayload";
import { doc, setDoc } from "firebase/firestore";

const AddDoc = async ({
  id,
  payLoad,
}: {
  id: string;
  payLoad: addDocPayload;
}) => {
  try {
    const docRef = doc(db, "secrets", id);
    await setDoc(docRef, payLoad);
    return { id };
  } catch (error) {
    console.error("Error adding document:", error);
    return null;
  }
};

export default AddDoc;
