import { app } from "@/firebase/index";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
const DB_NAME = 'works'

export default async function updateProject(project) {
  const dbReference = getFirestore(app);
  let hasError
  try {
    const projectReferente = doc(dbReference, DB_NAME, project.slug);
    await updateDoc(projectReferente, {...project})
  } catch (e) {
    hasError = { status: 'error', msg: e }
  } finally {
    if (hasError) return hasError
    return { status: 'finished', msg: null }
  }
}