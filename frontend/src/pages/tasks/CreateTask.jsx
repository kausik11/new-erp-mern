// // src/pages/tasks/CreateTask.jsx
// import { useForm } from "react-hook-form";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../../lib/api";
// import { useAuth } from "../../context/AuthContext";

// export default function CreateTask() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { user } = useAuth();

//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

//   // FIXED: Fetch actual USERS, not clients
//   const { data: users = [], isLoading: usersLoading } = useQuery({
//     queryKey: ["users"],
//     queryFn: async () => {
//       const res = await api.get("/users"); // or "/users?role=team" if filtered
//       return res.data.data || res.data; // adjust based on your API response structure
//     },
//   });

//   const mutation = useMutation({
//     mutationFn: (taskData) => api.post(`/projects/${projectId}/tasks`, taskData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
//       queryClient.invalidateQueries({ queryKey: ["project", projectId] });
//       navigate(`/projects/${projectId}`);
//     },
//     onError: (error) => {
//       console.error("Create task error:", error);
//       alert(error.response?.data?.message || "Failed to create task");
//     },
//   });

//   // const onSubmit = (data) => {
//   //   // CRITICAL FIX: Map frontend values to exact backend enum strings
//   //   const formattedData = {
//   //     ...data,
//   //     assignedTo: data.assignedTo || null,
//   //     dueDate: data.dueDate || null,
//   //     // Status mapping
//   //     status:
//   //       data.status === "todo" ? "To Do" :
//   //       data.status === "in-progress" ? "In Progress" :
//   //       data.status === "review" ? "Review" :
//   //       data.status === "done" ? "Done" :
//   //       "To Do",
//   //     // Priority mapping - MATCH YOUR BACKEND EXACTLY
//   //     priority:
//   //       data.priority === "low" ? "Low" :
//   //       data.priority === "medium" ? "Medium" :
//   //       data.priority === "high" ? "High" :
//   //       data.priority === "urgent" ? "Critical" : // <-- This is the key!
//   //       "Medium",
//   //   };

//   //   console.log("Submitting task:", formattedData); // Debug
//   //   mutation.mutate(formattedData);
//   // };
// const onSubmit = (data) => {
//   // FIX: Convert "2025-11-07" → "2025-11-07T00:00:00.000Z"
//   const formattedDueDate = data.dueDate 
//     ? new Date(data.dueDate + "T00:00:00.000Z").toISOString()
//     : null;

//   const formattedData = {
//     ...data,
//     assignedTo: data.assignedTo || null,
//     dueDate: formattedDueDate,
//     status:
//       data.status === "todo" ? "To Do" :
//       data.status === "in-progress" ? "In Progress" :
//       data.status === "review" ? "Review" :
//       data.status === "done" ? "Done" :
//       "To Do",
//     priority:
//       data.priority === "low" ? "Low" :
//       data.priority === "medium" ? "Medium" :
//       data.priority === "high" ? "High" :
//       data.priority === "urgent" ? "Critical" :
//       "Medium",
//   };

//   console.log("Final payload →", formattedData); // Debug: should show full ISO date
//   mutation.mutate(formattedData);
// };
//   return (
//     <div className="max-w-2xl mx-auto p-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold">Create New Task</h1>
//         <p className="text-gray-600 dark:text-gray-400 mt-2">
//           Project ID: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{projectId}</code>
//         </p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
//         {/* Title */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Task Title <span className="text-red-500">*</span></label>
//           <input
//             {...register("title", { required: "Title is required" })}
//             className="input w-full"
//             placeholder="Enter task title"
//           />
//           {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Description</label>
//           <textarea
//             {...register("description")}
//             rows="4"
//             className="input w-full resize-none"
//             placeholder="Optional description..."
//           />
//         </div>

//         {/* Assign To */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Assign To</label>
//           <select {...register("assignedTo")} className="input w-full" defaultValue="">
//             <option value="" disabled>{usersLoading ? "Loading..." : "Select member"}</option>
//             <option value="">Unassigned</option>
//             {Array.isArray(users) && users.map((u) => (
//               <option key={u._id} value={u._id}>
//                 {u.name} ({u.role}) - {u.email}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Status</label>
//           <select {...register("status")} className="input w-full" defaultValue="todo">
//             <option value="todo">To Do</option>
//             <option value="in-progress">In Progress</option>
//             <option value="review">Review</option>
//             <option value="done">Done</option>
//           </select>
//         </div>

//         {/* Priority - Critical fix here */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Priority</label>
//           <select {...register("priority")} className="input w-full" defaultValue="medium">
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//             <option value="urgent">Critical</option> {/* ← Matches backend "Critical" */}
//           </select>
//         </div>

//         {/* Due Date */}
//         <div>
//           <label className="block text-sm font-medium mb-2">Due Date</label>
//          <input
//   {...register("dueDate")}
//   type="date"
//   className="input w-full"
//   placeholder="Select due date"
// />
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-4 pt-6 border-t dark:border-gray-700">
//           <button
//             type="submit"
//             disabled={isSubmitting || mutation.isPending}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-70"
//           >
//             {mutation.isPending ? "Creating..." : "Create Task"}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>

//       {/* Debug */}
//       {/* {process.env.NODE_ENV === "development" && (
//         <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
//           <p className="text-sm font-medium mb-2">Debug Users:</p>
//           <pre className="text-xs overflow-auto">{JSON.stringify(users, null, 2)}</pre>
//         </div>
//       )} */}
//     </div>
//   );
// }
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
