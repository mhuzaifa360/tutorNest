/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiMapPin, FiSend, FiUser } from "react-icons/fi";
import PageContainer from "../../components/layout/PageContainer";
import { Card, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";
import { teacherApi } from "../../services/apiService";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "New";

const TeacherJobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [expectedFee, setExpectedFee] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await teacherApi.job(id);
    if (res.ok) {
      setJob(res.data);
      setError("");
    } else {
      setError(res.message || "Unable to load job details.");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  const submitApplication = async (event) => {
    event.preventDefault();
    if (!coverLetter.trim()) {
      setNotice("Cover letter is required.");
      return;
    }

    setSubmitting(true);
    const res = await teacherApi.applyJob({
      jobId: Number(id),
      coverLetter,
      expectedFee: expectedFee ? Number(expectedFee) : undefined,
    });
    setSubmitting(false);

    if (res.ok) {
      setNotice("Application submitted successfully.");
      setCoverLetter("");
      setExpectedFee("");
      await load();
    } else {
      setNotice(res.message || "Unable to submit application.");
    }
  };

  if (loading) return <LoadingState label="Loading job details..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!job) return null;

  const studentName = job.student
    ? `${job.student.firstName || ""} ${job.student.lastName || ""}`.trim()
    : "Student";

  return (
    <PageContainer className="animate-fade-in space-y-6">
      <PageHeader
        title={job.title}
        description={`${job.subject} tuition job posted by ${studentName}`}
        action={
          <Link
            to="/teacher"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-700 dark:text-gray-200"
          >
            <FiArrowLeft /> Back
          </Link>
        }
      />

      {notice ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-slate-800">
                <FiMapPin /> {job.city || "City not set"}, {job.province || "Province not set"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-slate-800">
                <FiCalendar /> {formatDate(job.createdAt)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-slate-800">
                <FiUser /> {job.applicationCount || 0} applications
              </span>
            </div>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-gray-300">
              {job.description}
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-gray-950 dark:text-white">Job Details</h2>
            <div className="mt-4 grid gap-3 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2">
              <span>Subject: {job.subject}</span>
              <span>Class level: {job.classLevel || job.student?.classLevel || "Not specified"}</span>
              <span>Teaching mode: {job.mode || "home"}</span>
              <span>Preferred gender: {job.preferredGender || "Any"}</span>
              <span>Budget: PKR {Number(job.budget || 0).toLocaleString()}</span>
              <span>Status: {job.status}</span>
            </div>
          </Card>
        </div>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-950 dark:text-white">
            <FiSend /> Apply Now
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Send a clear proposal. The student can accept it to open chat.
          </p>
          <form onSubmit={submitApplication} className="mt-4 space-y-3">
            <textarea
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
              rows={7}
              placeholder="Explain your teaching fit, availability, and approach"
              className="w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <input
              value={expectedFee}
              onChange={(event) => setExpectedFee(event.target.value)}
              type="number"
              min="1"
              placeholder="Expected hourly fee"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <button
              type="submit"
              disabled={submitting || job.status !== "open"}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default TeacherJobDetails;
