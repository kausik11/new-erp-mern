// // src/pages/users/CreateUser.jsx
// import { useForm } from "react-hook-form";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import api from "../../lib/api";

// export default function CreateUser() {
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   const mutation = useMutation({
//     mutationFn: (data) => api.post("/users", data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//       navigate("/users");
//     },
//     onError: (err) => {
//       alert(err.response?.data?.message || "Failed to create user");
//     },
//   });

//   const onSubmit = (data) => {
//     mutation.mutate(data);
//   };

//   return (
//     <div className="max-w-md mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-8">Create New User</h1>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
//         <div>
//           <label className="block text-sm font-medium mb-2">Full Name</label>
//           <input {...register("name", { required: "Name is required" })} className="input" />
//           {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Email</label>
//           <input {...register("email", { required: "Email is required" })} type="email" className="input" />
//           {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Password</label>
//           <input {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 chars" } })} type="password" className="input" />
//           {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">Role</label>
//           <select {...register("role")} className="input">
//             <option value="Employee">Employee</option>
//             <option value="Manager">Manager</option>
//             <option value="Admin">Admin</option>
//           </select>
//         </div>

//         <div className="flex gap-4">
//           <button type="submit" disabled={isSubmitting} className="btn-primary">
//             {isSubmitting ? "Creating..." : "Create User"}
//           </button>
//           <button type="button" onClick={() => navigate("/users")} className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg">
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

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

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    marginBottom: "6px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "6px",
  };

  const errorStyle = {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "2px",
  };

  const buttonPrimary = {
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    fontWeight: "700",
    padding: "10px 24px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const buttonCancel = {
    background: "#6b7280",
    color: "white",
    fontWeight: "600",
    padding: "10px 24px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "20px",
      background: "linear-gradient(to bottom right, #eef2ff, #e0e7ff)",
    }}>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e3a8a", marginBottom: "24px" }}>
          Create New User
        </h1>

        {/* Full Name */}
        <div>
          <label style={labelStyle}>Full Name</label>
          <input {...register("name", { required: "Name is required" })} style={inputStyle} />
          {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email</label>
          <input {...register("email", { required: "Email is required" })} type="email" style={inputStyle} />
          {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}>Password</label>
          <input 
            {...register("password", { 
              required: "Password is required", 
              minLength: { value: 6, message: "Min 6 chars" } 
            })} 
            type="password" 
            style={inputStyle} 
          />
          {errors.password && <p style={errorStyle}>{errors.password.message}</p>}
        </div>

        {/* Role */}
        <div>
          <label style={labelStyle}>Role</label>
          <select {...register("role")} style={inputStyle}>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            style={buttonPrimary}
            onMouseOver={(e) => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 6px 16px rgba(79,70,229,0.4)"; }}
            onMouseOut={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 4px 12px rgba(79,70,229,0.3)"; }}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
          <button 
            type="button" 
            onClick={() => navigate("/users")} 
            style={buttonCancel}
            onMouseOver={(e) => e.target.style.background = "#4b5563"}
            onMouseOut={(e) => e.target.style.background = "#6b7280"}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
