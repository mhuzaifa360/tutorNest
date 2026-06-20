import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { adminApi } from "../../services/apiService";

function Students() {
  const [students, setStudents] = useState([]);
  const [blocked, setBlocked] = useState({});

  const load = () => adminApi.students().then((res) => res.ok && setStudents(res.data || []));

  useEffect(() => {
    load();
  }, []);

  const remove = async (row) => {
    if (!window.confirm(`Delete ${row.name}?`)) return;
    const res = await adminApi.deleteUser("student", row.id);
    if (res.ok) load();
  };

  const columns = [
    { key: "name", label: "Student" },
    { key: "email", label: "Email" },
    { key: "classLevel", label: "Class" },
    { key: "city", label: "City" },
    { key: "status", label: "Status", render: (row) => blocked[row.id] ? "blocked" : "active" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => setBlocked((prev) => ({ ...prev, [row.id]: !prev[row.id] }))} className="rounded-lg border px-3 py-1.5 text-xs font-semibold dark:border-slate-700">{blocked[row.id] ? "Unblock" : "Block"}</button>
          <button onClick={() => remove(row)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Student Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Review students, activity, and account access.</p>
      </div>
      <DataTable columns={columns} rows={students} />
    </div>
  );
}

export default Students;
