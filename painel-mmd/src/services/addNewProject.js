import { app } from "@/firebase/index";
import { doc, setDoc, collection, getFirestore } from "firebase/firestore";
const COLLECTION_NAME = 'works'

export default async function addNewProject(data) {
  const dataSorted = data.receipt.sort((a, b) => a.order - b.order)
  const dataToInsert = data
  dataToInsert.receipt = dataSorted
  const dbReference = getFirestore(app);
  const collectionRef = collection(dbReference, COLLECTION_NAME) 
  await setDoc(doc(collectionRef, data.slug), dataToInsert)
}