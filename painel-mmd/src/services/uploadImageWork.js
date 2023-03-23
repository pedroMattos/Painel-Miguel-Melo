import { app } from "@/firebase/index";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import addNewProject from "./addNewProject";

export default async function uploadImageWork(fileData, slug, storeReference) {
  let url = null
  const storage = getStorage(app);
  const metadata = {
    contentType: 'image/jpeg'
  };
  const storageRef = ref(storage, `${slug}/${fileData.name}`);
  const uploadTask = uploadBytesResumable(storageRef, fileData.file, metadata);
  uploadTask.on('state_changed',
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        console.log(storeReference)
        storeReference.commit('images', { image: downloadURL, type: project, title: fileData.title })
      });
    }
  );
}