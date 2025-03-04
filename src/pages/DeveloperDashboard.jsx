import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

const DeveloperDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch("/api/bugs/dev", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await response.json();
      if (data.bugs) {
        setBugs(data.bugs);
      } else if (data.message) {
        setBugs([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        alert("Logged out!");
        navigate("/login");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateBugStatus = async (bugId, status) => {
    try {
      const response = await fetch(`/api/bugs/bugs/${bugId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Bug status updated!");
        fetchDashboardData(); // Refresh bugs after update
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Bug update error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600">Developer Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>

        {/* Bug Listing Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Assigned Bugs</h3>
          {bugs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {bugs.map((bug) => (
                <div
                  key={bug._id}
                  className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium text-blue-600">{bug.title}</p>
                      <p className="text-sm text-gray-600">Type: {bug.type}</p>
                      <p className="text-sm text-gray-600">Status: {bug.status}</p>
                      <p className="text-sm text-gray-600">
                        Created by: {bug.createdBy?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Project: {bug.projectId?.name || "Unknown Project"}
                      </p>
                    </div>
                    {bug.image && (
                      <img
                        src={`http://localhost:5000${bug.image}`}
                        alt={bug.title}
                        className="w-16 h-16 object-cover rounded-md ml-4"
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <select
                      value={bug.status}
                      onChange={(e) => updateBugStatus(bug._id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
                    >
                      {bug.type === "bug"
                        ? ["new", "started", "resolved"].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))
                        : ["new", "started", "completed"].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No bugs assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;












