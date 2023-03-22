import { app } from "@/firebase/index";
import { getStorage, ref, listAll, list, getDownloadURL } from "firebase/storage";

export default async function getStorageImages(projectName) {
  const storage = getStorage(app);
  const storageRef = ref(storage, projectName);
  const imagesUrl = []
  listAll(storageRef).then((res) => {
    res.items.forEach((itemRef) => {
      getDownloadURL(itemRef).then((url) => {
        imagesUrl.push(url)
      })
    });
  }).catch((error) => {
    console.log({error})
  });

  return imagesUrl
}