// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify"; // Import toast

// const DeveloperDashboard = () => {
//   const [bugs, setBugs] = useState([]);
//   const [userRole, setUserRole] = useState(null);
//   const navigate = useNavigate();

//   const fetchDashboardData = useCallback(async () => {
//     try {
//       const userResponse = await fetch("/api/auth/user", {
//         headers: { "Cache-Control": "no-cache" },
//       });
//       const userData = await userResponse.json();
//       if (userResponse.ok) {
//         setUserRole(userData.user.role.name);
//       } else {
//         throw new Error(userData.error || "Failed to fetch user role");
//       }

//       const response = await fetch("/api/developer-dashboard", {
//         headers: { "Cache-Control": "no-cache" },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         if (data.bugs) {
//           setBugs(data.bugs);
//         } else if (data.message) {
//           setBugs([]);
//         }
//       } else if (response.status === 403) {
//         toast.error(data.error || "You are not assigned to any projects."); // Replace alert with toast.error
//         navigate("/login");
//         return;
//       } else {
//         console.error("Failed to fetch bugs:", data.error);
//         setBugs([]);
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard:", error);
//       setBugs([]);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Logged out!"); // Replace alert with toast.success
//         navigate("/login");
//       } else {
//         toast.error(data.error); // Replace alert with toast.error
//       }
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   const handleUpdateStatus = async (bugId, newStatus) => {
//     if (window.confirm(`Are you sure you want to set the status to "${newStatus}"?`)) {
//       try {
//         const response = await fetch(`/api/bugs/${bugId}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ status: newStatus }),
//         });
//         const data = await response.json();
//         if (response.ok) {
//           toast.success("Status updated!"); // Replace alert with toast.success
//           fetchDashboardData();
//         } else {
//           toast.error(data.error || "Failed to update status"); // Replace alert with toast.error
//         }
//       } catch (error) {
//         console.error("Update status error:", error);
//         toast.error("An error occurred. Please try again."); // Replace alert with toast.error
//       }
//     }
//   };

//   const validTransitions = {
//     new: ["started"],
//     started: ["posted_to_qa"],
//     posted_to_qa: ["done_from_qa"],
//     done_from_qa: ["closed"],
//   };

//   const getAllowedStatuses = (currentStatus, role) => {
//     const nextStatuses = validTransitions[currentStatus] || [];
//     if (role === "Developer") {
//       return nextStatuses.filter(
//         (status) => status === "started" || status === "posted_to_qa"
//       );
//     } else if (role === "QA") {
//       return nextStatuses.includes("done_from_qa") ? ["done_from_qa"] : [];
//     } else if (role === "Manager") {
//       return nextStatuses.includes("closed") ? ["closed"] : [];
//     }
//     return [];
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-blue-600">Developer Dashboard</h2>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
//           >
//             Logout
//           </button>
//         </div>

//         <div className="mb-8">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">Assigned Bugs</h3>
//           {bugs.length > 0 ? (
//             <div className="grid grid-cols-1 gap-4">
//               {bugs.map((bug) => {
//                 const allowedStatuses = getAllowedStatuses(bug.status, userRole);
//                 return (
//                   <div
//                     key={bug._id}
//                     className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition duration-300"
//                   >
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <p className="text-lg font-medium text-blue-600">{bug.title}</p>
//                         <p className="text-sm text-gray-600">Type: {bug.type}</p>
//                         <p className="text-sm text-gray-600">Status: {bug.status}</p>
//                         <p className="text-sm text-gray-600">Created by: {bug.createdBy?.name || "Unknown"}</p>
//                         <p className="text-sm text-gray-600">Project: {bug.projectId?.name || "Unknown Project"}</p>
//                         <p className="text-sm text-gray-600">Locked: {bug.locked ? "Yes" : "No"}</p>
//                       </div>
//                       {bug.image && (
//                         <img
//                           src={`http://localhost:5000${bug.image}`}
//                           alt={bug.title}
//                           className="w-16 h-16 object-cover rounded-md ml-4"
//                         />
//                       )}
//                     </div>
//                     <div className="mt-2">
//                       {bug.locked ? (
//                         <p className="text-sm text-red-500">Bug is locked by QA. Cannot update status.</p>
//                       ) : allowedStatuses.length > 0 ? (
//                         <select
//                           onChange={(e) => handleUpdateStatus(bug._id, e.target.value)}
//                           value={bug.status}
//                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
//                         >
//                           <option value={bug.status}>{bug.status}</option>
//                           {allowedStatuses.map((status) => (
//                             <option key={status} value={status}>{status}</option>
//                           ))}
//                         </select>
//                       ) : (
//                         <p className="text-sm text-gray-500">No status updates available for your role.</p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <p className="text-gray-500">No bugs assigned yet.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeveloperDashboard;


// bug fixing
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DeveloperDashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch user role
      const userResponse = await fetch("http://localhost:5000/api/auth/user", {
        headers: { "Cache-Control": "no-cache" },
        credentials: "include",
      });
      const userData = await userResponse.json();
      if (userResponse.ok) {
        setUserRole(userData.user.role.name);
      } else {
        throw new Error(userData.error || "Failed to fetch user role");
      }

      // Fetch bugs
      const response = await fetch("http://localhost:5000/api/bugs/dev", {
        headers: { "Cache-Control": "no-cache" },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        if (data.bugs) {
          setBugs(data.bugs);
        } else if (data.message) {
          setBugs([]);
        }
      } else if (response.status === 403) {
        toast.error(data.error || "You are not assigned to any projects.");
        navigate("/login");
        return;
      } else {
        console.error("Failed to fetch bugs:", data.error);
        setBugs([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setBugs([]);
      toast.error(error.message || "Failed to load dashboard data.");
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Logged out!");
        navigate("/login");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    }
  };

  const handleUpdateStatus = async (bugId, newStatus) => {
    if (window.confirm(`Are you sure you want to set the status to "${newStatus}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/bugs/${bugId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          toast.success("Status updated!");
          fetchDashboardData();
        } else {
          toast.error(data.error || "Failed to update status");
        }
      } catch (error) {
        console.error("Update status error:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  const validTransitions = {
    new: ["started"],
    started: ["posted_to_qa"],
    posted_to_qa: ["done_from_qa"],
    done_from_qa: ["closed"],
  };

  const getAllowedStatuses = (currentStatus, role) => {
    const nextStatuses = validTransitions[currentStatus] || [];
    if (role === "Developer") {
      return nextStatuses.filter(
        (status) => status === "started" || status === "posted_to_qa"
      );
    } else if (role === "QA") {
      return nextStatuses.includes("done_from_qa") ? ["done_from_qa"] : [];
    } else if (role === "Manager") {
      return nextStatuses.includes("closed") ? ["closed"] : [];
    }
    return [];
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

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Assigned Bugs</h3>
          {bugs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {bugs.map((bug) => {
                const allowedStatuses = getAllowedStatuses(bug.status, userRole);
                return (
                  <div
                    key={bug._id}
                    className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-medium text-blue-600">{bug.title}</p>
                        <p className="text-sm text-gray-600">Type: {bug.type}</p>
                        <p className="text-sm text-gray-600">Status: {bug.status}</p>
                        <p className="text-sm text-gray-600">Created by: {bug.createdBy?.name || "Unknown"}</p>
                        <p className="text-sm text-gray-600">Project: {bug.projectId?.name || "Unknown Project"}</p>
                        <p className="text-sm text-gray-600">Locked: {bug.locked ? "Yes" : "No"}</p>
                      </div>
                      {bug.image && (
                        <img
                          src={`http://localhost:5000${bug.image}`}
                          alt={bug.title}
                          className="w-16 h-16 object-cover rounded-md ml-4"
                          onError={(e) => console.error("Image load error:", e)}
                        />
                      )}
                    </div>
                    <div className="mt-2">
                      {bug.locked ? (
                        <p className="text-sm text-red-500">Bug is locked by QA. Cannot update status.</p>
                      ) : allowedStatuses.length > 0 ? (
                        <select
                          onChange={(e) => handleUpdateStatus(bug._id, e.target.value)}
                          value={bug.status}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
                        >
                          <option value={bug.status}>{bug.status}</option>
                          {allowedStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-gray-500">No status updates available for your role.</p>
                      )}
                    </div>
                  </div>
                );
              })}
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