import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { adminApi } from "../../services/apiService";

function Applications() {
  const [applications, setApplications] = useState([]);
  const load = () => adminApi.applications().then((res) => res.ok && setApplications(res.data || []));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    const res = await adminApi.updateApplication(id, status);
    if (res.ok) load();
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "jobId", label: "Job ID" },
    { key: "tutorId", label: "Tutor ID" },
    { key: "message", label: "Message", render: (row) => <span className="inline-block max-w-xs truncate">{row.message}</span> },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => setStatus(row.id, "accepted")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">Approve</button>
          <button onClick={() => setStatus(row.id, "rejected")} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Reject</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Application Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track job applications and moderation status.</p>
      </div>
      <DataTable columns={columns} rows={applications} />
    </div>
  );
}

export default Applications;
