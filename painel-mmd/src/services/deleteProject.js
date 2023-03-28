import { app } from "@/firebase/index";
import { doc, deleteDoc, getFirestore } from "firebase/firestore";
const DB_NAME = 'works'

export default async function deleteProject(projectName) {
  const dbReference = getFirestore(app);
  let hasError 
  try {
    await deleteDoc(doc(dbReference, DB_NAME, projectName))
  } catch (e) {
    console.log(e)
    hasError = { status: 'error', msg: e }
  } finally {
    if (hasError) return hasError
    return { status: 'finished', msg: null }
  }
}