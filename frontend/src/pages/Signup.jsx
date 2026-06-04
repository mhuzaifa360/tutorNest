import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

import Btn from "../components/common/Btn";
import Typography from "../components/common/Typography";
// import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ INPUT HANDLER (backend ready)
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: form.name,
      email: form.email,
      password: form.password,
      role,
    }),
  });

  const data = await res.json();

  if (!data.success) {
    alert(data.message);
    return;
  }

  // auto login after signup
  setToken(data.token);
  login(data.token);

  const userRole = data.user.role;

  if (userRole === "student") navigate("/student/dashboard");
  else navigate("/teacher/dashboard");
};

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6">

        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <Typography variant="h2" className="font-bold text-heading">
            Create Your Account
          </Typography>

          <Typography variant="body" className="text-muted">
            Join TutorNest and start learning
          </Typography>
        </div>

        {/* ROLE SELECT */}
        <div className="flex flex-col gap-3">
          <Typography variant="body" className="font-semibold text-heading">
            I want to join as
          </Typography>

          <div className="flex gap-3">
            <Btn
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 h-12 rounded-xl border ${
                role === "student"
                  ? "!bg-primary !text-white"
                  : "!bg-white !text-primary"
              }`}
            >
              Student
            </Btn>

            <Btn
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 h-12 rounded-xl border ${
                role === "teacher"
                  ? "!bg-primary !text-white"
                  : "!bg-white !text-primary"
              }`}
            >
              Teacher
            </Btn>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* NAME */}
          <div className="flex flex-col gap-2">
            <Typography variant="body" className="font-medium text-heading">
              Full Name
            </Typography>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full h-12 px-4 rounded-xl border border-border outline-none focus:border-primary"
              required
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <Typography variant="body" className="font-medium text-heading">
              Email
            </Typography>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full h-12 px-4 rounded-xl border border-border outline-none focus:border-primary"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <Typography variant="body" className="font-medium text-heading">
              Password
            </Typography>

            <div className="relative flex items-center">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-12 px-4 pr-12 rounded-xl border border-border outline-none focus:border-primary"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-xl text-muted"
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <Btn type="submit" className="w-full h-12" variant="blue">
            Create Account
          </Btn>
        </form>

        {/* FOOTER */}
        <div className="text-center">
          <Typography variant="body" className="text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Sign in
            </Link>
          </Typography>
        </div>

      </div>
    </div>
  );
};

export default Signup;