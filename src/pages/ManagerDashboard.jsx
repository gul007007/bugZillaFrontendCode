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
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch("/api/manager-dashboard");
      const data = await response.json();
      if (data.message) setMessage(data.message);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (response.ok) setProjects(data.projects || []);
      else console.error("Failed to fetch projects:", data.error);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

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
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Project updated!");
        setUpdateData({ projectId: "", developerEmails: [], qaEmails: [] });
        fetchProjects();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Project update error:", error);
    }
  };

  const viewBugs = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/bugs`);
      const data = await response.json();
      if (response.ok) {
        alert(JSON.stringify(data.bugs, null, 2));
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error fetching bugs:", error);
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

        {/* Projects Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Projects</h3>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition duration-300"
                >
                  <p className="text-lg font-medium text-blue-600">
                    {project.name}
                  </p>
                  <button
                    onClick={() => viewBugs(project._id)}
                    className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-300 text-sm"
                  >
                    View Bugs
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No projects yet.</p>
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
                id="qaEmails"
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
      </div>
    </div>
  );
};

export default ManagerDashboard;
