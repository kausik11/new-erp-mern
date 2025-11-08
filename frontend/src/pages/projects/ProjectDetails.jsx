import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import FileUpload from "../../components/FileUpload";
import { useAuth } from "../../context/AuthContext";
import { format, parseISO } from "date-fns";

// Safe date formatter
const formatAPIDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) throw new Error("Invalid date");
    return format(date, "MMM dd, yyyy");
  } catch (err) {
    console.warn("Invalid date value from API:", dateString);
    return "Invalid Date";
  }
};

const fetchProject = async (id) => {
  const { data } = await api.get(`/projects?id=${id}`);
  const projects = data.data || data.projects || [];
  const project = Array.isArray(projects)
    ? projects.find((p) => p._id === id)
    : projects;

  if (!project) throw new Error("Project not found");

  if (project.client && typeof project.client === "string") {
    try {
      const clientRes = await api.get(`/clients/${project.client}`);
      project.client = clientRes.data;
    } catch {
      project.client = { name: "Unknown Client" };
    }
  } else if (!project.client) {
    project.client = { name: "N/A" };
  }

  return project;
};

const fetchTasks = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}/tasks`);
  return data.data || data;
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
    queryClient.invalidateQueries({ queryKey: ["tasks", id] });
  };

  const taskColumns = [
    { field: "title", headerName: "Task", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "assignedTo.name",
      headerName: "Assigned To",
      valueGetter: (params) => params.data?.assignedTo?.name || "Unassigned",
    },
  ];

  if (projectLoading)
    return <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>Loading project...</div>;
  if (projectError)
    return <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>Error: {projectError.message}</div>;
  if (!project)
    return <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>Project not found.</div>;

  // ----- INLINE STYLE OBJECTS -----
  const container = { padding: "2rem", maxWidth: "1200px", margin: "0 auto" };
  const headerTitle = { fontSize: "32px", fontWeight: "700", marginBottom: "8px" };
  const description = { color: "#444", marginTop: "8px" };
  const badgeBase = {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
  };
  const infoText = { color: "#666", fontSize: "14px" };
  const card = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "1.5rem",
  };
  const sectionTitle = { fontSize: "22px", fontWeight: "700", marginBottom: "1rem" };
  const button = {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    display: "inline-block",
  };
  const gridContainer = { display: "grid", gap: "2rem", gridTemplateColumns: "2fr 1fr" };
  const linkBack = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  };

  // Determine status color
  const statusStyle = {
    ...badgeBase,
    backgroundColor:
      project.status === "completed"
        ? "#dcfce7"
        : project.status === "in-progress"
        ? "#dbeafe"
        : project.status === "Planning"
        ? "#fef9c3"
        : "#f3f4f6",
    color:
      project.status === "completed"
        ? "#166534"
        : project.status === "in-progress"
        ? "#1e40af"
        : project.status === "Planning"
        ? "#854d0e"
        : "#374151",
  };

  return (
    <div style={container}>
      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={headerTitle}>{project.name}</h1>
        <p style={description}>{project.description || "No description provided."}</p>

        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
          <span style={statusStyle}>{project.status || "Planning"}</span>
          <span style={infoText}>Created: {formatAPIDate(project.createdAt)}</span>
          <span style={infoText}>Start: {formatAPIDate(project.startDate)}</span>
          <span style={infoText}>End: {formatAPIDate(project.endDate)}</span>
          <span style={infoText}>Updated: {formatAPIDate(project.updatedAt)}</span>
        </div>
      </div>

      <div style={gridContainer}>
        {/* TASKS */}
        <div>
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={sectionTitle}>Tasks</h2>
              {(user?.role === "Admin" || user?.role === "Manager") && (
                <Link
                   to={`/projects/${id}/tasks/create`}
                  style={button}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
                >
                  + Add Task
                </Link>
              )}
            </div>

            {tasksLoading && <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>Loading tasks...</p>}
            {tasksError && <p style={{ textAlign: "center", color: "red" }}>Error loading tasks</p>}
            {tasks.length === 0 && !tasksLoading && (
              <p style={{ textAlign: "center", padding: "3rem", color: "#777", fontSize: "16px" }}>
                No tasks yet. Create the first one!
              </p>
            )}
            {tasks.length > 0 && (
              <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
                <AgGridReact
                  rowData={tasks}
                  columnDefs={taskColumns}
                  pagination={true}
                  paginationPageSize={10}
                  paginationPageSizeSelector={[10, 25, 50]}
                  defaultColDef={{ sortable: true, filter: true, resizable: true }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ATTACHMENTS */}
        <div>
          <div style={card}>
            <h2 style={sectionTitle}>Attachments</h2>

            {(user?.role === "Admin" || user?.role === "Manager") && (
              <div style={{ marginBottom: "1.5rem" }}>
                <FileUpload projectId={id} onUpload={handleUploadSuccess} />
              </div>
            )}

            {project.attachments && project.attachments.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {project.attachments.map((file) => (
                  <div
                    key={file._id}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      overflow: "hidden",
                      transition: "box-shadow 0.3s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)")}
                    onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
                  >
                    {file.url && file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={file.url} alt={file.public_id} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                    ) : file.url && file.url.endsWith(".pdf") ? (
                      <div style={{ backgroundColor: "#fee2e2", padding: "2rem", textAlign: "center" }}>
                        <p style={{ fontSize: "40px" }}>📄 PDF</p>
                      </div>
                    ) : (
                      <div style={{ backgroundColor: "#f3f4f6", padding: "2rem", textAlign: "center" }}>
                        <p style={{ fontSize: "40px" }}>📎</p>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.5rem 1rem",
                        backgroundColor: "#f9fafb",
                      }}
                    >
                      <p style={{ fontSize: "14px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {file.public_id || "Unknown file"}
                      </p>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#2563eb", fontSize: "13px", textDecoration: "none" }}
                        onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
                        onMouseOut={(e) => (e.target.style.textDecoration = "none")}
                      >
                        Open
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: "center", padding: "3rem", color: "#777", fontSize: "16px" }}>
                No attachments yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* BACK LINK */}
      <div style={{ marginTop: "3rem" }}>
        <Link
          to="/projects"
          style={linkBack}
          onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.target.style.textDecoration = "none")}
        >
          ← Back to Projects
        </Link>
      </div>
    </div>
  );
}
