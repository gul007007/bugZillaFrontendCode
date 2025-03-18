import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContextDefinition"; // Import AuthContext

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/user", {
        headers: { "Cache-Control": "no-cache" },
        credentials: "include", // Ensure cookies/session are sent
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        toast.error("You are not logged in. Please log in to continue.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = { isAuthenticated, checkAuth };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};