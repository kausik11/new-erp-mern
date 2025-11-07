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
 console.log("user",user);
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {user && (
          <nav className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
            <div className="flex space-x-6">
              <Link to="/" className="font-semibold">Dashboard</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/users">Users</Link>
              <Link to="/activity">Activity</Link>
            </div>
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.name}</span>
              <button onClick={logout} className="text-red-600">Logout</button>
              <ThemeToggle />
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/projects/create" element={<ProtectedRoute allowedRoles={["Admin", "Manager"]} requiredPermission="canCreateProject"><CreateProject /></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
          <Route path="/projects/:projectId/tasks/create" element={<ProtectedRoute allowedRoles={["Admin", "Manager"]} requiredPermission="canCreateTask"><CreateTask /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={["Admin", "Manager"]}><UserList /></ProtectedRoute>} />
          <Route path="/users/create" element={<ProtectedRoute allowedRoles={["Admin"]}><CreateUser /></ProtectedRoute>} />
          <Route path="/users/:id/edit" element={<ProtectedRoute allowedRoles={["Admin", "Manager"]}><UserEdit /></ProtectedRoute>} />
          <Route path="/activity" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;