import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { adminApi } from "../../services/apiService";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [approved, setApproved] = useState({});

  const load = () => adminApi.reviews().then((res) => res.ok && setReviews(res.data || []));

  useEffect(() => {
    load();
  }, []);

  const remove = async (row) => {
    if (!window.confirm("Delete this review?")) return;
    const res = await adminApi.deleteReview(row.id);
    if (res.ok) load();
  };

  const columns = [
    { key: "rating", label: "Rating", render: (row) => `${row.rating}/5` },
    { key: "comment", label: "Comment", render: (row) => <span className="inline-block max-w-md truncate">{row.comment}</span> },
    { key: "studentId", label: "Student ID" },
    { key: "teacherId", label: "Teacher ID" },
    { key: "status", label: "Status", render: (row) => approved[row.id] === false ? "rejected" : "approved" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button onClick={() => setApproved((prev) => ({ ...prev, [row.id]: true }))} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">Approve</button>
          <button onClick={() => setApproved((prev) => ({ ...prev, [row.id]: false }))} className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white">Reject</button>
          <button onClick={() => remove(row)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-950 dark:text-white">Review Moderation</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Approve, reject, or delete abusive reviews.</p>
      </div>
      <DataTable columns={columns} rows={reviews} />
    </div>
  );
}

export default Reviews;
