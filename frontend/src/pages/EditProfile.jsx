import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiSave } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { profileApi } from "../services/apiService";

const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
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

const toSubjectText = (subjects) => {
  if (!subjects) return "";
  if (Array.isArray(subjects)) return subjects.join(", ");
  return String(subjects);
};

const splitSubjects = (subjects) =>
  subjects
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const fieldClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900/30";

const labelClass = "text-sm font-semibold text-gray-800 dark:text-gray-200";

function EditProfile() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const initialForm = useMemo(
    () => ({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      mobile: user?.mobile || "",
      city: user?.city || "",
      province: user?.province || "",
      qualification: user?.qualification || "",
      experience: user?.experience || "",
      subjects: toSubjectText(user?.subjects),
      hourlyFee: user?.hourlyFee || "",
      bio: user?.bio || "",
      classLevel: Array.isArray(user?.classLevel)
        ? user.classLevel.join(", ")
        : user?.classLevel || "",
    }),
    [user]
  );

  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
  };

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      return "First name and last name are required.";
    }
    if (!form.mobile.trim()) {
      return "Mobile number is required.";
    }
    if (!form.city.trim() || !form.province.trim()) {
      return "City and province are required.";
    }
    if ((user?.role === "student" || user?.role === "teacher") && !form.subjects.trim()) {
      return "Add at least one subject.";
    }
    if (user?.role === "teacher" && (!form.qualification.trim() || form.experience === "")) {
      return "Qualification and experience are required for teachers.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      mobile: form.mobile.trim(),
      city: form.city.trim(),
      province: form.province,
    };

    if (user?.role === "student") {
      payload.classLevel = form.classLevel;
      payload.subjects = splitSubjects(form.subjects);
    }

    if (user?.role === "teacher") {
      payload.qualification = form.qualification.trim();
      payload.experience = Number(form.experience) || 0;
      payload.subjects = splitSubjects(form.subjects);
      payload.hourlyFee = Number(form.hourlyFee) || 0;
      payload.bio = form.bio.trim();
    }

    const previousUser = user;
    const optimisticUser = { ...user, ...payload };

    try {
      setSaving(true);
      updateUser(optimisticUser);

      const response = await profileApi.update(payload);
    const profileUser = response.user || response.data?.user || response.data || null;

      if (!response.ok || !response.success) {
        updateUser(previousUser);
        setError(response.message || "Unable to update profile.");
        return;
      }

      updateUser(profileUser || optimisticUser);
      setMessage("Profile updated successfully.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          <FiArrowLeft />
          Back to profile
        </Link>

        <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-gray-200 px-6 py-5 dark:border-slate-800">
            <h1 className="text-2xl font-bold text-gray-950 dark:text-white">
              Edit profile
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Keep your TutorNest profile accurate for students, teachers, and admin workflows.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 p-6">
            {message && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300">
                <FiCheckCircle />
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className={labelClass}>First Name</span>
                <input name="firstName" value={form.firstName} onChange={handleChange} className={fieldClass} />
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>Last Name</span>
                <input name="lastName" value={form.lastName} onChange={handleChange} className={fieldClass} />
              </label>
            </div>

            <label className="grid gap-2">
              <span className={labelClass}>Email</span>
              <input value={form.email} readOnly className={`${fieldClass} cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-slate-800`} />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2">
                <span className={labelClass}>Mobile</span>
                <input name="mobile" value={form.mobile} onChange={handleChange} className={fieldClass} />
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>City</span>
                <input name="city" value={form.city} onChange={handleChange} className={fieldClass} />
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>Province</span>
                <select name="province" value={form.province} onChange={handleChange} className={fieldClass}>
                  <option value="">Select province</option>
                  {PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {user?.role === "student" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className={labelClass}>Class Level</span>
                  <select name="classLevel" value={form.classLevel} onChange={handleChange} className={fieldClass}>
                    <option value="">Select class level</option>
                    {CLASS_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className={labelClass}>Subjects</span>
                  <input name="subjects" value={form.subjects} onChange={handleChange} className={fieldClass} placeholder="Mathematics, Physics" />
                </label>
              </div>
            )}

            {user?.role === "teacher" && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="grid gap-2">
                    <span className={labelClass}>Qualification</span>
                    <input name="qualification" value={form.qualification} onChange={handleChange} className={fieldClass} />
                  </label>
                  <label className="grid gap-2">
                    <span className={labelClass}>Experience</span>
                    <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} className={fieldClass} />
                  </label>
                  <label className="grid gap-2">
                    <span className={labelClass}>Hourly Fee</span>
                    <input name="hourlyFee" type="number" min="0" value={form.hourlyFee} onChange={handleChange} className={fieldClass} />
                  </label>
                </div>
                <label className="grid gap-2">
                  <span className={labelClass}>Subjects</span>
                  <input name="subjects" value={form.subjects} onChange={handleChange} className={fieldClass} placeholder="Mathematics, Physics" />
                </label>
                <label className="grid gap-2">
                  <span className={labelClass}>Bio</span>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900/30"
                  />
                </label>
              </>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSave />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default EditProfile;
