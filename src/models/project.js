import { Firestore, Storage } from "../config/db";
import FileUpload from "../components/utils/fileUpload";
import { getDatabase, push, set, update, remove, get } from "firebase/database";
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
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

export const projectGet = async (id) => {
  const docRef = doc(Firestore, "exhibits_xx", id);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const projectSave = async (
  form,
  images,
  thumbnail,
  type,
  notification
) => {
  try {
    const docRef = await addDoc(collection(Firestore, type), form);
    // const Ref = await Firestore.collection(type).add(form);
    console.log(form);

    images.forEach(async (image) => {
      const imageLink = await uploadFile(image);
      form.images.push(imageLink);
    });
    if (thumbnail) {
      form.displayImage = await uploadFile(thumbnail);
    }

    // const res = await docRef.set(form);

    await setDoc(doc(Firestore, type, docRef.id), form);

    return docRef.id;
  } catch (error) {
    console.error("Error saving project:", error);
    throw error;
  }
};

export const projectUpdate = async (form, id) => {
  try {
    await updateDoc(doc(Firestore, "exhibits_xx", id), form);
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
    const projectRef = doc(Firestore, "exhibits_xx", projectId);
    const projectDoc = await getDoc(projectRef);

    if (!projectDoc.exists()) {
      throw new Error("Project does not exist");
    }

    const newImages = [];

    for (let i = 0; i < images.length; i++) {
      newImages.push(await uploadFile(images[i]));
    }

    console.log(newImages);
    // projectRef.images.push(imageLink);

    await updateDoc(projectRef, { images });
    console.log("Project updated successfully");
  } catch (error) {
    console.error("Error updating project:", error);
  }
};

export const deleteUserProjects = async (id) => {
  try {
    const q = query(
      collection(Firestore, "exhibits_xx"),
      where("userid", "==", id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (project) => {
      await deleteProject(project.id);
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteProject = async (id) => {
  await deleteDoc(doc(Firestore, "exhibits_xx", id));
  const storageRef = ref(Storage, `images/${id}/`);
  const fileList = await listAll(storageRef);

  await Promise.all(
    fileList.items.map(async (fileRef) => {
      await deleteObject(fileRef);
    })
  );
};

export const uploadFile = async (file) => {
  return new Promise((resolve, reject) => {
    fetch("https://admin.exmo.uom.lk/fileUpload.php", {
      method: "POST",
      headers: {
        "X-Api-Key": "xMsbQTsBl4PAv4I9r^17^!ghGGioOt1R",
      },
      body: file,
    })
      .then((response) => response.json())
      .then((data) => {
        resolve("https://admin.exmo.uom.lk/" + data.path);
        // Handle the response from the server here
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        reject("Error uploading file");
        // Handle errors here
      });
  });
};
