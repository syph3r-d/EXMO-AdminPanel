import { Firestore, Storage } from "../config/db";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";


// export const projectSave = async (form) => {
//   try {
//     const storageRef =  ref(Storage, `/images/${form.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);
//     const docRef = await addDoc(collection(Firestore, "projects"), form);
//     console.log(`Project saved with ID: ${docRef.id}`);
//     return docRef.id;
//   } catch (error) {
//     console.error("Error saving project:", error);
//     throw error;
//   }
// };



function getFileNameFromUrl(url) {
  const match = url.match(/\/([^\/?#]+)[^\/]*$/);
  if (match) {
    return match[1];
  }
}

export const projectSave = async (form, images) => {
  try {
    const docRef = await addDoc(collection(Firestore, "projects"), form);
    console.log(`Project saved with ID: ${docRef.id}`);

    const storagePromises = images.map(async (img) => {
      const storageRef = ref(Storage, `/images/${docRef.id}/${img.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, img);

      // Get the download URL of the uploaded image
      const snapshot = await getDownloadURL(uploadTask.ref);
      const downloadURL = snapshot.toString();

      // Add the download URL to the image object
      form.imgs.push(downloadURL);
      return uploadTask;
    });

    await Promise.all(storagePromises);
    console.log("All images uploaded successfully");

    // Save the form with the image URLs to Firestore
    await setDoc(doc(Firestore, "projects", docRef.id), form);
    console.log("Form saved to Firestore with image URLs");

    return docRef.id;
  } catch (error) {
    console.error("Error saving project:", error);
    throw error;
  }
};

export const projectUpdate = async (form, id) => {
  try {
    await updateDoc(doc(Firestore, "projects", id), form);
    console.log(form);
  } catch (error) {
    console.error(error);
  }
};

// export const deleteImage = async (url,id) => {
//   try {
//     let name = url.substr(
//       url.indexOf("%2F") + 3,
//       url.indexOf("?") - (url.indexOf("%2F") + 3)
//     );
//     name = name.replace("%20", " ");
//     const storageRef = ref(Storage, `/images/${id}/${name}`);
//     await deleteObject(storageRef)
//   } catch (error) {}
// };

export const deleteImages = async (urls, id) => {
  try {
    for (const url of urls) {
      const parts = url.split("%2F");
      const name = parts[parts.length - 1].split("?")[0];
      const storageRef = ref(Storage, `/images/${id}/${name}`);
      await deleteObject(storageRef);
    }
  } catch (error) {}
};

export const updateImages = async (projectId, images,notification) => {
  try {
    const projectRef = doc(Firestore, "projects", projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      throw new Error("Project does not exist");
    }

    // Upload new images to Firestore storage
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const storageRef = ref(Storage, `images/${projectId}/${image.name}`);
        console.log("hi");
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Log upload progress
        uploadTask.on("state_changed", (snapshot) => {
          const progress =Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          notification.loading(`Uploading ${image.name}: ${progress}%`);
        });

        await uploadTask;
        const url = await getDownloadURL(storageRef);
        return url;
      })
    );

    const imgs = projectDoc.data().imgs;

    // Add new image URLs to imgs field
    imgs.push(...imageUrls);

    // Update document with new imgs field value
    await updateDoc(projectRef, { imgs });
    console.log("Project updated successfully");
  } catch (error) {
    console.error("Error updating project:", error);
  }
};
