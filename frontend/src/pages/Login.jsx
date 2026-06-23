import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

import Btn from "../components/common/Btn";
import Typography from "../components/common/Typography";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/apiService";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await authApi.login(role, {
        email: form.email,
        password: form.password,
      });

      if (!res.ok || !res.success) {
        setError(res.message || "Login Failed");
        return;
      }

      if (!res.token || !res.user) {
        setError("Invalid response from server");
        return;
      }

      login(res.user, res.token);

      // Redirect by Role
      const userRole = res.user.role?.toLowerCase();
      switch (userRole) {
        case "student":
          navigate("/student");
          break;
        case "teacher":
          navigate("/teacher");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex-1 flex items-center justify-center px-4 py-24 min-h-screen bg-lightGreyBG dark:bg-slate-950 transition-all duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 flex flex-col gap-6 border border-gray-100 dark:border-slate-800">

        {/* TOP */}
        <div className="flex flex-col gap-2 text-center">
          <Typography
            variant="h2"
            className="font-extrabold text-2xl text-textBlack dark:text-white"
          >
            Welcome to TutorNest
          </Typography>

          <Typography
            variant="h6"
            className="text-textGrey dark:text-gray-400"
          >
            Find the perfect tutor, explore courses, and grow your learning journey.
          </Typography>
        </div>

        {/* ROLE */}
        <div className="flex flex-col gap-3">
          <Typography
            variant="h6"
            className="font-semibold text-textBlack dark:text-white"
          >
            I am a
          </Typography>

          <div className="flex items-center gap-3">
            <Btn
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 h-12 rounded-xl border transition-all duration-300 font-semibold ${
                role === "student"
                  ? "!bg-primary !text-white border-primary"
                  : "!bg-white dark:!bg-slate-800 !text-primary border-gray-300"
              }`}
            >
              Student
            </Btn>

            <Btn
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 h-12 rounded-xl border transition-all duration-300 font-semibold ${
                role === "teacher"
                  ? "!bg-primary !text-white border-primary"
                  : "!bg-white dark:!bg-slate-800 !text-primary border-gray-300"
              }`}
            >
              Teacher
            </Btn>

            <Btn
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 h-12 rounded-xl border transition-all duration-300 font-semibold ${
                role === "admin"
                  ? "!bg-primary !text-white border-primary"
                  : "!bg-white dark:!bg-slate-800 !text-primary border-gray-300"
              }`}
            >
              Admin
            </Btn>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <Typography
              variant="h6"
              className="font-medium text-textBlack dark:text-white"
            >
              Email
            </Typography>

            <input
              type="email"
              name="email"
              id="login-email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-textBlack dark:text-white outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <Typography
              variant="h6"
              className="font-medium text-textBlack dark:text-white"
            >
              Password
            </Typography>

            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="login-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-textBlack dark:text-white outline-none focus:border-primary transition-colors"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-xl text-gray-500"
              >
                {showPassword ? (
                  <IoEyeOffOutline />
                ) : (
                  <IoEyeOutline />
                )}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <Btn
            type="submit"
            variant="blue"
            className="w-full h-12"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Btn>
        </form>

        {/* FOOTER */}
        <div className="text-center">
          <Typography
            variant="h6"
            className="text-textGrey dark:text-gray-400"
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </Typography>
        </div>
      </div>
    </section>
  );
};

export default Login;
