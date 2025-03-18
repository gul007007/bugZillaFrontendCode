import React, { useEffect, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContextDefinition"; // Update path

const PrivateRoute = () => {
  const { isAuthenticated, checkAuth } = useContext(AuthContext);

  useEffect(() => {
    // Re-check auth if not authenticated (e.g., after login)
    if (isAuthenticated === false) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;