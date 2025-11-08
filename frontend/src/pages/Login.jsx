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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          transition: "all 0.3s ease",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#333",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Welcome Back 👋
        </h2>
        <p
          style={{
            fontSize: "14px",
            textAlign: "center",
            color: "#666",
            marginBottom: "20px",
          }}
        >
          Please login to your account
        </p>

        {/* Email */}
        <input
          {...register("email", { required: true })}
          placeholder="Email"
          type="email"
          style={{
            padding: "12px 16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "16px",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#667eea")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />

        {/* Password */}
        <input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
          style={{
            padding: "12px 16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "16px",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#667eea")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "12px 16px",
            background: isSubmitting
              ? "linear-gradient(135deg, #a5b4fc, #c4b5fd)"
              : "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            boxShadow: "0 5px 15px rgba(102, 126, 234, 0.4)",
          }}
          onMouseOver={(e) => {
            if (!isSubmitting) e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {/* Footer text */}
        <p
          style={{
            fontSize: "14px",
            color: "#555",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Don’t have an account?{" "}
          <span
            style={{
              color: "#667eea",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
