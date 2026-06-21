import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

import Btn from "../components/common/Btn";
import Typography from "../components/common/Typography";
import { useAuth } from "../context/AuthContext";

// ==================
// CONSTANTS
// ==================

const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan",
];

const CLASS_LEVELS = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "O-Level",
  "A-Level",
  "Intermediate",
  "Bachelors",
  "Masters",
];

const SUBJECTS = [
  "Mathematics",
  "English",
  "Urdu",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Islamiat",
  "Pakistan Studies",
  "General Science",
  "Accounting",
  "Economics",
  "Statistics",
  "Business Studies",
  "Physical Education",
  "Web Development",
  "Networking",
  "Database Management",
  "Software Engineering",
  "Machine Learning",
  "Artificial Intelligence",
  "Data Science",
  "Robotics",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Environmental Science",
  "Law",
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Other",
];

const QUALIFICATIONS = [
  "Matric",
  "Intermediate",
  "Bachelors",
  "Masters",
  "M.Phil",
  "PhD",
  "Other",
];

const TEACHING_MODES = [
  { value: "online", label: "Online" },
  { value: "home", label: "Home Tuition" },
  { value: "both", label: "Both" },
];

// ==================
// COMPONENT
// ==================

const Signup = () => {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
    province: "",
    city: "",
    classLevel: "",
    subjects: [],
    qualification: "",
    experience: "",
    teachingMode: "",
    hourlyFee: "",
    bio: "",
    cnic: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // Multi-select subjects handler
  const handleSubjectToggle = (subject) => {
    setForm((prev) => {
      const exists = prev.subjects.includes(subject);
      return {
        ...prev,
        subjects: exists
          ? prev.subjects.filter((s) => s !== subject)
          : [...prev.subjects, subject],
      };
    });
  };

  // CNIC formatter (auto-add dashes: 00000-0000000-0)
  const handleCnicChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // digits only
    if (value.length > 13) value = value.slice(0, 13);

    // Format: 00000-0000000-0
    let formatted = value;
    if (value.length > 5 && value.length <= 12) {
      formatted = value.slice(0, 5) + "-" + value.slice(5);
    } else if (value.length > 12) {
      formatted = value.slice(0, 5) + "-" + value.slice(5, 12) + "-" + value.slice(12);
    }

    setForm({ ...form, cnic: formatted });
    if (error) setError("");
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (form.subjects.length === 0) {
      setError("Please select at least one subject");
      return;
    }

    if (role === "teacher" && !form.cnic) {
      setError("CNIC is required for teachers");
      return;
    }

    const endpoint =
      role === "student"
        ? "http://localhost:5000/v1/auth/student/signup"
        : "http://localhost:5000/v1/auth/teacher/signup";

    const payload =
      role === "student"
        ? {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            mobile: form.mobile,
            gender: form.gender,
            province: form.province,
            city: form.city,
            classLevel: form.classLevel,
            subjects: form.subjects,
          }
        : {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
            mobile: form.mobile,
            gender: form.gender,
            province: form.province,
            city: form.city,
            qualification: form.qualification,
            experience: Number(form.experience),
            subjects: form.subjects,
            teachingMode: form.teachingMode,
            hourlyFee: Number(form.hourlyFee),
            bio: form.bio,
            cnic: form.cnic.replace(/-/g, ""), // send digits only
          };

    try {
      setLoading(true);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setError("Server returned an invalid response");
        return;
      }

      if (!res.ok || !data.success) {
        setError(data.message || "Signup failed");
        return;
      }

      if (!data.token || !data.user) {
        setError("Invalid response from server");
        return;
      }

      // Save auth
      login(data.user, data.token);

      // Redirect
      if (data.user.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==================
  // SHARED STYLES
  // ==================
  const inputClass =
    "w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-textBlack dark:text-white outline-none focus:border-primary transition-colors text-sm";

  const selectClass =
    "w-full h-12 px-4 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-textBlack dark:text-white outline-none focus:border-primary transition-colors text-sm appearance-none cursor-pointer";

  const labelClass = "text-sm font-medium text-textBlack dark:text-white";

  return (
    <section className="flex-1 flex items-center justify-center px-4 py-24 min-h-screen bg-lightGreyBG dark:bg-slate-950 transition-all duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 flex flex-col gap-6 border border-gray-100 dark:border-slate-800">

        {/* TITLE */}
        <div className="text-center flex flex-col gap-2">
          <Typography variant="h2" className="font-bold text-textBlack dark:text-white">
            Create Account
          </Typography>
          <Typography variant="h6" className="text-textGrey dark:text-gray-400">
            Join TutorNest as a Student or Teacher
          </Typography>
        </div>

        {/* ROLE SWITCH */}
        <div className="flex gap-3">
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
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* NAME ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>First Name *</label>
              <input
                name="firstName"
                id="signup-firstName"
                placeholder="Muhammad"
                value={form.firstName}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Last Name *</label>
              <input
                name="lastName"
                id="signup-lastName"
                placeholder="Ali"
                value={form.lastName}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Email *</label>
            <input
              name="email"
              id="signup-email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Password *</label>
            <div className="relative">
              <input
                name="password"
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                className={`${inputClass} pr-12`}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-xl text-gray-500 dark:text-gray-400"
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>

          {/* MOBILE */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Mobile Number *</label>
            <input
              name="mobile"
              id="signup-mobile"
              type="tel"
              placeholder="03001234567"
              value={form.mobile}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* GENDER + PROVINCE ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Gender *</label>
              <select
                name="gender"
                id="signup-gender"
                value={form.gender}
                onChange={handleChange}
                className={selectClass}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Province *</label>
              <select
                name="province"
                id="signup-province"
                value={form.province}
                onChange={handleChange}
                className={selectClass}
                required
              >
                <option value="">Select Province</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CITY */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>City *</label>
            <input
              name="city"
              id="signup-city"
              placeholder="Lahore"
              value={form.city}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* ===== STUDENT ONLY FIELDS ===== */}
          {role === "student" && (
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Class Level *</label>
              <select
                name="classLevel"
                id="signup-classLevel"
                value={form.classLevel}
                onChange={handleChange}
                className={selectClass}
                required
              >
                <option value="">Select Class Level</option>
                {CLASS_LEVELS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ===== TEACHER ONLY FIELDS ===== */}
          {role === "teacher" && (
            <>
              {/* QUALIFICATION + EXPERIENCE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Qualification *</label>
                  <select
                    name="qualification"
                    id="signup-qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    className={selectClass}
                    required
                  >
                    <option value="">Select Qualification</option>
                    {QUALIFICATIONS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Experience (years) *</label>
                  <input
                    name="experience"
                    id="signup-experience"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="e.g. 3"
                    value={form.experience}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* TEACHING MODE + HOURLY FEE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Teaching Mode *</label>
                  <select
                    name="teachingMode"
                    id="signup-teachingMode"
                    value={form.teachingMode}
                    onChange={handleChange}
                    className={selectClass}
                    required
                  >
                    <option value="">Select Mode</option>
                    {TEACHING_MODES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Hourly Fee (PKR) *</label>
                  <input
                    name="hourlyFee"
                    id="signup-hourlyFee"
                    type="number"
                    min="0"
                    placeholder="e.g. 1500"
                    value={form.hourlyFee}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* CNIC */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>CNIC *</label>
                <input
                  name="cnic"
                  id="signup-cnic"
                  placeholder="00000-0000000-0"
                  value={form.cnic}
                  onChange={handleCnicChange}
                  className={inputClass}
                  required
                  maxLength={15}
                />
                <span className="text-xs text-textGrey dark:text-gray-500">
                  Format: 00000-0000000-0
                </span>
              </div>

              {/* BIO */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Bio</label>
                <textarea
                  name="bio"
                  id="signup-bio"
                  placeholder="Tell students about yourself, your teaching style, and experience..."
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-textBlack dark:text-white outline-none focus:border-primary transition-colors text-sm resize-none"
                />
              </div>
            </>
          )}

          {/* SUBJECTS (multi-select chips) */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Subjects * <span className="text-textGrey font-normal">(select one or more)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((subject) => {
                const isSelected = form.subjects.includes(subject);
                return (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-slate-800 text-textBlack dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {subject}
                  </button>
                );
              })}
            </div>
            {form.subjects.length > 0 && (
              <p className="text-xs text-primary">
                Selected: {form.subjects.join(", ")}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <Btn
            type="submit"
            variant="blue"
            className="w-full h-12 mt-2"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Btn>
        </form>

        {/* LOGIN LINK */}
        <div className="text-center">
          <Typography variant="h6" className="text-textGrey dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>
          </Typography>
        </div>
      </div>
    </section>
  );
};

export default Signup;