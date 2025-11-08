import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function CreateProject() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/projects", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/projects");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to create project");
    },
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      client: data.client || null,
      manager: user?._id || null,
      status:
        data.status === "planning" ? "Planning" :
        data.status === "in-progress" ? "In Progress" :
        data.status === "completed" ? "Completed" :
        data.status === "on-hold" ? "On Hold" :
        "Planning",
    };

    console.log("Creating project with:", formattedData);
    mutation.mutate(formattedData);
  };

  const containerStyle = {
    maxWidth: "768px",
    margin: "0 auto",
    padding: "2rem",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  };

  const buttonPrimary = {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const buttonSecondary = {
    backgroundColor: "#6b7280",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const errorStyle = {
    color: "red",
    fontSize: "13px",
    marginTop: "4px",
  };

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700" }}>Create New Project</h1>
        <p style={{ color: "#555", marginTop: "8px" }}>
          Fill in the details below to start a new project.
        </p>
        <p style={{ color: "red", marginTop: "4px" }}>
          For now, manually copy this Client ID: "ACME0012" (will implement soon...)
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={cardStyle}>
        {/* Project Name */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Project Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            {...register("name", { required: "Project name is required" })}
            placeholder="e.g. New ERP System"
            style={inputStyle}
          />
          {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
        </div>

        {/* Client ID */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>
            Client ID <span style={{ color: "red" }}>*</span>
          </label>
          <input
            {...register("client", { required: "Client ID is required" })}
            placeholder="e.g. 690cdcfa798575b71f7a1c0e"
            style={{ ...inputStyle, fontFamily: "monospace", fontSize: "13px" }}
          />
          {errors.client && <p style={errorStyle}>{errors.client.message}</p>}
        </div>

        {/* Description */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Description</label>
          <textarea
            {...register("description")}
            rows="4"
            placeholder="Brief overview of the project..."
            style={{ ...inputStyle, resize: "none" }}
          />
        </div>

        {/* Status */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Status</label>
          <select {...register("status")} defaultValue="planning" style={inputStyle}>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>

        {/* Start & End Date */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Start Date</label>
            <input
              {...register("startDate")}
              type="date"
              style={inputStyle}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label style={labelStyle}>End Date</label>
            <input {...register("endDate")} type="date" style={inputStyle} />
          </div>
        </div>

        {/* Submit Buttons */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            paddingTop: "24px",
            marginTop: "20px",
            borderTop: "1px solid #ddd",
          }}
        >
          <button
            type="submit"
            disabled={mutation.isPending}
            style={{
              ...buttonPrimary,
              opacity: mutation.isPending ? 0.7 : 1,
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
          >
            {mutation.isPending ? "Creating..." : "Create Project"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/projects")}
            style={buttonSecondary}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#4b5563")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#6b7280")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
