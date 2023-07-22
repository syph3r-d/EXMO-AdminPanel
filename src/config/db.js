import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDRM5oC32583ue4ClIVAOU2QsB5_CH4KkY",
  authDomain: "exmo2023.firebaseapp.com",
  projectId: "exmo2023",
  storageBucket: "exmo2023.appspot.com",
  messagingSenderId: "1056288220423",
  appId: "1:1056288220423:web:9e6fd8250dfa4cf447d1a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const Firestore = getFirestore(app);
export const Storage = getStorage(app);
export const Database = getDatabase(app);
