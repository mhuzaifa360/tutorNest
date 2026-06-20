import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { adminApi } from "../../services/apiService";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [featured, setFeatured] = useState({});

  const load = () => adminApi.jobs().then((res) => res.ok && setJobs(res.data || []));

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (row, status) => {
    const res = await adminApi.updateJob(row.id, { status });
    if (res.ok) load();
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete job "${row.title}"?`)) return;
    const res = await adminApi.deleteJob(row.id);
    if (res.ok) load();
  };

  const columns = [
    { key: "title", label: "Job" },
    { key: "subject", label: "Subject" },
    { key: "budget", label: "Budget", render: (row) => `PKR ${row.budget || 0}` },
    { key: "mode", label: "Mode" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => updateStatus(row, "open")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">Approve</button>
          <button onClick={() => setFeatured((prev) => ({ ...prev, [row.id]: !prev[row.id] }))} className="rounded-lg border px-3 py-1.5 text-xs font-semibold dark:border-slate-700">{featured[row.id] ? "Unfeature" : "Feature"}</button>
          <button onClick={() => remove(row)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Job Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Approve, feature, and remove job posts.</p>
      </div>
      <DataTable columns={columns} rows={jobs} />
    </div>
  );
}

export default Jobs;
