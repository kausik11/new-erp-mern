// src/pages/projects/ProjectDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import FileUpload from "../../components/FileUpload";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

const fetchProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

const fetchTasks = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/tasks`);
  return data;
};

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id),
  });

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => fetchTasks(id),
  });

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["project", id] });
  };

  const taskColumns = [
    { field: "title", headerName: "Task", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "assignedTo.name", headerName: "Assigned To" },
    {
      field: "actions",
      headerName: "",
      width: 100,
      cellRenderer: (params) => (
        <Link to="#" className="text-blue-600 text-sm">
          Edit
        </Link>
      ),
    },
  ];

  if (projectLoading) return <div className="p-8 text-center">Loading project...</div>;
  if (projectError) return <div className="p-8 text-red-500 text-center">Error loading project.</div>;
  if (!project) return <div className="p-8 text-center">Project not found.</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Client: <strong>{project.client?.name || "N/A"}</strong>
        </p>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{project.description}</p>
        <div className="mt-4 flex items-center gap-6 text-sm">
          <span className={`px-3 py-1 rounded-full ${project.status === "completed" ? "bg-green-100 text-green-800" :
              project.status === "in-progress" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
            }`}>
            {project.status || "planning"}
          </span>
          <span className="text-gray-500">
            Created: {format(new Date(project.createdAt), "MMM dd, yyyy")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Tasks</h2>
              {(user?.role === "Admin" || user?.role === "Manager") && (
                <Link
                  to={`/projects/${id}/tasks/create`}
                  className="btn-primary text-sm"
                >
                  + Add Task
                </Link>
              )}
            </div>

            {tasksLoading && < p>Loading tasks...</p>}
            {tasksError && <p className="text-red-500">Error loading tasks.</p>}
            {!tasksLoading && tasks.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No tasks yet. Create the first one!
              </p>
            )}

            {tasks.length > 0 && (
              <div className="ag-theme-alpine dark:ag-theme-alpine-dark" style={{ height: 400 }}>
                <AgGridReact
                  rowData={tasks}
                  columnDefs={taskColumns}
                  pagination={true}
                  paginationPageSize={10}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Attachments */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Attachments</h2>

            {(user?.role === "Admin" || user?.role === "Manager") && (
              <FileUpload
                projectId={id}
                onUpload={handleUploadSuccess}
              />
            )}

            {project.attachments && project.attachments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 mt-6">
                {project.attachments.map((file) => (
                  <div
                    key={file._id}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
                  >
                    {file.mimetype.startsWith("image/") ? (
                      <img
                        src={`http://localhost:5000/${file.path}`}
                        alt={file.originalName}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="bg-gray-100 dark:bg-gray-700 p-4 text-center">
                        <p className="text-4xl">📄</p>
                      </div>
                    )}
                    <div className="p-3 bg-gray-50 dark:bg-gray-700">
                      <p className="text-sm font-medium truncate">{file.originalName}</p>
                      <a
                        href={`http://localhost:5000/${file.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs hover:underline"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No attachments yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-10">
        <Link
          to="/projects"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          ← Back to Projects
        </Link>
      </div>
    </div>
  );
}