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
