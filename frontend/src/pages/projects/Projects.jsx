// // src/pages/projects/Projects.jsx
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "../../lib/api";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import { Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useState, useEffect } from "react";

// const fetchProjects = async () => {
//   const { data } = await api.get("/projects");
//   return data.data || [];
// };

// // YOUR EXACT RESPONSE FORMAT: { data: [ { name: "kausik client" } ] }
// const fetchClientById = async (clientId) => {
//   if (!clientId) return "No Client Assigned";
//   try {
//     const response = await api.get(`/clients?id=${clientId}`);
//     console.log("Client API response:", response.data); // ← Debug

//     // EXACT MATCH FOR YOUR RESPONSE
//     if (response.data?.data?.[0]?.name) {
//       return response.data.data[0].name;
//     }
//     if (response.data?.client?.name) {
//       return response.data.client.name;
//     }
//     if (Array.isArray(response.data?.data) && response.data.data.length > 0) {
//       return response.data.data[0].name || "Unknown Client";
//     }
//     return "Client Not Found";
//   } catch (err) {
//     console.error("Client fetch failed:", err.response?.data || err);
//     return "Error";
//   }
// };

// export default function Projects() {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const { data: rawProjects = [], isLoading: projectsLoading } = useQuery({
//     queryKey: ["projects"],
//     queryFn: fetchProjects,
//   });

//   const [projects, setProjects] = useState([]);
//   const [clientsLoading, setClientsLoading] = useState(true);

//   useEffect(() => {
//     if (rawProjects.length === 0) {
//       setProjects([]);
//       setClientsLoading(false);
//       return;
//     }

//     const loadClients = async () => {
//       setClientsLoading(true);
//       const enriched = await Promise.all(
//         rawProjects.map(async (proj) => {
//           const clientName = await fetchClientById(proj.client);
//           return { ...proj, clientName };
//         })
//       );
//       setProjects(enriched);
//       setClientsLoading(false);
//     };

//     loadClients();
//   }, [rawProjects]);

//   const deleteMutation = useMutation({
//     mutationFn: (id) => api.delete(`/projects/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["projects"] });
//     },
//   });

//   const columnDefs = [
//     {
//       field: "name",
//       headerName: "Project Name",
//       flex: 2,
//       cellRenderer: (p) => {
//         return(
//         <Link to={`/projects/${p.data._id}`} className="text-indigo-600 hover:underline font-bold text-lg">
//           {p.value}
//         </Link>
//         )
//     },
//     },
//     {
//       field: "clientName",
//       headerName: "Client",
//       flex: 1.5,
//       valueGetter: (p) => p.data.clientName || "Loading...",
//       cellStyle: { fontWeight: "700", color: "#4f46e5" },
//     },
//     {
//       field: "status",
//       headerName: "Status",
//       flex: 1,
//       cellRenderer: (p) => (
//         <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
//           p.value === "Planning" ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" :
//           p.value === "In Progress" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" :
//           p.value === "Completed" ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" :
//           "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
//         }`}>
//           {p.value || "Planning"}
//         </span>
//       ),
//     },
//     {
//       field: "manager.name",
//       headerName: "Manager",
//       flex: 1,
//       valueGetter: (p) => p.data.manager?.name || "Unassigned",
//     },
//     {
//       field: "createdAt",
//       headerName: "Created",
//       flex: 1.2,
//       valueFormatter: (p) => new Date(p.value).toLocaleDateString("en-US", {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       }),
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1.2,
//       cellRenderer: (p) => (
//         <div className="flex gap-4 h-full items-center">
//           {(user?.role === "Admin" || user?.role === "Manager") && (
//             <button
//               onClick={() => deleteMutation.mutate(p.data._id)}
//               className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-bold shadow-xl transition transform hover:scale-105"
//               disabled={deleteMutation.isPending}
//             >
//               Delete
//             </button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   const isLoading = projectsLoading || clientsLoading;

//   return (
//     <div className="p-10 max-w-8xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-black min-h-screen">
//       <div className="flex justify-between items-center mb-10">
//         <div>
//           <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
//             Projects
//           </h1>
//           <p className="text-2xl text-gray-700 dark:text-gray-300 mt-4">
//             {projects.length} projects loaded • Clients: {clientsLoading ? "Fetching..." : "Ready"}
//           </p>
//         </div>
//         {(user?.role === "Admin" || user?.role === "Manager") && (
//           <Link
//             to="/projects/create"
//             className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-extrabold px-12 py-6 rounded-3xl shadow-2xl transition transform hover:scale-110 flex items-center gap-5 text-2xl"
//           >
//             <span className="text-4xl">+</span> New Project
//           </Link>
//         )}
//       </div>

//       {isLoading && (
//         <div className="text-center py-48">
//           <div className="inline-block animate-spin rounded-full h-24 w-24 border-12 border-purple-600 border-t-transparent"></div>
//           <p className="mt-10 text-4xl font-bold text-purple-600">Loading projects & clients...</p>
//         </div>
//       )}

//       {!isLoading && projects.length === 0 && (
//         <div className="text-center py-64 bg-white dark:bg-gray-800 rounded-3xl shadow-3xl">
//           <p className="text-9xl mb-10">🚀</p>
//           <p className="text-5xl font-bold text-gray-700 dark:text-gray-300">No Projects</p>
//         </div>
//       )}

//       {!isLoading && projects.length > 0 && (
//         <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-3xl overflow-hidden border-4 border-purple-300 dark:border-purple-700">
//           <div className="ag-theme-alpine dark:ag-theme-alpine-dark" style={{ height: 820, width: "100%" }}>
//             <AgGridReact
//               rowData={projects}
//               columnDefs={columnDefs}
//               pagination={true}
//               paginationPageSize={20}
//               paginationPageSizeSelector={[10, 20, 50, 100]}
//               domLayout="normal"
//               defaultColDef={{
//                 sortable: true,
//                 filter: true,
//                 resizable: true,
//                 flex: 1,
//               }}
//               rowHeight={85}
//               headerHeight={70}
//               animateRows={true}
//               enableCellTextSelection={true}
//             />
//           </div>
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
import { useState, useEffect } from "react";

const fetchProjects = async () => {
  const { data } = await api.get("/projects");
  return data.data || [];
};

const fetchClientById = async (clientId) => {
  if (!clientId) return "No Client Assigned";
  try {
    const response = await api.get(`/clients?id=${clientId}`);
    if (response.data?.data?.[0]?.name) return response.data.data[0].name;
    if (response.data?.client?.name) return response.data.client.name;
    return "Client Not Found";
  } catch {
    return "Error";
  }
};

export default function Projects() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: rawProjects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const [projects, setProjects] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  useEffect(() => {
    if (rawProjects.length === 0) {
      setProjects([]);
      setClientsLoading(false);
      return;
    }
    const loadClients = async () => {
      setClientsLoading(true);
      const enriched = await Promise.all(
        rawProjects.map(async (proj) => {
          const clientName = await fetchClientById(proj.client);
          return { ...proj, clientName };
        })
      );
      setProjects(enriched);
      setClientsLoading(false);
    };
    loadClients();
  }, [rawProjects]);

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const columnDefs = [
    {
      field: "name",
      headerName: "Project Name",
      flex: 2,
      cellRenderer: (p) => (
        <Link
          to={`/projects/${p.data._id}`}
          style={{
            color: "#4f46e5",
            fontWeight: "700",
            fontSize: "18px",
            textDecoration: "none",
          }}
          onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.target.style.textDecoration = "none")}
        >
          {p.value}
        </Link>
      ),
    },
    {
      field: "clientName",
      headerName: "Client",
      flex: 1.5,
      valueGetter: (p) => p.data.clientName || "Loading...",
      cellStyle: { fontWeight: "700", color: "#4f46e5" },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      cellRenderer: (p) => {
        let bgColor = "#9ca3af";
        if (p.value === "Planning") bgColor = "#f59e0b";
        if (p.value === "In Progress") bgColor = "#3b82f6";
        if (p.value === "Completed") bgColor = "#10b981";
        if (p.value === "On Hold") bgColor = "#6b7280";

        return (
          <span
            style={{
              background: bgColor,
              color: "white",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "700",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {p.value || "Planning"}
          </span>
        );
      },
    },
    {
      field: "manager.name",
      headerName: "Manager",
      flex: 1,
      valueGetter: (p) => p.data.manager?.name || "Unassigned",
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 1.2,
      valueFormatter: (p) =>
        new Date(p.value).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.2,
      cellRenderer: (p) => (
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {(user?.role === "Admin" || user?.role === "Manager") && (
            <button
              onClick={() => deleteMutation.mutate(p.data._id)}
              style={{
                background: "linear-gradient(90deg, #dc2626, #e11d48)",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "12px",
                fontWeight: "700",
                boxShadow: "0 4px 12px rgba(220,38,38,0.4)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.target.style.background = "linear-gradient(90deg, #b91c1c, #be123c)")
              }
              onMouseOut={(e) =>
                (e.target.style.background = "linear-gradient(90deg, #dc2626, #e11d48)")
              }
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  const isLoading = projectsLoading || clientsLoading;

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1600px",
        margin: "0 auto",
        background: "linear-gradient(135deg, #eef2ff, #ede9fe)",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "900",
              background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              margin: 0,
            }}
          >
            Projects
          </h1>
          <p style={{ fontSize: "20px", color: "#444", marginTop: "10px" }}>
            {projects.length} projects loaded • Clients:{" "}
            {clientsLoading ? "Fetching..." : "Ready"}
          </p>
        </div>

        {(user?.role === "Admin" || user?.role === "Manager") && (
          <Link
            to="/projects/create"
            style={{
              background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
              color: "#fff",
              fontWeight: "800",
              padding: "18px 40px",
              borderRadius: "30px",
              textDecoration: "none",
              boxShadow: "0 6px 16px rgba(79,70,229,0.4)",
              fontSize: "22px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.background =
                "linear-gradient(90deg, #4338ca, #6d28d9)")
            }
            onMouseOut={(e) =>
              (e.target.style.background =
                "linear-gradient(90deg, #4f46e5, #7c3aed)")
            }
          >
            <span style={{ fontSize: "34px" }}>+</span> New Project
          </Link>
        )}
      </div>

      {isLoading && (
        <div style={{ textAlign: "center", padding: "160px 0" }}>
          <div
            style={{
              display: "inline-block",
              height: "90px",
              width: "90px",
              border: "12px solid #7c3aed",
              borderTop: "12px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p
            style={{
              marginTop: "40px",
              fontSize: "28px",
              fontWeight: "700",
              color: "#7c3aed",
            }}
          >
            Loading projects & clients...
          </p>
        </div>
      )}

      {!isLoading && projects.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "200px 0",
            background: "#fff",
            borderRadius: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ fontSize: "80px", marginBottom: "20px" }}>🚀</p>
          <p style={{ fontSize: "36px", fontWeight: "700", color: "#444" }}>
            No Projects
          </p>
        </div>
      )}

      {!isLoading && projects.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            overflow: "hidden",
            border: "4px solid #c4b5fd",
          }}
        >
          <div
            className="ag-theme-alpine"
            style={{ height: 820, width: "100%" }}
          >
            <AgGridReact
              rowData={projects}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={20}
              paginationPageSizeSelector={[10, 20, 50, 100]}
              domLayout="normal"
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
                flex: 1,
              }}
              rowHeight={85}
              headerHeight={70}
              animateRows={true}
              enableCellTextSelection={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
