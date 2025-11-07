// // src/pages/users/UserList.jsx
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "../../lib/api";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// const fetchUsers = () => api.get("/users").then(res => res.data);

// export default function UserList() {
//   const { user: currentUser } = useAuth();
//   const queryClient = useQueryClient();

//   const { data: users = [], isLoading, error } = useQuery({
//     queryKey: ["users"],
//     queryFn: fetchUsers,
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id) => api.delete(`/users/${id}`),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
//   });

//   const columns = [
//     { field: "name", headerName: "Name", flex: 1, filter: true },
//     { field: "email", headerName: "Email", flex: 1, filter: true },
//     {
//       field: "role",
//       headerName: "Role",
//       flex: 1,
//       cellRenderer: (params) => (
//         <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//           params.value === "Admin" ? "bg-red-100 text-red-800" :
//           params.value === "Manager" ? "bg-blue-100 text-blue-800" :
//           "bg-green-100 text-green-800"
//         }`}>
//           {params.value}
//         </span>
//       ),
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       cellRenderer: (params) => (
//         <div className="flex gap-3 h-full items-center">
//           <Link to={`/users/${params.data._id}/edit`} className="text-blue-600 hover:underline">
//             Edit
//           </Link>
//           {currentUser?.role === "Admin" && (
//             <button
//               onClick={() => deleteMutation.mutate(params.data._id)}
//               className="text-red-600 hover:underline"
//               disabled={deleteMutation.isPending}
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Team Members</h1>
//         {currentUser?.role === "Admin" && (
//           <Link to="/users/create" className="btn-primary">
//             + Add User
//           </Link>
//         )}
//       </div>

//       {<div className="text-center py-10">List of users comming soon...</div>}
//       {error && <div className="text-red-500 text-center py-10">Error loading users</div>}
//       {!isLoading && users.length === 0 && (
//         <div className="text-center py-10 text-gray-500">
//           No users yet. Invite your team!
//         </div>
//       )}

//       {users.length > 0 && (
//         <div className="ag-theme-alpine dark:ag-theme-alpine-dark" style={{ height: 600 }}>
//           <AgGridReact
//             rowData={users}
//             columnDefs={columns}
//             pagination={true}
//             paginationPageSize={10}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const fetchUsers = () => api.get("/users").then((res) => res.data);

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
      cellRenderer: (params) => {
        let bgColor = "#d1fae5";
        let textColor = "#065f46";
        if (params.value === "Admin") {
          bgColor = "#fee2e2";
          textColor = "#991b1b";
        } else if (params.value === "Manager") {
          bgColor = "#dbeafe";
          textColor = "#1e3a8a";
        }
        return (
          <span
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: "6px 10px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      cellRenderer: (params) => (
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <Link
            to={`/users/${params.data._id}/edit`}
            style={{
              color: "#2563eb",
              fontWeight: "600",
              textDecoration: "none",
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Edit
          </Link>

          {currentUser?.role === "Admin" && (
            <button
              onClick={() => deleteMutation.mutate(params.data._id)}
              disabled={deleteMutation.isPending}
              style={{
                background: "none",
                border: "none",
                color: "#dc2626",
                cursor: "pointer",
                fontWeight: "600",
              }}
              onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.target.style.textDecoration = "none")}
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1200px",
        margin: "0 auto",
        background: "linear-gradient(to bottom right, #eef2ff, #e0e7ff)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "800",
            color: "#1e3a8a",
            letterSpacing: "1px",
          }}
        >
          Team Members
        </h1>

        {currentUser?.role === "Admin" && (
          <Link
            to="/users/create"
            style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "white",
              fontSize: "18px",
              fontWeight: "700",
              padding: "12px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              boxShadow: "0 6px 12px rgba(79,70,229,0.3)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 8px 16px rgba(79,70,229,0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 6px 12px rgba(79,70,229,0.3)";
            }}
          >
            + Add User
          </Link>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            fontSize: "22px",
            color: "#4f46e5",
            fontWeight: "600",
          }}
        >
          Loading users...
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            color: "#dc2626",
            textAlign: "center",
            padding: "80px 0",
            fontWeight: "600",
            fontSize: "20px",
          }}
        >
          Error loading users
        </div>
      )}

      {/* Empty */}
      {!isLoading && users.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "100px 0",
            color: "#6b7280",
            fontSize: "20px",
            fontWeight: "500",
          }}
        >
          No users yet. Invite your team!
        </div>
      )}

      {/* Data Table */}
      {users.length > 0 && (
        <div
          className="ag-theme-alpine"
          style={{
            height: "600px",
            width: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            backgroundColor: "white",
          }}
        >
          <AgGridReact
            rowData={users}
            columnDefs={columns}
            pagination={true}
            paginationPageSize={10}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
          />
        </div>
      )}
    </div>
  );
}
