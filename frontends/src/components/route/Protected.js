import React, { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { Route, Navigate } from "react-router-dom";

export default function ProtectedRoute({children}) {
  const { currentUser, loading } = useContext(AuthContext);
  if (currentUser == null && !loading) {
   return <Navigate to="/" replace />
  } else {
    return children;
  }
}
