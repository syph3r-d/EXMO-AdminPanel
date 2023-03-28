import { Firestore } from "../config/db";
import { collection, addDoc,doc,updateDoc } from "firebase/firestore";

export const projectSave = async (form) => {
  try {
    const docRef = await addDoc(collection(Firestore, "projects"), form);
    console.log(`Project saved with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error saving project:", error);
    throw error;
  }
};

export const projectUpdate=async (form,id) =>{
  try {
    await updateDoc(doc(Firestore,"projects",id),form)
  } catch (error) {
    console.error(error)
  }
}
