import { app } from "@/firebase/index";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default async function loginWithEmail(email, password) {
  const auth = getAuth(app);
  let response
  try {
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log({userCredential})
      // Signed in
      const user = userCredential.user;
      localStorage.setItem('Uid', user.uid);
      response = { status: 'finished', msg: 'user logged' }
      // ...
    })
    .catch((error) => {
      console.log({error})
      const errorCode = error.code;
      const errorMessage = error.message;
      response = { status: 'login-error', msg: errorMessage }
    });
  } catch (e) {
    console.log(e)
  } finally {
    return response
  }
}
