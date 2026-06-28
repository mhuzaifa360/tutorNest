import { useEffect, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { adminApi } from "../../services/apiService";
import { getToken } from "../../services/authService";

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
  const [documentModal, setDocumentModal] = useState({ open: false, teacher: null, documents: [] });
  const [documentMessage, setDocumentMessage] = useState("");
  const load = () => adminApi.teachers().then((res) => res.ok && setTeachers(res.data || []));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    const res = await adminApi.setTeacherStatus(id, status);
    if (res.ok) load();
  };

  const showDocuments = async (teacher) => {
    setDocumentMessage("");
    const res = await adminApi.teacherDocuments(teacher.id);
    if (res.ok) {
      setDocumentModal({
        open: true,
        teacher,
        documents: res.data?.documents || [],
      });
    } else {
      setDocumentMessage(res.message || "Unable to load teacher documents.");
    }
  };

  const openDocument = async (document, download = false) => {
    const token = getToken();
    const response = await fetch(`http://localhost:5000/v1/upload/files/${document.id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      setDocumentMessage("Unable to open this document.");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    if (download) {
      const link = window.document.createElement("a");
      link.href = url;
      link.download = document.originalName || "teacher-document";
      link.click();
      URL.revokeObjectURL(url);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    }
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
          <button onClick={() => showDocuments(row)} className="rounded-lg border px-3 py-1.5 text-xs font-semibold dark:border-slate-700">Documents</button>
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
      {documentMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300">
          {documentMessage}
        </div>
      )}
      <DataTable columns={columns} rows={teachers} />
      {documentModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white">Teacher Documents</h3>
                <p className="text-sm text-gray-500">
                  {documentModal.teacher?.name || "Teacher"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDocumentModal({ open: false, teacher: null, documents: [] })}
                className="rounded-lg border px-3 py-1.5 text-sm font-semibold dark:border-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {documentModal.documents.length ? (
                documentModal.documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-950 dark:text-white">
                        {document.originalName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {document.mimeType} - {Math.max(1, Math.round((document.size || 0) / 1024))} KB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openDocument(document)}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => openDocument(document, true)}
                        className="rounded-lg border px-3 py-1.5 text-xs font-semibold dark:border-slate-700"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500 dark:border-slate-700">
                  No verification documents uploaded for this teacher.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teachers;
