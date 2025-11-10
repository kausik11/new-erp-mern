import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ThemeToggle from "./components/ThemeToggle";

// Import all pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/projects/Projects";
import CreateProject from "./pages/projects/CreateProject";
import ProjectDetails from "./pages/projects/ProjectDetails";
import CreateTask from "./pages/tasks/CreateTask";
import UserList from "./pages/users/UserList";
import CreateUser from "./pages/users/CreateUser";
import UserEdit from "./pages/users/UserEdit";
import ActivityLog from "./pages/ActivityLog";

function App() {
  const { user, logout } = useAuth();
  console.log("user", user);

  // Inline style objects
  const styles = {
    appContainer: {
      minHeight: "100vh",
      backgroundColor: "var(--bg-primary)",
      color: "var(--text-primary)",
      "--bg-primary": "#f9fafb", // gray-50
      "--bg-secondary": "#ffffff", // white
      "--bg-dark": "#111827", // gray-900
      "--text-primary": "#111827", // gray-900
      "--text-secondary": "#374151", // gray-700
      "--border": "#e5e7eb", // gray-200
      "--blue-600": "#2563eb",
      "--blue-400": "#60a5fa",
      "--blue-800": "#1e40af",
      "--blue-300": "#93c5fd",
    },
    nav: {
      backgroundColor: "var(--bg-secondary)",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      borderBottom: "1px solid var(--border)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    },
    navInner: {
      maxWidth: "80rem",
      margin: "0 auto",
      padding: "0 1rem",
    },
    navFlex: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "4rem",
    },
    navLinks: {
      display: "flex",
      gap: "2rem",
    },
    linkBase: {
      fontWeight: "500",
      transition: "color 0.2s",
    },
    linkDashboard: {
      fontWeight: "700",
      fontSize: "1.125rem",
      color: "var(--blue-600)",
    },
    linkHover: {
      color: "var(--blue-800)",
    },
    linkDark: {
      color: "var(--blue-400)",
    },
    linkHoverDark: {
      color: "var(--blue-300)",
    },
    userArea: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    welcomeText: {
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    logoutBtn: {
      padding: "0.5rem 1rem",
      backgroundColor: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: "0.375rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    logoutBtnHover: {
      backgroundColor: "#b91c1c",
    },
  };

  // Dark mode overrides
  if (document.documentElement.classList.contains("dark")) {
    styles.appContainer["--bg-primary"] = "#111827";
    styles.appContainer["--bg-secondary"] = "#1f2937";
    styles.appContainer["--text-primary"] = "#f3f4f6";
    styles.appContainer["--text-secondary"] = "#d1d5db";
    styles.appContainer["--border"] = "#374151";
  }

  return (
    <BrowserRouter>
      <div style={styles.appContainer}>
        {user && (
          <nav style={styles.nav}>
            <div style={styles.navInner}>
              <div style={styles.navFlex}>
                <div style={styles.navLinks}>
                  <Link
                    to="/"
                    style={{
                      ...styles.linkBase,
                      ...styles.linkDashboard,
                      ...(document.documentElement.classList.contains("dark")
                        ? styles.linkDark
                        : {}),
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = document.documentElement.classList.contains("dark")
                        ? "#93c5fd"
                        : "#1e40af")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = document.documentElement.classList.contains("dark")
                        ? "#60a5fa"
                        : "#2563eb")
                    }
                  >
                    Dashboard
                  </Link>
                  {["/projects", "/users", "/activity"].map((path) => (
                    <Link
                      key={path}
                      to={path}
                      style={{
                        ...styles.linkBase,
                        color: document.documentElement.classList.contains("dark")
                          ? "#d1d5db"
                          : "#374151",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = document.documentElement.classList.contains("dark")
                          ? "#93c5fd"
                          : "#2563eb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = document.documentElement.classList.contains("dark")
                          ? "#d1d5db"
                          : "#374151")
                      }
                    >
                      {path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                    </Link>
                  ))}
                </div>

                <div style={styles.userArea}>
                  <span style={styles.welcomeText}>
                    Welcome, <strong>{user.name}</strong>
                  </span>
                  <button
                    onClick={logout}
                    style={styles.logoutBtn}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
                  >
                    Logout
                  </button>
                  {/* <ThemeToggle /> */}
                </div>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
          <Route path="/projects/:projectId/tasks/create" element={<CreateTask />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/create"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
                <UserEdit />
              </ProtectedRoute>
            }
          />
          <Route path="/activity" element={<ActivityLog />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;