import { useEffect, useState } from "react";
import StatsCard from "../../components/admin/StatsCard";
import { FiActivity, FiBookOpen, FiBriefcase, FiStar } from "react-icons/fi";
import { adminApi } from "../../services/apiService";

function Reports() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    adminApi.overview().then((res) => {
      if (res.ok) setStats(res.data?.stats || {});
    });
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Reports</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Operational snapshot for marketplace health.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Pending Teachers" value={stats.pendingTeachers || 0} icon={<FiActivity />} tone="amber" />
        <StatsCard title="Courses" value={stats.courses || 0} icon={<FiBookOpen />} tone="blue" />
        <StatsCard title="Jobs" value={stats.jobs || 0} icon={<FiBriefcase />} tone="emerald" />
        <StatsCard title="Reviews" value={stats.reviews || 0} icon={<FiStar />} tone="violet" />
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-bold text-gray-950 dark:text-white">System Configuration</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Reporting is connected to live Sequelize counts. Persistent export scheduling can be added without changing the admin page contracts.
        </p>
      </div>
    </div>
  );
}

export default Reports;
