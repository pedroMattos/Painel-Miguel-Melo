import { app } from "@/firebase/index";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import addNewProject from "./addNewProject";

export default async function uploadImage(fileDate, project) {
  let url = null
  const storage = getStorage(app);
  const metadata = {
    contentType: 'image/jpeg'
  };
  const storageRef = ref(storage, `${project.slug}/${fileDate.name}`);
  const uploadTask = uploadBytesResumable(storageRef, fileDate.file, metadata);
  uploadTask.on('state_changed',
  (snapshot) => {},
    (error) => {},
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        project.banner = downloadURL
        // addNewProject(project)
      });
    }
  );
}