// src/pages/Dashboard.jsx
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [clients, projects, tasks] = await Promise.all([
        api.get("/clients"),
        api.get("/projects"),
        api.get("/projects"), // we'll count tasks later if needed
      ]);
      return {
        clients: clients.data.length,
        projects: projects.data.length,
        tasks: 42, // replace with real task count if you add endpoint
      };
    },
  });

  // Recent Activity
  const { data: activities = [], isLoading: actLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: () => api.get("/activities/?limit=5").then(res => res.data.slice(0, 5)),
  });

  // Recent Projects
  const { data: recentProjects = [], isLoading: projLoading } = useQuery({
    queryKey: ["recent-projects"],
    queryName: () => api.get("/projects?limit=5&sort=-createdAt").then(res => res.data),
  });

  const projectColumns = [
    { field: "name", headerName: "Project", flex: 1 },
    { field: "client.name", headerName: "Client", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "",
      width: 100,
      cellRenderer: (params) => (
        <Link to={`/projects/${params.data._id}`} className="text-blue-600 text-sm">
          View →
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user?.name || "User"}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === "Admin" && "Manage everything with full control."}
          {user?.role === "Manager" && "Oversee your teams and projects."}
          {user?.role === "Employee" && "Stay updated on your tasks."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Clients</p>
              <p className="text-3xl font-bold mt-2">
                {statsLoading ? "..." : stats?.clients || 0}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Projects</p>
              <p className="text-3xl font-bold mt-2">
                {statsLoading ? "..." : stats?.projects || 0}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
              <span className="text-2xl">📁</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold mt-2">
                {statsLoading ? "..." : stats?.tasks || 0}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Team Members</p>
              <p className="text-3xl font-bold mt-2">
                {statsLoading ? "..." : "12"}
              </p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
            <Link to="/projects" className="text-blue-600 hover:underline">
              View all →
            </Link>
          </div>

          {projLoading ? (
            <p>Loading projects...</p>
          ) : recentProjects.length === 0 ? (
            <p className="text-gray-500">No projects yet. Create one!</p>
          ) : (
            <div className="ag-theme-alpine dark:ag-theme-alpine-dark" style={{ height: 300 }}>
              <AgGridReact
                rowData={recentProjects}
                columnDefs={projectColumns}
                domLayout="autoHeight"
              />
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Link to="/activity" className="text-blue-600 hover:underline">
              View all →
            </Link>
          </div>

          {actLoading ? (
            <p>Loading activity...</p>
          ) : activities.length === 0 ? (
            <p className="text-gray-500">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div
                  key={act._id}
                  className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {act.user?.name || "Someone"}{" "}
                      <span className="text-gray-600">{act.action}</span>
                    </p>
                    <p className="text-sm text-blue-600">{act.target}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(act.createdAt), "MMM dd, HH:mm")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {(user?.role === "Admin" || user?.role === "Manager") && (
        <div className="mt-10 flex gap-4 flex-wrap">
          <Link
            to="/projects/create"
            className="btn-primary flex items-center gap-2"
          >
            + New Project
          </Link>
          <Link
            to="/users/create"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            + Add User
          </Link>
          <Link
            to="/clients"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Manage Clients
          </Link>
        </div>
      )}
    </div>
  );
}