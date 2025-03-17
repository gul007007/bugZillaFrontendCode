import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

const QADashboard = () => {
  const [bugData, setBugData] = useState({
    projectId: "",
    title: "",
    description: "",
    deadline: "",
    type: "bug",
    assignedTo: "",
    image: null,
  });
  const [bugs, setBugs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      const userResponse = await fetch("/api/auth/user", {
        headers: { "Cache-Control": "no-cache" },
      });
      const userData = await userResponse.json();
      if (userResponse.ok) {
        setUserRole(userData.user.role.name);
      } else {
        throw new Error(userData.error || "Failed to fetch user role");
      }

      const bugResponse = await fetch("/api/bugs/qa", {
        headers: { "Cache-Control": "no-cache" },
      });
      const bugData = await bugResponse.json();
      if (bugResponse.ok) {
        if (bugData.bugs) {
          setBugs(bugData.bugs);
        } else if (bugData.message) {
          setBugs([]);
        }
      } else if (bugResponse.status === 403) {
        alert(bugData.error || "You are not assigned to any projects.");
        navigate("/login");
        return;
      } else {
        console.error("Failed to fetch bugs:", bugData.error);
        setBugs([]);
      }

      const projectResponse = await fetch("/api/projects/qa", {
        headers: { "Cache-Control": "no-cache" },
      });
      const projectData = await projectResponse.json();
      if (projectResponse.ok) {
        if (projectData.projects) {
          setProjects(projectData.projects);
        } else if (projectData.message) {
          setProjects([]);
        }
      } else {
        console.error("Failed to fetch projects:", projectData.error);
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setBugs([]);
      setProjects([]);
    }
  }, [navigate]);

  const fetchDevelopers = useCallback(async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/developers`, {
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await response.json();
      if (response.ok && data.developers) {
        setDevelopers(data.developers);
      } else {
        setDevelopers([]);
        console.error("Failed to fetch developers:", data.error);
      }
    } catch (error) {
      console.error("Error fetching developers:", error);
      setDevelopers([]);
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

  const handleBugChange = (e) => {
    const { name, value } = e.target;
    if (name === "projectId" && value) {
      setBugData({ ...bugData, [name]: value });
      fetchDevelopers(value);
    } else if (name === "image") {
      setBugData({ ...bugData, image: e.target.files[0] });
    } else {
      setBugData({ ...bugData, [name]: value });
    }
  };

  const handleBugSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("projectId", bugData.projectId || "");
      formData.append("title", bugData.title || "");
      formData.append("description", bugData.description || "");
      formData.append("deadline", bugData.deadline || "");
      formData.append("type", bugData.type || "bug");
      formData.append("status", "new"); // Hardcode status to "new"
      if (bugData.assignedTo) formData.append("assignedTo", bugData.assignedTo);
      if (bugData.image) formData.append("image", bugData.image);

      const response = await fetch(
        `/api/bugs/projects/${bugData.projectId}/bugs`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Bug created!");
        setBugData({
          projectId: "",
          title: "",
          description: "",
          deadline: "",
          type: "bug",
          assignedTo: "",
          image: null,
        });
        fetchDashboardData();
      } else {
        alert(data.error || "Bug creation failed");
      }
    } catch (error) {
      console.error("Bug creation error:", error);
      alert("An error occurred. Please check the console for details.");
    }
  };

  const handleLockBug = async (bugId) => {
    try {
      const response = await fetch(`/api/bugs/${bugId}/lock`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${text}`
        );
      }
      const data = await response.json();
      alert(data.message);
      fetchDashboardData();
    } catch (error) {
      console.error("Lock bug error:", error.message);
      alert("An error occurred. Please try again. Check console for details.");
    }
  };

  const handleUpdateStatus = async (bugId, newStatus) => {
    try {
      const response = await fetch(`/api/bugs/${bugId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Status updated!");
        fetchDashboardData();
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("An error occurred. Please try again.");
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
    if (role === "QA") {
      return nextStatuses.includes("done_from_qa") ? ["done_from_qa"] : [];
    } else if (role === "Developer") {
      return nextStatuses.filter(
        (status) => status === "started" || status === "posted_to_qa"
      );
    } else if (role === "Manager") {
      return nextStatuses.includes("closed") ? ["closed"] : [];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600">QA Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Assigned Bugs
          </h3>
          {bugs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {bugs.map((bug) => {
                const allowedStatuses = getAllowedStatuses(
                  bug.status,
                  userRole
                );
                return (
                  <div
                    key={bug._id}
                    className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200 hover:shadow-md transition duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-blue-600">
                          {bug.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Type: {bug.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {bug.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          Assigned to: {bug.assignedTo?.name || "Unassigned"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Project: {bug.projectId?.name || "Unknown Project"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Locked: {bug.locked ? "Yes" : "No"}
                        </p>
                      </div>
                      {bug.image && (
                        <img
                          src={`http://localhost:5000/uploads${
                            bug.image.startsWith("/uploads")
                              ? bug.image
                              : "/" + bug.image
                          }`}
                          alt={bug.title}
                          className="w-16 h-16 object-cover rounded-md ml-4"
                          onError={(e) => console.error("Image load error:", e)}
                        />
                      )}
                    </div>
                    <div className="mt-2">
                      {bug.status !== "closed" && (
                        <button
                          onClick={() => handleLockBug(bug._id)}
                          className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-300 mr-2"
                        >
                          {bug.locked ? "Unlock" : "Lock"} Bug
                        </button>
                      )}
                      {allowedStatuses.length > 0 ? (
                        <select
                          onChange={(e) =>
                            handleUpdateStatus(bug._id, e.target.value)
                          }
                          value={bug.status}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
                        >
                          <option value={bug.status}>{bug.status}</option>
                          {allowedStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No status updates available for your role.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No bugs created yet.</p>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Create Bug
          </h3>
          <form onSubmit={handleBugSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="projectId"
                className="block text-sm font-medium text-gray-700"
              >
                Project
              </label>
              <select
                id="projectId"
                name="projectId"
                value={bugData.projectId}
                onChange={handleBugChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={bugData.title}
                onChange={handleBugChange}
                placeholder="Bug/Feature Title"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={bugData.description}
                onChange={handleBugChange}
                placeholder="Description (optional)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="deadline"
                className="block text-sm font-medium text-gray-700"
              >
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={bugData.deadline}
                onChange={handleBugChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              />
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <select
                id="type"
                name="type"
                value={bugData.type}
                onChange={handleBugChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              >
                <option value="bug">Bug</option>
                <option value="feature">Feature</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="assignedTo"
                className="block text-sm font-medium text-gray-700"
              >
                Assign to Developer
              </label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={bugData.assignedTo}
                onChange={handleBugChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              >
                <option value="">Unassigned</option>
                {developers.map((dev) => (
                  <option key={dev._id} value={dev._id}>
                    {dev.name} ({dev.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image (PNG/GIF, ≤5MB)
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept=".png,.gif"
                onChange={(e) =>
                  setBugData({ ...bugData, image: e.target.files[0] })
                }
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Create Bug
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QADashboard;
