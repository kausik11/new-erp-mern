// src/pages/tasks/CreateTask.jsx
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

  // Fetch users for assignment dropdown
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users").then(res => res.data),
  });

  const mutation = useMutation({
    mutationFn: (taskData) => api.post(`/projects/${projectId}/tasks`, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      navigate(`/projects/${projectId}`);
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to create task");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Task</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Adding task to project ID: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{projectId}</code>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Task Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            className="input w-full"
            placeholder="e.g. Design homepage mockup"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register("description")}
            rows="4"
            className="input w-full"
            placeholder="Optional details about the task..."
          />
        </div>

        {/* Assign To */}
        <div>
          <label className="block text-sm font-medium mb-2">Assign To</label>
          <select
            {...register("assignedTo")}
            className="input w-full"
            defaultValue=""
          >
            <option value="" disabled>
              {usersLoading ? "Loading users..." : "Select a team member"}
            </option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email}) - {u.role}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select {...register("status")} className="input w-full">
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-2">Priority</label>
          <select {...register("priority")} className="input w-full">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Due Date (optional)</label>
          <input
            {...register("dueDate")}
            type="date"
            className="input w-full"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className="btn-primary flex items-center gap-2"
          >
            {isSubmitting || mutation.isPending ? "Creating..." : "Create Task"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}