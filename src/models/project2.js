import { Storage, Database } from "../config/db";
import {
  push,
  set,
  update,
  remove,
  get,
  ref as dataBaseRef,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

export const projectSave = async (form, images, notification) => {
  if(images.length===0){
    form.imgs=''
  }
  try {
    const newProjectRef = push(dataBaseRef(Database, "projects"));
    const projectId = newProjectRef.key;
    await set(newProjectRef, form);

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const storageRef = ref(Storage, `images/${projectId}/${image.name}`);
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
    if(form.imgs!==""){
      form.imgs.push(...imageUrls);
    }

    await set(dataBaseRef(Database, `projects/${projectId}`), form);

    return projectId;
  } catch (error) {
    console.error("Error saving project:", error);
    throw error;
  }
};

export const projectUpdate = async (form, id) => {
  try {
    if (form.imgs.length==0){
      form.imgs=''
    }
    await update(dataBaseRef(Database, `projects/${id}`), form);
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
    const projectRef = dataBaseRef(Database, `projects/${projectId}`);
    const projectSnapshot = await get(projectRef);
    if (!projectSnapshot.exists()) {
      throw new Error("Project does not exist");
    }
    // Upload new images to Firestore storage
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const storageRef = ref(Storage, `images/${projectId}/${image.name}`);
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

    var imgs = projectSnapshot.val().imgs;

    if(imgs===""){
      imgs=[]
    }

    // Add new image URLs to imgs field
    imgs.push(...imageUrls);

    // Update document with new imgs field value
    await update(projectRef, { imgs });
  } catch (error) {
    console.error("Error updating project:", error);
  }
};

export const deleteUserProjects = async (id) => {
  try {
    const projectsRef = dataBaseRef(Database, "projects");
    const queryRef = query(projectsRef, orderByChild("userid"), equalTo(id));
    const snapshot = await get(queryRef);
    snapshot.forEach(async (projectSnapshot) => {
      await deleteProject(projectSnapshot.key);
    });
  } catch (error) {
    console.error(error);
  }
};


export const deleteProject = async (id) => {
  const projectRef = dataBaseRef(Database, `projects/${id}`)
  // const projectSnapshot = await projectRef.once("value");

  // if (!projectRef.exists()) {
  //   return;
  // }

  await remove(projectRef);

  const storageRef = ref(Storage, `images/${id}/`);
  const fileList = await listAll(storageRef);

  await Promise.all(
    fileList.items.map(async (fileRef) => {
      await deleteObject(fileRef);
    })
  );
};

export const getProjects = async (id) => {
  try {
    const projectsRef = dataBaseRef(Database, "projects");
    const q = query(projectsRef, orderByChild("userid"), equalTo(id));
    const data = await get(q);

    return data;
  } catch (error) {
    throw error;
  }
};
