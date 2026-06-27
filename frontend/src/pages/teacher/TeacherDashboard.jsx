/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiFilter,
  FiMapPin,
  FiMessageSquare,
  FiSearch,
  FiSend,
  FiUsers,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { dashboardApi, teacherApi } from "../../services/apiService";
import PageContainer from "../../components/layout/PageContainer";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";

const Stat = ({ title, value, icon }) => (
  <Card>
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">{value}</p>
      </div>
      <div className="rounded-lg bg-emerald-50 p-3 text-xl text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
        {icon}
      </div>
    </div>
  </Card>
);

const initialFilters = {
  search: "",
  subject: "",
  province: "",
  city: "",
  mode: "",
  classLevel: "",
  minBudget: "",
  maxBudget: "",
};

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "New";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyJobId, setApplyJobId] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [expectedFee, setExpectedFee] = useState("");
  const [applying, setApplying] = useState(false);
  const [notice, setNotice] = useState("");

  const stats = dashboard?.stats || {};
  const activeJob = useMemo(() => jobs.find((job) => job.id === applyJobId), [jobs, applyJobId]);

  const loadDashboard = async () => {
    if (!user?.id) return;
    const res = await dashboardApi.teacher(user.id);
    if (res.ok) {
      setDashboard(res.data);
      setError("");
    } else {
      setError(res.message || "Unable to load teacher dashboard.");
    }
  };

  const loadJobs = async (page = 1) => {
    setJobsLoading(true);
    const res = await teacherApi.jobs({ ...filters, page, limit: 8, status: "open" });
    if (res.ok) {
      setJobs(Array.isArray(res.data) ? res.data : []);
      setMeta(res.meta || { page, totalPages: 1 });
    } else {
      setError(res.message || "Unable to load tuition jobs.");
    }
    setJobsLoading(false);
  };

  const load = async () => {
    setLoading(true);
    await Promise.all([loadDashboard(), loadJobs(1)]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  useEffect(() => {
    loadJobs(1);
  }, [filters]);

  const submitFilters = (event) => {
    event.preventDefault();
    setFilters(draftFilters);
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    if (!applyJobId || !coverLetter.trim()) {
      setNotice("Write a short cover letter before applying.");
      return;
    }

    setApplying(true);
    const res = await teacherApi.applyJob({
      jobId: applyJobId,
      coverLetter,
      expectedFee: expectedFee ? Number(expectedFee) : undefined,
    });
    setApplying(false);

    if (res.ok) {
      setNotice("Application submitted successfully.");
      setApplyJobId(null);
      setCoverLetter("");
      setExpectedFee("");
      await Promise.all([loadDashboard(), loadJobs(meta.page || 1)]);
    } else {
      setNotice(res.message || "Unable to submit application.");
    }
  };

  if (loading) return <LoadingState label="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <PageContainer className="animate-fade-in space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.firstName || "Teacher"}`}
        description="Browse active tuition jobs, apply with your expected fee, and continue chats after students accept."
        action={
          <Link
            to="/teacher/messages"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <FiMessageSquare /> Messages
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Available Jobs" value={stats.availableJobs || 0} icon={<FiBriefcase />} />
        <Stat title="Applied Jobs" value={stats.applications || 0} icon={<FiSend />} />
        <Stat title="Accepted Jobs" value={stats.acceptedJobs || stats.students || 0} icon={<FiUsers />} />
        <Stat title="Unread Messages" value={stats.unreadMessages || 0} icon={<FiMessageSquare />} />
      </div>

      <Card>
        <form onSubmit={submitFilters} className="grid gap-3 lg:grid-cols-8">
          <label className="relative lg:col-span-2">
            <FiSearch className="pointer-events-none absolute left-3 top-3 text-gray-400" />
            <input
              value={draftFilters.search}
              onChange={(event) => setDraftFilters({ ...draftFilters, search: event.target.value })}
              placeholder="Search jobs"
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          {[
            ["subject", "Subject"],
            ["province", "Province"],
            ["city", "City"],
            ["classLevel", "Class level"],
            ["minBudget", "Min fee"],
            ["maxBudget", "Max fee"],
          ].map(([name, label]) => (
            <input
              key={name}
              value={draftFilters[name]}
              onChange={(event) => setDraftFilters({ ...draftFilters, [name]: event.target.value })}
              placeholder={label}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          ))}
          <select
            value={draftFilters.mode}
            onChange={(event) => setDraftFilters({ ...draftFilters, mode: event.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="">Any mode</option>
            <option value="online">Online</option>
            <option value="home">Home</option>
            <option value="both">Both</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-slate-950"
          >
            <FiFilter /> Filter
          </button>
        </form>
      </Card>

      {notice ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          {notice}
        </div>
      ) : null}

      {jobsLoading ? (
        <LoadingState label="Loading active jobs..." />
      ) : jobs.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {jobs.map((job) => {
            const studentName = job.student
              ? `${job.student.firstName || ""} ${job.student.lastName || ""}`.trim()
              : "Student";
            return (
              <Card key={job.id} className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                      {job.subject}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-gray-950 dark:text-white">{job.title}</h2>
                    <p className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <FiMapPin /> {job.city || "City not set"}, {job.province || "Province not set"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-100 px-3 py-2 text-right dark:bg-slate-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                    <p className="font-bold text-gray-950 dark:text-white">
                      PKR {Number(job.budget || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {job.description}
                </p>

                <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                  <span>Student: {studentName}</span>
                  <span>Class: {job.classLevel || job.student?.classLevel || "Not specified"}</span>
                  <span>Mode: {job.mode || "home"}</span>
                  <span>Preferred gender: {job.preferredGender || "Any"}</span>
                  <span>Applications: {job.applicationCount || 0}</span>
                  <span>Posted: {formatDate(job.createdAt)}</span>
                </div>

                <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4 dark:border-slate-800">
                  <Link
                    to={`/teacher/jobs/${job.id}`}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:text-gray-200"
                  >
                    View Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setApplyJobId(job.id);
                      setNotice("");
                    }}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Apply Now
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No active jobs found" description="Try adjusting the filters or check again later." />
      )}

      {meta.totalPages > 1 ? (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={meta.page <= 1}
            onClick={() => loadJobs((meta.page || 1) - 1)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold disabled:opacity-50 dark:border-slate-700"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={meta.page >= meta.totalPages}
            onClick={() => loadJobs((meta.page || 1) + 1)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold disabled:opacity-50 dark:border-slate-700"
          >
            Next
          </button>
        </div>
      ) : null}

      {activeJob ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-4 sm:items-center sm:justify-center">
          <form
            onSubmit={submitApplication}
            className="w-full max-w-xl rounded-lg bg-white p-5 shadow-2xl dark:bg-slate-900"
          >
            <h2 className="text-lg font-bold text-gray-950 dark:text-white">Apply for {activeJob.title}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add a focused note and your expected fee for this tuition job.
            </p>
            <textarea
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
              rows={5}
              placeholder="Write your cover letter"
              className="mt-4 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <input
              value={expectedFee}
              onChange={(event) => setExpectedFee(event.target.value)}
              type="number"
              min="1"
              placeholder="Expected hourly fee"
              className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setApplyJobId(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={applying}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {applying ? "Applying..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </PageContainer>
  );
};

export default TeacherDashboard;
