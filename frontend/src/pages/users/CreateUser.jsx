// src/pages/users/CreateUser.jsx
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function CreateUser() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to create user");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Create New User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input {...register("name", { required: "Name is required" })} className="input" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input {...register("email", { required: "Email is required" })} type="email" className="input" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 chars" } })} type="password" className="input" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Role</label>
          <select {...register("role")} className="input">
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
          <button type="button" onClick={() => navigate("/users")} className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}