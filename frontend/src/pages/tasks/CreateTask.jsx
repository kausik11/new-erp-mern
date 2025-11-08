import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function CreateTask() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data.data || res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: (taskData) => api.post(`/projects/${projectId}/tasks`, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      navigate(`/projects/${projectId}`);
    },
    onError: (error) => {
      console.error("Create task error:", error);
      alert(error.response?.data?.message || "Failed to create task");
    },
  });

  const onSubmit = (data) => {
    const formattedDueDate = data.dueDate 
      ? new Date(data.dueDate + "T00:00:00.000Z").toISOString()
      : null;

    const formattedData = {
      ...data,
      assignedTo: data.assignedTo || null,
      dueDate: formattedDueDate,
      status:
        data.status === "todo" ? "To Do" :
        data.status === "in-progress" ? "In Progress" :
        data.status === "review" ? "Review" :
        data.status === "done" ? "Done" : "To Do",
      priority:
        data.priority === "low" ? "Low" :
        data.priority === "medium" ? "Medium" :
        data.priority === "high" ? "High" :
        data.priority === "urgent" ? "Critical" : "Medium",
    };

    console.log("Final payload →", formattedData);
    mutation.mutate(formattedData);
  };

  return (
    <div style={{
      maxWidth: "700px",
      margin: "0 auto",
      padding: "40px",
      fontFamily: "sans-serif",
    }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px" }}>Create New Task</h1>
        <p style={{ color: "#555" }}>
          Project ID: <code style={{ background: "#eee", padding: "4px 8px", borderRadius: "6px" }}>{projectId}</code>
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          background: "#fff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Title */}
        <div>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
            Task Title <span style={{ color: "red" }}>*</span>
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Enter task title"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          />
          {errors.title && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "4px" }}>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
            Description
          </label>
          <textarea
            {...register("description")}
            rows="4"
            placeholder="Optional description..."
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              resize: "none",
              fontSize: "15px",
            }}
          />
        </div>

        {/* Assign To */}
        <div>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
            Assign To
          </label>
          <select
            {...register("assignedTo")}
            defaultValue=""
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          >
            <option value="" disabled>
              {usersLoading ? "Loading..." : "Select member"}
            </option>
            <option value="">Unassigned</option>
            {Array.isArray(users) &&
              users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role}) - {u.email}
                </option>
              ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
            Status
          </label>
          <select
            {...register("status")}
            defaultValue="todo"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
            Priority
          </label>
          <select
            {...register("priority")}
            defaultValue="medium"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Critical</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label style={{ display: "block", fontWeight: "600", marginBottom: "6px" }}>
            Due Date
          </label>
          <input
            {...register("dueDate")}
            type="date"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: "16px",
          paddingTop: "20px",
          borderTop: "1px solid #ddd",
        }}>
          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              opacity: isSubmitting || mutation.isPending ? 0.7 : 1,
              transition: "background 0.3s",
            }}
          >
            {mutation.isPending ? "Creating..." : "Create Task"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: "#6b7280",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
