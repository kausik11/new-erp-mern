// src/pages/users/UserList.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const fetchUsers = () => api.get("/users").then(res => res.data);

export default function UserList() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const columns = [
    { field: "name", headerName: "Name", flex: 1, filter: true },
    { field: "email", headerName: "Email", flex: 1, filter: true },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      cellRenderer: (params) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          params.value === "Admin" ? "bg-red-100 text-red-800" :
          params.value === "Manager" ? "bg-blue-100 text-blue-800" :
          "bg-green-100 text-green-800"
        }`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="flex gap-3 h-full items-center">
          <Link to={`/users/${params.data._id}/edit`} className="text-blue-600 hover:underline">
            Edit
          </Link>
          {currentUser?.role === "Admin" && (
            <button
              onClick={() => deleteMutation.mutate(params.data._id)}
              className="text-red-600 hover:underline"
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Members</h1>
        {currentUser?.role === "Admin" && (
          <Link to="/users/create" className="btn-primary">
            + Add User
          </Link>
        )}
      </div>

      {isLoading && <div className="text-center py-10">Loading users...</div>}
      {error && <div className="text-red-500 text-center py-10">Error loading users</div>}
      {!isLoading && users.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No users yet. Invite your team!
        </div>
      )}

      {users.length > 0 && (
        <div className="ag-theme-alpine dark:ag-theme-alpine-dark" style={{ height: 600 }}>
          <AgGridReact
            rowData={users}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      )}
    </div>
  );
}