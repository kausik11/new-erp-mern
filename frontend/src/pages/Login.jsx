import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <input {...register("email", { required: true })} placeholder="Email" className="input mb-4" />
        <input {...register("password", { required: true })} type="password" placeholder="Password" className="input mb-4" />
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}