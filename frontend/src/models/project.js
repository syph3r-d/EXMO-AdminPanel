import { Firestore, Storage } from "../config/db";
import { getDatabase,  push, set, update, remove, get } from "firebase/database";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

export const projectSave = async (form, images, notification) => {
  try {
    const docRef = await addDoc(collection(Firestore, "projects"), form);

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const storageRef = ref(Storage, `images/${docRef.id}/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on("state_changed", (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          notification.loading(`Uploading ${image.name}: ${progress}%`);
        });

        await uploadTask;
        const url = await getDownloadURL(storageRef);
        return url;
      })
    );

    form.imgs.push(...imageUrls);


    await setDoc(doc(Firestore, "projects", docRef.id), form);

    return docRef.id;
  } catch (error) {
    console.error("Error saving project:", error);
    throw error;
  }
};

export const projectUpdate = async (form, id) => {
  try {
    await updateDoc(doc(Firestore, "projects", id), form);
  } catch (error) {
    console.error(error);
  }
};

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

export const updateImages = async (projectId, images, notification) => {
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
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
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

export const deleteUserProjects = async (id) => {
  try {
    const q = query(collection(Firestore, "projects"), where("userid", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (project) => {
        await deleteProject(project.id);
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteProject = async (id) => {
  await deleteDoc(doc(Firestore, "projects", id));
  const storageRef = ref(Storage, `images/${id}/`);
  const fileList = await listAll(storageRef);

  await Promise.all(
    fileList.items.map(async (fileRef) => {
      await deleteObject(fileRef);
    })
  );
};
