// src/pages/users/UserEdit.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const permissionsList = ["canCreateProject", "canCreateTask"];

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  // Fetch user
  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => api.get(`/users/${id}`).then((res) => res.data),
  });

  const user = data?.data;

  const grantMutation = useMutation({
    mutationFn: (perm) => api.patch(`/users/${id}/grant`, { permission: perm }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user", id] }),
  });

  const revokeMutation = useMutation({
    mutationFn: (perm) => api.patch(`/users/${id}/revoke`, { permission: perm }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user", id] }),
  });

  if (isLoading)
    return <div style={{ padding: 32, textAlign: "center" }}>Loading user...</div>;

  if (!user)
    return <div style={{ padding: 32, textAlign: "center", color: "red" }}>User not found</div>;

  const hasPermission = (perm) => user.permissions?.[perm] === true;

  return (
    <div style={{ maxWidth: 1024, margin: "0 auto", padding: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: "bold" }}>Edit User</h1>
          <p style={{ color: "#4B5563" }}>{user.name} • {user.email}</p>
        </div>
        <button
          onClick={() => navigate("/users")}
          style={{ color: "#2563EB", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
        >
          ← Back to All Users
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32, rowGap: 32 }}>
        {/* User Info */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>User Details</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, color: "#6B7280" }}>Role</p>
              <p style={{ fontWeight: "500" }}>{user.role}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: "#6B7280" }}>Joined</p>
              <p style={{ fontWeight: "500" }}>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div style={{ background: "#FFFFFF", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", padding: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>Permissions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {permissionsList.map((perm) => {
              const granted = hasPermission(perm);
              return (
                <div
                  key={perm}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #E5E7EB" }}
                >
                  <span style={{ fontWeight: "500" }}>{perm}</span>
                  <button
                    onClick={() =>
                      granted
                        ? revokeMutation.mutate(perm)
                        : grantMutation.mutate(perm)
                    }
                    disabled={grantMutation.isPending || revokeMutation.isPending}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: granted ? "not-allowed" : "pointer",
                      background: granted ? "#DCFCE7" : "#E5E7EB",
                      color: granted ? "#15803D" : "#374151",
                      transition: "background 0.2s",
                    }}
                  >
                    {granted ? "Already Granted" : "Click to Grant"}
                  </button>
                </div>
              );
            })}
          </div>

          {(currentUser?.role === "Admin" || currentUser?.role === "Manager") && (
            <p style={{ fontSize: 12, color: "#6B7280", marginTop: 16 }}>
              Only Admins/Managers can manage permissions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
