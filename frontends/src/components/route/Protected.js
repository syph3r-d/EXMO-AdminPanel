import React, { useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { useAuthState } from "../../contexts";
import { Route, Navigate } from "react-router-dom";

export default function ProtectedRoute({children}) {
  const {userDetails, loading} = useAuthState();
  if (userDetails == "" && !loading) {
   return <Navigate to="/" replace />
  } else {
    return children;
  }
}
