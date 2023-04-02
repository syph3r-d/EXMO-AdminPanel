// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ0t-egZ5UPqB-i25eD6IUm3CRsNENpYs",
  authDomain: "exmo-d8ab4.firebaseapp.com",
  projectId: "exmo-d8ab4",
  storageBucket: "exmo-d8ab4.appspot.com",
  messagingSenderId: "183370537705",
  appId: "1:183370537705:web:95083d81ebc811e20aee78",
  measurementId: "G-Q0NLXKEM13",
  databaseURL: "https://exmo-d8ab4-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const Firestore=getFirestore(app);
export const Storage=getStorage(app);
export const Database=getDatabase(app);