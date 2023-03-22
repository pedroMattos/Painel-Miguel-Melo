import { app } from "@/firebase/index";
import { doc, setDoc, collection, getFirestore } from "firebase/firestore";
const COLLECTION_NAME = 'works'

export default async function addNewProject(data) {
  const dbReference = getFirestore(app);
  const collectionRef = collection(dbReference, COLLECTION_NAME) 
  await setDoc(doc(collectionRef, data.slug), data);
}