// src/pages/users/UserEdit.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const permissionsList = [
  "canCreateProject",
  "canCreateTask",
  "canViewReports",
  "canManageUsers",
];

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => api.get(`/users/${id}`).then(res => res.data),
  });

  const grantMutation = useMutation({
    mutationFn: (perm) => api.patch(`/users/${id}/grant`, { permission: perm }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user", id] }),
  });

  const revokeMutation = useMutation({
    mutationFn: (perm) => api.patch(`/users/${id}/revoke`, { permission: perm }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user", id] }),
  });

  if (isLoading) return <div className="p-8 text-center">Loading user...</div>;
  if (!user) return <div className="p-8 text-center text-red-500">User not found</div>;

  const hasPermission = (perm) => user.permissions?.includes(perm);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit User</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user.name} • {user.email}
          </p>
        </div>
        <button onClick={() => navigate("/users")} className="text-blue-600 hover:underline">
          ← Back to Users
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">User Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Permissions</h2>
          <div className="space-y-3">
            {permissionsList.map((perm) => (
              <div key={perm} className="flex justify-between items-center py-3 border-b dark:border-gray-700">
                <span className="font-medium">{perm}</span>
                <button
                  onClick={() => hasPermission(perm) ? revokeMutation.mutate(perm) : grantMutation.mutate(perm)}
                  disabled={grantMutation.isPending || revokeMutation.isPending}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    hasPermission(perm)
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {hasPermission(perm) ? "Revoke" : "Grant"}
                </button>
              </div>
            ))}
          </div>
          {(currentUser?.role === "Admin" || currentUser?.role === "Manager") && (
            <p className="text-xs text-gray-500 mt-4">
              Only Admins/Managers can manage permissions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}