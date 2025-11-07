// // src/pages/projects/ProjectDetails.jsx
// import { useParams, Link } from "react-router-dom";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import api from "../../lib/api";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import FileUpload from "../../components/FileUpload";
// import { useAuth } from "../../context/AuthContext";
// import { format, parseISO } from "date-fns";

// // Safe date formatter
// const formatAPIDate = (dateString) => {
//   if (!dateString) return "N/A";
//   try {
//     const date = parseISO(dateString);
//     if (isNaN(date.getTime())) throw new Error("Invalid date");
//     return format(date, "MMM dd, yyyy");
//   } catch (err) {
//     console.warn("Invalid date value from API:", dateString);
//     return "Invalid Date";
//   }
// };

// const fetchProject = async (id) => {
//   const { data } = await api.get(`/projects?id=${id}`);
//   console.log("API response:", data);

//   // Handle both { data: [...] } and { project: {...} } formats
//   const projects = data.data || data.projects || [];
//   const project = Array.isArray(projects) 
//     ? projects.find(p => p._id === id)
//     : projects;

//   if (!project) throw new Error("Project not found");

//   // Fetch populated client name if only ID is present
//   if (project.client && typeof project.client === "string") {
//     try {
//       const clientRes = await api.get(`/clients/${project.client}`);
//       project.client = clientRes.data; // Populate client object
//     } catch (err) {
//       console.warn("Failed to fetch client:", err);
//       project.client = { name: "Unknown Client" };
//     }
//   } else if (!project.client) {
//     project.client = { name: "N/A" };
//   }

//   return project;
// };

// const fetchTasks = async (projectId) => {
//   const { data } = await api.get(`/projects/${projectId}/tasks`);
//   console.log("project specific task", data)
//   return data.data || data; // handle nested data
// };

// export default function ProjectDetails() {
//   const { id } = useParams();
//   console.log("id as params", id)
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const {
//     data: project,
//     isLoading: projectLoading,
//     error: projectError,
//   } = useQuery({
//     queryKey: ["project", id],
//     queryFn: () => fetchProject(id),
//   });

//   const {
//     data: tasks = [],
//     isLoading: tasksLoading,
//     error: tasksError,
//   } = useQuery({
//     queryKey: ["tasks", id],
//     queryFn: () => fetchTasks(id),
//   });

//   const handleUploadSuccess = () => {
//     queryClient.invalidateQueries({ queryKey: ["project", id] });
//     queryClient.invalidateQueries({ queryKey: ["tasks", id] });
//   };

//   const taskColumns = [
//     { field: "title", headerName: "Task", flex: 1 },
//     { field: "status", headerName: "Status", flex: 1 },
//     { 
//       field: "assignedTo.name", 
//       headerName: "Assigned To",
//       valueGetter: (params) => params.data?.assignedTo?.name || "Unassigned"
//     },
//     // {
//     //   field: "actions",
//     //   headerName: "",
//     //   width: 100,
//     //   cellRenderer: (params) => (
//     //     <Link 
//     //       to={`/projects/${id}/tasks/${params.data._id}/edit`} 
//     //       className="text-blue-600 text-sm hover:underline font-medium"
//     //     >
//     //       Edit
//     //     </Link>
//     //   ),
//     // },
//   ];

//   if (projectLoading) return <div className="p-8 text-center text-gray-600">Loading project...</div>;
//   if (projectError) return <div className="p-8 text-red-500 text-center">Error: {projectError.message}</div>;
//   if (!project) return <div className="p-8 text-center text-gray-600">Project not found.</div>;

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
        
//         {/* <p className="text-xl text-gray-600 dark:text-gray-400">
//           Client: <strong>{project.client?.name || "N/A"}</strong>
//         </p> */}
        
//         <p className="mt-2 text-gray-700 dark:text-gray-300">
//           {project.description || "No description provided."}
//         </p>
        
//         <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
//           <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//             project.status === "completed" ? "bg-green-100 text-green-800" :
//             project.status === "in-progress" ? "bg-blue-100 text-blue-800" :
//             project.status === "Planning" ? "bg-yellow-100 text-yellow-800" :
//             "bg-gray-100 text-gray-800"
//           }`}>
//             {project.status || "Planning"}
//           </span>

//           <span className="text-gray-500">
//             Created: {formatAPIDate(project.createdAt)}
//           </span>

//           <span className="text-gray-500">
//             Start: {formatAPIDate(project.startDate)}
//           </span>

//           <span className="text-gray-500">
//             End: {formatAPIDate(project.endDate)}
//           </span>

//           <span className="text-gray-500">
//             Updated: {formatAPIDate(project.updatedAt)}
//           </span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Tasks */}
//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-2xl font-bold">Tasks</h2>
//               {(user?.role === "Admin" || user?.role === "Manager") && (
//                 <Link
//                   to={`/projects/${id}/tasks/create`}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
//                 >
//                   + Add Task
//                 </Link>
//               )}
//             </div>

//             {tasksLoading && <p className="text-center py-8 text-gray-500">Loading tasks...</p>}
//             {tasksError && <p className="text-center text-red-500">Error loading tasks</p>}
            
//             {tasks.length === 0 && !tasksLoading && (
//               <p className="text-center py-12 text-lg text-gray-500">
//                 No tasks yet. Create the first one!
//               </p>
//             )}

//             {tasks.length > 0 && (
//               <div className="ag-theme-alpine dark:ag-theme-alpine-dark" style={{ height: 500, width: "100%" }}>
//                 <AgGridReact
//                   rowData={tasks}
//                   columnDefs={taskColumns}
//                   pagination={true}
//                   paginationPageSize={10}
//                   paginationPageSizeSelector={[10, 25, 50]}
//                   defaultColDef={{ sortable: true, filter: true, resizable: true }}
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Attachments */}
//         <div>
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
//             <h2 className="text-2xl font-bold mb-4">Attachments</h2>

//             {(user?.role === "Admin" || user?.role === "Manager") && (
//               <div className="mb-6">
//                 <FileUpload projectId={id} onUpload={handleUploadSuccess} />
//               </div>
//             )}

//             {project.attachments && project.attachments.length > 0 ? (
//               <div className="space-y-4">
//                 {project.attachments.map((file) => (
//                   <div
//                     key={file._id}
//                     className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition"
//                   >
//                     {/* Try to detect file type from URL or public_id */}
//                     {file.url && file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
//                       <img
//                         src={file.url}
//                         alt={file.public_id}
//                         className="w-full h-48 object-cover"
//                         loading="lazy"
//                       />
//                     ) : file.url && file.url.endsWith(".pdf") ? (
//                       <div className="bg-red-50 dark:bg-red-900/20 p-8 text-center">
//                         <p className="text-6xl">📄 PDF</p>
//                       </div>
//                     ) : (
//                       <div className="bg-gray-100 dark:bg-gray-700 p-8 text-center">
//                         <p className="text-6xl">📎</p>
//                       </div>
//                     )}

//                     <div className="p-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
//                       <p className="text-sm font-medium truncate max-w-xs" title={file.public_id}>
//                         {file.public_id || "Unknown file"}
//                       </p>
//                       <a
//                         href={file.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 text-xs hover:underline font-medium"
//                       >
//                         Open
//                       </a>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-center py-12 text-gray-500 text-lg">
//                 No attachments yet.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="mt-12">
//         <Link to="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
//           ← Back to Projects
//         </Link>
//       </div>
//     </div>
//   );
// }

// src/pages/projects/ProjectDetails.jsx
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
