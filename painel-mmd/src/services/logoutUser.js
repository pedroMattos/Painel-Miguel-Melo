import { app } from "@/firebase/index";
import { getAuth, signOut } from "firebase/auth";

export default function logoutUser() {
  const auth = getAuth(app);
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log('Deslogado')
  }).catch((error) => {
    // An error happened.
    console.log({error})
  });
}