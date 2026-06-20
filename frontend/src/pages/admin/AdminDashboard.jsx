import { useEffect, useState } from "react";
import {
  FiBookOpen,
  FiBriefcase,
  FiFileText,
  FiTrendingUp,
  FiUsers,
  FiUserCheck,
} from "react-icons/fi";
import StatsCard from "../../components/admin/StatsCard";
import { adminApi } from "../../services/apiService";

const MiniChart = ({ title, values = [], tone = "bg-blue-600" }) => {
  const max = Math.max(...values, 1);
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-bold text-gray-950 dark:text-white">{title}</h3>
        <FiTrendingUp className="text-gray-400" />
      </div>
      <div className="flex h-36 items-end gap-3">
        {values.map((value, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={`w-full rounded-t-lg ${tone} transition-all`}
              style={{ height: `${Math.max((value / max) * 100, 8)}%` }}
            />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    adminApi.overview().then((response) => {
      if (active && response.ok) {
        setOverview(response.data);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const stats = overview?.stats || {};
  const charts = overview?.charts || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Overview</p>
          <h2 className="mt-1 text-3xl font-bold text-gray-950 dark:text-white">Admin Dashboard</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Monitor users, marketplace activity, courses, jobs, and moderation queues.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatsCard title="Total Users" value={loading ? "..." : stats.totalUsers || 0} icon={<FiUsers />} tone="blue" />
        <StatsCard title="Students" value={loading ? "..." : stats.students || 0} icon={<FiUserCheck />} tone="emerald" />
        <StatsCard title="Teachers" value={loading ? "..." : stats.teachers || 0} icon={<FiUsers />} tone="violet" />
        <StatsCard title="Courses" value={loading ? "..." : stats.courses || 0} icon={<FiBookOpen />} tone="amber" />
        <StatsCard title="Jobs" value={loading ? "..." : stats.jobs || 0} icon={<FiBriefcase />} tone="rose" />
        <StatsCard title="Applications" value={loading ? "..." : stats.applications || 0} icon={<FiFileText />} tone="slate" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <MiniChart title="User Growth" values={charts.userGrowth || [0, 0, 0]} tone="bg-blue-600" />
        <MiniChart title="Jobs Posted" values={charts.jobsPosted || [0, 0, 0]} tone="bg-emerald-600" />
        <MiniChart title="Course Enrollments" values={charts.courseEnrollments || [0, 0, 0]} tone="bg-violet-600" />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-bold text-gray-950 dark:text-white">Notifications</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(overview?.notifications || []).map((item) => (
            <div key={item.id} className="rounded-lg bg-gray-50 p-4 dark:bg-slate-800">
              <p className="font-semibold text-gray-950 dark:text-white">{item.title}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
