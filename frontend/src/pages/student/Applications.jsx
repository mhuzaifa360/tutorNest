/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiMessageSquare, FiStar, FiUser, FiX } from "react-icons/fi";
import { studentApi } from "../../services/apiService";
import PageContainer from "../../components/layout/PageContainer";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";

const initials = (teacher) =>
  `${teacher?.firstName?.[0] || ""}${teacher?.lastName?.[0] || ""}`.toUpperCase() || "T";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await studentApi.applications();
    if (res.ok) {
      setApplications(res.data || []);
      setError("");
    } else {
      setError(res.message || "Unable to load applications.");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, status) => {
    setUpdatingId(id);
    const res = await studentApi.updateApplication(id, status);
    setUpdatingId(null);
    if (res.ok) {
      setNotice(status === "accepted" ? "Application accepted. Chat is now available." : "Application rejected.");
      await load();
    } else {
      setNotice(res.message || "Unable to update application.");
    }
  };

  return (
    <PageContainer className="animate-fade-in space-y-5">
      <PageHeader title="Applications" description="Review teacher applications received on your tuition jobs." />

      {notice ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          {notice}
        </div>
      ) : null}

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : applications.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {applications.map((app) => {
            const teacher = app.tutor || {};
            const accepted = app.status === "accepted";
            const pending = app.status === "pending";
            return (
              <Card key={app.id} className="space-y-4">
                <div className="flex items-start gap-4">
                  {teacher.profileImage ? (
                    <img
                      src={teacher.profileImage}
                      alt={`${teacher.firstName || "Teacher"} profile`}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                      {initials(teacher)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-950 dark:text-white">
                      {teacher.firstName ? `${teacher.firstName} ${teacher.lastName || ""}` : "Teacher"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {teacher.qualification || "Qualification not set"} - {teacher.experience || 0} yrs
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-amber-600 dark:text-amber-300">
                      <FiStar /> {teacher.rating || 0} ({teacher.reviewsCount || 0} reviews)
                    </p>
                  </div>
                  <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700 dark:bg-slate-800 dark:text-gray-200">
                    {app.status}
                  </span>
                </div>

                <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                  <span>Job: {app.job?.title || `Job #${app.jobId}`}</span>
                  <span>Subject: {app.job?.subject || "Not set"}</span>
                  <span>Expected fee: PKR {Number(app.expectedFee || teacher.hourlyFee || 0).toLocaleString()}</span>
                  <span>Applied: {formatDate(app.createdAt)}</span>
                </div>

                <p className="rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-700 dark:bg-slate-950 dark:text-gray-300">
                  {app.coverLetter || app.message || "No cover letter provided."}
                </p>

                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-slate-800">
                  <Link
                    to={`/student/tutors/${teacher.id}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 dark:border-slate-700 dark:text-gray-200"
                  >
                    <FiUser /> View Profile
                  </Link>
                  {accepted ? (
                    <Link
                      to="/student/messages"
                      className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-3 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
                    >
                      <FiMessageSquare /> Message
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    disabled={!pending || updatingId === app.id}
                    onClick={() => update(app.id, "accepted")}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiCheck /> Accept
                  </button>
                  <button
                    type="button"
                    disabled={!pending || updatingId === app.id}
                    onClick={() => update(app.id, "rejected")}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiX /> Reject
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No applications yet" description="Applications will appear after teachers apply to your jobs." />
      )}
    </PageContainer>
  );
}

export default Applications;
