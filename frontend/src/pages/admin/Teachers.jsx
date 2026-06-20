import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { adminApi } from "../../services/apiService";

const statusBadge = (status) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
    status === "approved"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      : status === "rejected"
        ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
        : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
  }`}>
    {status || "pending"}
  </span>
);

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const load = () => adminApi.teachers().then((res) => res.ok && setTeachers(res.data || []));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    const res = await adminApi.setTeacherStatus(id, status);
    if (res.ok) load();
  };

  const columns = [
    { key: "name", label: "Teacher" },
    { key: "email", label: "Email" },
    { key: "qualification", label: "Qualification" },
    { key: "experience", label: "Experience", render: (row) => `${row.experience || 0} yrs` },
    { key: "status", label: "Status", render: (row) => statusBadge(row.status) },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setStatus(row.id, "approved")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">Approve</button>
          <button onClick={() => setStatus(row.id, "rejected")} className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white">Reject</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Teacher Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Approve teachers, reject profiles, and verify educator data.</p>
      </div>
      <DataTable columns={columns} rows={teachers} />
    </div>
  );
}

export default Teachers;
