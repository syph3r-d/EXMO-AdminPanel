import React, { createContext, useState, useEffect } from "react";
import { auth } from "../../config/db";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up a new user
  const signUp = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, { displayName: name });
      setCurrentUser(userCredential.user);
    } catch (error) {
      const err = { msg: error.message };
      throw err;
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setCurrentUser(userCredential.user);
    } catch (error) {
      const err = { msg: error.message };
      throw err;
    }
  };

  //Sign out the current user
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async (password) => {
    try {
      //reauthenticate user
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        password
      );
      await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );
      await deleteUser(auth.currentUser);
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    signIn,
    signOutUser,
    signUp,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
