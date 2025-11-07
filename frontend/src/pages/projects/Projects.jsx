// src/pages/projects/Projects.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const fetchProjects = async () => {
  const { data } = await api.get("/projects");
  return data;
};

export default function Projects() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const columnDefs = [
    { field: "name", headerName: "Project Name", flex: 1, filter: true },
    { field: "client.name", headerName: "Client", flex: 1, filter: true },
    { field: "status", headerName: "Status", flex: 1, filter: true },
    { field: "createdAt", headerName: "Created", valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="flex items-center gap-2 h-full">
          <Link to={`/projects/${params.data._id}`} className="text-blue-600 hover:underline">
            View
          </Link>
          {(user?.role === "Admin" || user?.role === "Manager") && (
            <>
              <button
                onClick={() => deleteMutation.mutate(params.data._id)}
                className="text-red-600 hover:underline ml-4"
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        {(user?.role === "Admin" || user?.role === "Manager") && (
          <Link
            to="/projects/create"
            className="btn-primary flex items-center gap-2"
          >
            + New Project
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-10">Loading projects...</div>
      )}

      {error && (
        <div className="text-red-500 text-center py-10">
          Error loading projects. Please try again.
        </div>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No projects found. Create your first one!
        </div>
      )}

      {!isLoading && projects.length > 0 && (
        <div
          className="ag-theme-alpine dark:ag-theme-alpine-dark"
          style={{ height: 600, width: "100%" }}
        >
          <AgGridReact
            rowData={projects}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            domLayout="normal"
          />
        </div>
      )}
    </div>
  );
}