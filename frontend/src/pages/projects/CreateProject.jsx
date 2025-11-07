import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const { register, handleSubmit } = useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/projects", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate("/projects");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input {...register("name", { required: true })} placeholder="Project Name" className="input" />
        <input {...register("client")} placeholder="Client ID" className="input" />
        <textarea {...register("description")} placeholder="Description" className="input h-32" />
        <select {...register("status")} className="input">
          <option value="planning">Planning</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" className="btn-primary">
          {mutation.isPending ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}