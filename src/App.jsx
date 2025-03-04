import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import QADashboard from "./pages/QADashboard";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
      <Route path="/qa-dashboard" element={<QADashboard />} />
      <Route
        path="/"
        element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600 mb-6 animate-bounce">
              Welcome to Bugzilla
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Manage your projects, bugs, and features with ease!
            </p>
            <div className="space-x-4">
              <Link
                to="/signup"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Login
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
