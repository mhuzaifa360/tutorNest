import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { adminApi } from "../../services/apiService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [featured, setFeatured] = useState({});

  const load = () => adminApi.courses().then((res) => res.ok && setCourses(res.data || []));

  useEffect(() => {
    load();
  }, []);

  const remove = async (row) => {
    if (!window.confirm(`Delete course "${row.title}"?`)) return;
    const res = await adminApi.deleteCourse(row.id);
    if (res.ok) load();
  };

  const columns = [
    { key: "title", label: "Course" },
    { key: "teacher", label: "Teacher", render: (row) => row.teacher ? `${row.teacher.firstName} ${row.teacher.lastName}` : "-" },
    { key: "price", label: "Price", render: (row) => row.price ? `PKR ${row.price}` : "-" },
    { key: "status", label: "Status", render: () => "approved" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => setFeatured((prev) => ({ ...prev, [row.id]: !prev[row.id] }))} className="rounded-lg border px-3 py-1.5 text-xs font-semibold dark:border-slate-700">
            {featured[row.id] ? "Unfeature" : "Feature"}
          </button>
          <button onClick={() => remove(row)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Course Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">View, approve, feature, and remove courses.</p>
      </div>
      <DataTable columns={columns} rows={courses} />
    </div>
  );
}

export default Courses;
