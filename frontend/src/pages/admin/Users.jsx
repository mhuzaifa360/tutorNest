import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { adminApi } from "../../services/apiService";

const badge = (value) => (
  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold capitalize text-gray-700 dark:bg-slate-800 dark:text-gray-300">
    {value}
  </span>
);

function Users() {
  const [users, setUsers] = useState([]);
  const [blocked, setBlocked] = useState({});

  const load = () => adminApi.users().then((res) => res.ok && setUsers(res.data || []));

  useEffect(() => {
    load();
  }, []);

  const remove = async (user) => {
    if (!window.confirm(`Delete ${user.name || user.email}?`)) return;
    const res = await adminApi.deleteUser(user.role, user.id);
    if (res.ok) load();
  };

  const columns = [
    { key: "name", label: "Name", render: (row) => row.name || `${row.firstName || ""} ${row.lastName || ""}`.trim() || "-" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (row) => badge(row.role) },
    { key: "status", label: "Status", render: (row) => badge(blocked[`${row.role}-${row.id}`] ? "blocked" : row.status || "active") },
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const key = `${row.role}-${row.id}`;
        return (
          <div className="flex gap-2">
            <button onClick={() => setBlocked((prev) => ({ ...prev, [key]: !prev[key] }))} className="rounded-lg border px-3 py-1.5 text-xs font-semibold dark:border-slate-700">
              {blocked[key] ? "Unblock" : "Block"}
            </button>
            <button onClick={() => remove(row)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Users Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">View, block, unblock, and delete platform accounts.</p>
      </div>
      <DataTable columns={columns} rows={users} />
    </div>
  );
}

export default Users;
