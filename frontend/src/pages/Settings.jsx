import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiBell, FiLock, FiMonitor, FiTrash2 } from "react-icons/fi";
import ThemeToggle from "../components/common/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { profileApi } from "../services/apiService";
import PageContainer from "../components/layout/PageContainer";

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900/30";

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 rounded-full transition ${
      checked ? "bg-blue-600" : "bg-gray-300 dark:bg-slate-700"
    }`}
    aria-pressed={checked}
  >
    <span
      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
        checked ? "left-6" : "left-1"
      }`}
    />
  </button>
);



function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [language, setLanguage] = useState("English");

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setStatus("");
    setError("");
  };

  const submitPassword = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSavingPassword(true);
    const response = await profileApi.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    setSavingPassword(false);

    if (!response.ok || !response.success) {
      setError(response.message || "Unable to change password.");
      return;
    }

    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setStatus("Password changed successfully.");
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "Delete your TutorNest account? This action cannot be undone."
    );

    if (!confirmed) return;

    const response = await profileApi.deleteAccount();

    if (!response.ok || !response.success) {
      setError(response.message || "Unable to delete account.");
      return;
    }

    logout();
    navigate("/signup", { replace: true });
  };

  return (
    <PageContainer className="bg-gray-50 dark:bg-slate-950 rounded-3xl p-0">
      <div className="mx-auto max-w-5xl">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Settings</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-950 dark:text-white">
            Account preferences
          </h1>
        </div>

        <div className="mt-6 grid gap-6">
          {(status || error) && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
                error
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-900/20 dark:text-emerald-300"
              }`}
            >
              {error || status}
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5 dark:border-slate-800">
              <FiLock className="text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="font-bold text-gray-950 dark:text-white">Account Settings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage sign-in and account security.
                </p>
              </div>
            </div>

            <form onSubmit={submitPassword} className="grid gap-4 p-6 md:grid-cols-3">
              <input
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current password"
                className={inputClass}
              />
              <input
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="New password"
                className={inputClass}
              />
              <input
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm password"
                className={inputClass}
              />
              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {savingPassword ? "Updating..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <FiMonitor className="text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="font-bold text-gray-950 dark:text-white">UI Settings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tune how TutorNest looks on this device.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-slate-800">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Dark / Light mode
                </span>
                <ThemeToggle />
              </div>
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Language
                </span>
                <select value={language} onChange={(event) => setLanguage(event.target.value)} className={inputClass}>
                  <option>English</option>
                  <option>Urdu</option>
                  <option>Arabic</option>
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <FiBell className="text-blue-600 dark:text-blue-400" />
              <div>
                <h2 className="font-bold text-gray-950 dark:text-white">Notification Settings</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose which updates should reach your inbox.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-slate-800">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Email notifications
                </span>
                <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-slate-800">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Job alerts
                </span>
                <Toggle checked={jobAlerts} onChange={setJobAlerts} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/60 dark:bg-red-900/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <FiAlertTriangle className="mt-1 text-red-600 dark:text-red-400" />
                <div>
                  <h2 className="font-bold text-red-800 dark:text-red-300">Danger Zone</h2>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300/80">
                    Delete account permanently from TutorNest.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={deleteAccount}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <FiTrash2 />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default Settings;
