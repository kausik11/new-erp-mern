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
      const [clients, projects] = await Promise.all([
        api.get("/clients"),
        api.get("/projects"),
      ]);
      return {
        clients: clients.data.data.length,
        projects: projects.data.data.length,
        tasks: 42,
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
    queryFn: () => api.get("/projects?limit=5&sort=-createdAt").then(res => res.data),
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
        <Link
          to={`/projects/${params.data._id}`}
          style={{
            color: "#2563eb",
            fontSize: "0.875rem",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#2563eb")}
        >
          View →
        </Link>
      ),
    },
  ];

  // Inline styles object
  const isDark = document.documentElement.classList.contains("dark");

  const styles = {
    container: {
      padding: "1.5rem",
      maxWidth: "80rem",
      margin: "0 auto",
    },
    welcomeSection: {
      marginBottom: "2rem",
    },
    heading: {
      fontSize: "2.5rem",
      fontWeight: "700",
      marginBottom: "0.5rem",
    },
    subtext: {
      color: isDark ? "#9ca3af" : "#4b5563",
      fontSize: "1rem",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
      gap: "1.5rem",
      marginBottom: "2.5rem",
      "@media (min-width: 768px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
      "@media (min-width: 1024px)": { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" },
    },
    card: {
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      padding: "1.5rem",
      borderRadius: "0.75rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    cardContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardText: {
      color: "#6b7280",
      fontSize: "0.875rem",
    },
    cardNumber: {
      fontSize: "1.875rem",
      fontWeight: "700",
      marginTop: "0.5rem",
    },
    iconCircle: (colorLight, colorDark) => ({
      backgroundColor: isDark ? colorDark : colorLight,
      padding: "1rem",
      borderRadius: "9999px",
      fontSize: "2rem",
    }),
    mainGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
      gap: "2rem",
      "@media (min-width: 1024px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
    },
    section: {
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      borderRadius: "0.75rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "1.5rem",
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1rem",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
    },
    link: {
      color: "#2563eb",
      textDecoration: "none",
      fontSize: "1rem",
    },
    linkHover: {
      textDecoration: "underline",
    },
    agGridContainer: {
      height: 300,
    },
    activityItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "0.75rem",
      backgroundColor: isDark ? "#374151" : "#f3f4f6",
      borderRadius: "0.5rem",
    },
    activityText: {
      fontWeight: "500",
    },
    activityAction: {
      color: "#4b5563",
    },
    activityTarget: {
      fontSize: "0.875rem",
      color: "#2563eb",
    },
    activityTime: {
      fontSize: "0.75rem",
      color: "#6b7280",
    },
    quickActions: {
      marginTop: "2.5rem",
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
    },
    btnPrimary: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      padding: "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      fontWeight: "600",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "background-color 0.2s",
    },
    btnGreen: {
      backgroundColor: "#16a34a",
      color: "#ffffff",
      padding: "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      textDecoration: "none",
    },
    btnPurple: {
      backgroundColor: "#9333ea",
      color: "#ffffff",
      padding: "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      {/* Welcome */}
      <div style={styles.welcomeSection}>
        <h1 style={styles.heading}>
          Welcome back, {user?.name || "User"}! 👋
        </h1>
        <p style={styles.subtext}>
          {user?.role === "Admin" && "Manage everything with full control."}
          {user?.role === "Manager" && "Oversee your teams and projects."}
          {user?.role === "Employee" && "Stay updated on your tasks."}
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: window.innerWidth < 768 ? "repeat(1, minmax(0, 1fr))" :
                                 window.innerWidth < 1024 ? "repeat(2, minmax(0, 1fr))" :
                                                            "repeat(4, minmax(0, 1fr))",
        gap: "1.5rem",
        marginBottom: "2.5rem",
      }}>
        {/* Clients */}
        <div style={styles.card}>
          <div style={styles.cardContent}>
            <div>
              <p style={styles.cardText}>Total Clients</p>
              <p style={styles.cardNumber}>
                {statsLoading ? "..." : stats?.clients || 0}
              </p>
            </div>
            <div style={styles.iconCircle("#dbeafe", "#1e40af")}>👥</div>
          </div>
        </div>

        {/* Projects */}
        <div style={styles.card}>
          <div style={styles.cardContent}>
            <div>
              <p style={styles.cardText}>Active Projects</p>
              <p style={styles.cardNumber}>
                {statsLoading ? "..." : stats?.projects || 0}
              </p>
            </div>
            <div style={styles.iconCircle("#d1fae5", "#166534")}>📁</div>
          </div>
        </div>

        {/* Team Members */}
        <div style={styles.card}>
          <div style={styles.cardContent}>
            <div>
              <p style={styles.cardText}>Team Members</p>
              <p style={styles.cardNumber}>
                {statsLoading ? "..." : "12"}
              </p>
            </div>
            <div style={styles.iconCircle("#fed7aa", "#ea580c")}>👥</div>
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: window.innerWidth < 1024 ? "repeat(1, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))",
        gap: "2rem",
      }}>
        {/* Recent Projects */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Projects</h2>
            <Link
              to="/projects"
              style={styles.link}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
            >
              View all →
            </Link>
          </div>

          {projLoading ? (
            <p>Loading projects...</p>
          ) : recentProjects.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No projects yet. Create one!</p>
          ) : (
            <div className={isDark ? "ag-theme-alpine-dark" : "ag-theme-alpine"} style={styles.agGridContainer}>
              <AgGridReact
                rowData={recentProjects}
                columnDefs={projectColumns}
                domLayout="autoHeight"
              />
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Activity</h2>
            <Link
              to="/activity"
              style={styles.link}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
            >
              View all →
            </Link>
          </div>

          {actLoading ? (
            <p>Loading activity...</p>
          ) : activities.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No recent activity.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {activities.map((act) => (
                <div key={act._id} style={styles.activityItem}>
                  <div>
                    <p style={styles.activityText}>
                      {act.user?.name || "Someone"}{" "}
                      <span style={styles.activityAction}>{act.action}</span>
                    </p>
                    <p style={styles.activityTarget}>{act.target}</p>
                  </div>
                  <span style={styles.activityTime}>
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
        <div style={styles.quickActions}>
          <Link
            to="/projects/create"
            style={styles.btnPrimary}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          >
            + New Project
          </Link>
          <Link
            to="/users/create"
            style={styles.btnGreen}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#15803d")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#16a34a")}
          >
            + Add User
          </Link>
          <Link
            to="/clients"
            style={styles.btnPurple}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7c3aed")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#9333ea")}
          >
            Manage Clients
          </Link>
        </div>
      )}
    </div>
  );
}