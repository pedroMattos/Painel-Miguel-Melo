import { app } from "@/firebase/index";
import { collection, getFirestore, getDocs } from "firebase/firestore";

export default async function getProject() {
  const dbReference = getFirestore(app);
  let querySnapshot
  try {
    querySnapshot = await getDocs(collection(dbReference, "works"));
  } catch (e) {
    console.log(e)
  } finally {
    return querySnapshot.docs.map((doc) => doc.data());
  }
}