// // export default ManagerDashboard;

// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate, Link } from "react-router-dom";

// const ManagerDashboard = () => {
//   const [message, setMessage] = useState("");
//   const [projectData, setProjectData] = useState({
//     name: "",
//     developerEmails: [],
//     qaEmails: [],
//   });
//   const [updateData, setUpdateData] = useState({
//     projectId: "",
//     developerEmails: [],
//     qaEmails: [],
//   });
//   const [projects, setProjects] = useState([]);
//   const [selectedProjectBugs, setSelectedProjectBugs] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [filterText, setFilterText] = useState("");
//   const navigate = useNavigate();

//   const fetchDashboardData = useCallback(async () => {
//     try {
//       const response = await fetch("/api/manager-dashboard");
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log("fetchDashboardData response:", data);
//       setMessage(data.message || "No dashboard message available.");
//     } catch (error) {
//       console.error("Error fetching dashboard:", error);
//       setMessage("Failed to load dashboard data.");
//     }
//   }, []);

//   const fetchProjects = useCallback(async () => {
//     try {
//       const response = await fetch(
//         `/api/projects/filter${
//           filterText ? `?name=${encodeURIComponent(filterText)}` : ""
//         }`
//       );
//       const data = await response.json();
//       if (response.ok) setProjects(data.projects || []);
//       else console.error("Failed to fetch projects:", data.error);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//     }
//   }, [filterText]);

//   useEffect(() => {
//     fetchDashboardData();
//     fetchProjects();
//   }, [fetchDashboardData, fetchProjects]);

//   const handleLogout = async () => {
//     try {
//       const response = await fetch("/api/auth/logout", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         alert("Logged out!");
//         navigate("/login");
//       } else {
//         alert(data.error);
//       }
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   const handleProjectChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "developerEmails" || name === "qaEmails") {
//       setProjectData({
//         ...projectData,
//         [name]: value.split(",").map((email) => email.trim()),
//       });
//     } else {
//       setProjectData({ ...projectData, [name]: value });
//     }
//   };

//   const handleUpdateChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "developerEmails" || name === "qaEmails") {
//       setUpdateData({
//         ...updateData,
//         [name]: value.split(",").map((email) => email.trim()),
//       });
//     } else {
//       setUpdateData({ ...updateData, [name]: value });
//     }
//   };

//   const handleProjectSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("/api/projects", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(projectData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         alert("Project created! Project ID: " + data.projectId);
//         setProjectData({ name: "", developerEmails: [], qaEmails: [] });
//         fetchProjects();
//       } else {
//         alert(data.error);
//       }
//     } catch (error) {
//       console.error("Project creation error:", error);
//     }
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log("Update payload:", updateData); // Debugging
//       const response = await fetch("/api/projects", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updateData),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         alert(data.message || "Project updated!");
//         setUpdateData({ projectId: "", developerEmails: [], qaEmails: [] });
//         fetchProjects();
//       } else {
//         alert(data.error);
//       }
//     } catch (error) {
//       console.error("Project update error:", error);
//     }
//   };

//   const handleDeleteProject = async (projectId) => {
//     if (window.confirm("Are you sure you want to delete this project?")) {
//       try {
//         const response = await fetch(`/api/projects/${projectId}`, {
//           method: "DELETE",
//           headers: { "Content-Type": "application/json" },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           alert(data.message || "Project deleted successfully!");
//           fetchProjects();
//         } else {
//           alert(data.error);
//         }
//       } catch (error) {
//         console.error("Project delete error:", error);
//         alert("An error occurred while deleting the project.");
//       }
//     }
//   };

//   const viewBugs = async (projectId) => {
//     try {
//       const response = await fetch(`/api/projects/${projectId}/bugs`);
//       const data = await response.json();
//       if (response.ok) {
//         setSelectedProjectBugs(data.bugs || []);
//         setIsModalOpen(true);
//       } else {
//         alert(data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching bugs:", error);
//       alert("An error occurred while fetching bugs.");
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedProjectBugs([]);
//   };

//   const handleCloseBug = async (bugId) => {
//     try {
//       const response = await fetch(`/api/bugs/${bugId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: "closed" }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         alert("Bug closed successfully!");
//         viewBugs(
//           projects.find((p) => p._id === selectedProjectBugs[0]?.projectId)._id
//         );
//       } else {
//         alert(data.error || "Failed to close bug");
//       }
//     } catch (error) {
//       console.error("Error closing bug:", error);
//       alert("An error occurred while closing the bug.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-blue-600">
//             Manager Dashboard
//           </h2>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
//           >
//             Logout
//           </button>
//         </div>
//         <p className="text-gray-700 mb-6">{message || "Loading..."}</p>

//         {/* Filter Projects */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">
//             Filter Projects
//           </h3>
//           <input
//             type="text"
//             placeholder="Filter by project name..."
//             value={filterText}
//             onChange={(e) => setFilterText(e.target.value)}
//             className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
//           />
//         </div>

//         {/* Projects Section */}
//         <div className="mb-8">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">Projects</h3>
//           {projects.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {projects.map((project) => (
//                 <div
//                   key={project._id}
//                   className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//                 >
//                   <p className="text-xl font-semibold text-blue-600 mb-2">
//                     {project.name}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     Developers: {project.developerIds?.length || 0}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-3">
//                     QA Members: {project.qaIds?.length || 0}
//                   </p>
//                   <button
//                     onClick={() => viewBugs(project._id)}
//                     className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 text-sm font-medium mb-2"
//                   >
//                     View Bugs
//                   </button>
//                   <button
//                     onClick={() => handleDeleteProject(project._id)}
//                     className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 text-sm font-medium"
//                   >
//                     Delete Project
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">No projects match your filter.</p>
//           )}
//         </div>

//         {/* Create Project Form */}
//         <div className="mb-8">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">
//             Create Project
//           </h3>
//           <form onSubmit={handleProjectSubmit} className="space-y-4">
//             <div>
//               <label
//                 htmlFor="name"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Project Name
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={projectData.name}
//                 onChange={handleProjectChange}
//                 placeholder="Project Name"
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="developerEmails"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Developer Emails (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 id="developerEmails"
//                 name="developerEmails"
//                 value={projectData.developerEmails.join(",")}
//                 onChange={handleProjectChange}
//                 placeholder="dev1@example.com,dev2@example.com"
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="qaEmails"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 QA Emails (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 id="qaEmails"
//                 name="qaEmails"
//                 value={projectData.qaEmails.join(",")}
//                 onChange={handleProjectChange}
//                 placeholder="qa1@example.com,qa2@example.com"
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
//             >
//               Create Project
//             </button>
//           </form>
//         </div>

//         {/* Update Project Form */}
//         <div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">
//             Update Project
//           </h3>
//           <form onSubmit={handleUpdateSubmit} className="space-y-4">
//             <div>
//               <label
//                 htmlFor="projectId"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Project ID
//               </label>
//               <input
//                 type="text"
//                 id="projectId"
//                 name="projectId"
//                 value={updateData.projectId}
//                 onChange={handleUpdateChange}
//                 placeholder="Project ID"
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="developerEmails"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Developer Emails (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 id="developerEmails"
//                 name="developerEmails"
//                 value={updateData.developerEmails.join(",")}
//                 onChange={handleUpdateChange}
//                 placeholder="dev1@example.com,dev2@example.com"
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="qaEmails"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 QA Emails (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 id="qaEmails"
//                 name="qaEmails"
//                 value={updateData.qaEmails.join(",")}
//                 onChange={handleUpdateChange}
//                 placeholder="qa1@example.com,qa2@example.com"
//                 required
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
//             >
//               Update Project
//             </button>
//           </form>
//         </div>

//         {/* Modal for Viewing Bugs */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   Bugs for Project
//                 </h3>
//                 <button
//                   onClick={closeModal}
//                   className="text-gray-500 hover:text-gray-700 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//               {selectedProjectBugs.length > 0 ? (
//                 <ul className="space-y-4">
//                   {selectedProjectBugs.map((bug) => (
//                     <li
//                       key={bug._id}
//                       className="p-4 bg-gray-50 rounded-md shadow-sm border border-gray-200"
//                     >
//                       <p className="text-lg font-medium text-blue-600">
//                         {bug.title}
//                       </p>
//                       <p className="text-sm text-gray-600">Type: {bug.type}</p>
//                       <p className="text-sm text-gray-600">
//                         Status: {bug.status}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         Created by: {bug.createdBy?.name || "Unknown"}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         Assigned to: {bug.assignedTo?.name || "Unassigned"}
//                       </p>
//                       {bug.image && (
//                         <img
//                           src={`http://localhost:5000/uploads${
//                             bug.image.startsWith("/uploads")
//                               ? bug.image
//                               : "/" + bug.image
//                           }`}
//                           alt={bug.title}
//                           className="mt-2 w-16 h-16 object-cover rounded-md"
//                         />
//                       )}
//                       {bug.status !== "closed" && (
//                         <button
//                           onClick={() => handleCloseBug(bug._id)}
//                           className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-300 text-sm"
//                         >
//                           Close Bug
//                         </button>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500">No bugs found for this project.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;

// code # 2 ~~ active

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

const ManagerDashboard = () => {
  const [message, setMessage] = useState("");
  const [projectData, setProjectData] = useState({
    name: "",
    developerEmails: [],
    qaEmails: [],
  });
  const [updateData, setUpdateData] = useState({
    projectId: "",
    developerEmails: [],
    qaEmails: [],
  });
  const [projects, setProjects] = useState([]);
  const [selectedProjectBugs, setSelectedProjectBugs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch("/api/manager-dashboard", {
        // Add cache-busting query parameter
        cache: "no-store", // Prevents caching in modern browsers
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("fetchDashboardData response:", data);
      // Check if data.message is valid
      setMessage(data.message || `Welcome! Check your projects.`);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setMessage("Failed to load dashboard data. Please try again.");
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/projects/filter${
          filterText ? `?name=${encodeURIComponent(filterText)}` : ""
        }`,
        { cache: "no-store" } // Prevent caching
      );
      const data = await response.json();
      if (response.ok) setProjects(data.projects || []);
      else console.error("Failed to fetch projects:", data.error);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, [filterText]);

  useEffect(() => {
    fetchDashboardData();
    fetchProjects();
  }, [fetchDashboardData, fetchProjects]);

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

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    if (name === "developerEmails" || name === "qaEmails") {
      setProjectData({
        ...projectData,
        [name]: value.split(",").map((email) => email.trim()),
      });
    } else {
      setProjectData({ ...projectData, [name]: value });
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    if (name === "developerEmails" || name === "qaEmails") {
      setUpdateData({
        ...updateData,
        [name]: value.split(",").map((email) => email.trim()),
      });
    } else {
      setUpdateData({ ...updateData, [name]: value });
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Project created! Project ID: " + data.projectId);
        setProjectData({ name: "", developerEmails: [], qaEmails: [] });
        fetchProjects();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Project creation error:", error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Update payload:", updateData); // Debugging
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Project updated!");
        setUpdateData({ projectId: "", developerEmails: [], qaEmails: [] });
        fetchProjects();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Project update error:", error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message || "Project deleted successfully!");
          fetchProjects();
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error("Project delete error:", error);
        alert("An error occurred while deleting the project.");
      }
    }
  };

  const viewBugs = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/bugs`);
      const data = await response.json();
      if (response.ok) {
        setSelectedProjectBugs(data.bugs || []);
        setIsModalOpen(true);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error fetching bugs:", error);
      alert("An error occurred while fetching bugs.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProjectBugs([]);
  };

  const handleCloseBug = async (bugId) => {
    try {
      const response = await fetch(`/api/bugs/${bugId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Bug closed successfully!");
        viewBugs(
          projects.find((p) => p._id === selectedProjectBugs[0]?.projectId)._id
        );
      } else {
        alert(data.error || "Failed to close bug");
      }
    } catch (error) {
      console.error("Error closing bug:", error);
      alert("An error occurred while closing the bug.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600">
            Manager Dashboard
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
        <p className="text-gray-700 mb-6">{message || "Loading..."}</p>

        {/* Filter Projects */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Filter Projects
          </h3>
          <input
            type="text"
            placeholder="Filter by project name..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
          />
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Projects</h3>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <p className="text-xl font-semibold text-blue-600 mb-2">
                    {project.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Developers: {project.developerIds?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    QA Members: {project.qaIds?.length || 0}
                  </p>
                  <button
                    onClick={() => viewBugs(project._id)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 text-sm font-medium mb-2"
                  >
                    View Bugs
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 text-sm font-medium"
                  >
                    Delete Project
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No projects match your filter.</p>
          )}
        </div>

        {/* Create Project Form */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Create Project
          </h3>
          <form onSubmit={handleProjectSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Project Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={projectData.name}
                onChange={handleProjectChange}
                placeholder="Project Name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="developerEmails"
                className="block text-sm font-medium text-gray-700"
              >
                Developer Emails (comma-separated)
              </label>
              <input
                type="text"
                id="developerEmails"
                name="developerEmails"
                value={projectData.developerEmails.join(",")}
                onChange={handleProjectChange}
                placeholder="dev1@example.com,dev2@example.com"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="qaEmails"
                className="block text-sm font-medium text-gray-700"
              >
                QA Emails (comma-separated)
              </label>
              <input
                type="text"
                id="qaEmails"
                name="qaEmails"
                value={projectData.qaEmails.join(",")}
                onChange={handleProjectChange}
                placeholder="qa1@example.com,qa2@example.com"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Create Project
            </button>
          </form>
        </div>

        {/* Update Project Form */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Update Project
          </h3>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="projectId"
                className="block text-sm font-medium text-gray-700"
              >
                Project ID
              </label>
              <input
                type="text"
                id="projectId"
                name="projectId"
                value={updateData.projectId}
                onChange={handleUpdateChange}
                placeholder="Project ID"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="developerEmails"
                className="block text-sm font-medium text-gray-700"
              >
                Developer Emails (comma-separated)
              </label>
              <input
                type="text"
                id="developerEmails"
                name="developerEmails"
                value={updateData.developerEmails.join(",")}
                onChange={handleUpdateChange}
                placeholder="dev1@example.com,dev2@example.com"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="qaEmails"
                className="block text-sm font-medium text-gray-700"
              >
                QA Emails (comma-separated)
              </label>
              <input
                type="text"
                id="qaIds"
                name="qaEmails"
                value={updateData.qaEmails.join(",")}
                onChange={handleUpdateChange}
                placeholder="qa1@example.com,qa2@example.com"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Update Project
            </button>
          </form>
        </div>

        {/* Modal for Viewing Bugs */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Bugs for Project
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              {selectedProjectBugs.length > 0 ? (
                <ul className="space-y-4">
                  {selectedProjectBugs.map((bug) => (
                    <li
                      key={bug._id}
                      className="p-4 bg-gray-50 rounded-md shadow-sm border border-gray-200"
                    >
                      <p className="text-lg font-medium text-blue-600">
                        {bug.title}
                      </p>
                      <p className="text-sm text-gray-600">Type: {bug.type}</p>
                      <p className="text-sm text-gray-600">
                        Status: {bug.status}
                      </p>
                      <p className="text-sm text-gray-600">
                        Created by: {bug.createdBy?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Assigned to: {bug.assignedTo?.name || "Unassigned"}
                      </p>
                      {bug.image && (
                        <img
                          src={`http://localhost:5000/uploads${
                            bug.image.startsWith("/uploads")
                              ? bug.image
                              : "/" + bug.image
                          }`}
                          alt={bug.title}
                          className="mt-2 w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      {bug.status !== "closed" && (
                        <button
                          onClick={() => handleCloseBug(bug._id)}
                          className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-300 text-sm"
                        >
                          Close Bug
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No bugs found for this project.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
