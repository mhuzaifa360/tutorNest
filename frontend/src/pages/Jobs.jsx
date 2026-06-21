import { useEffect, useState } from "react";
import { searchApi } from "../services/apiService";
import { Link } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      const response = await searchApi.jobs();
      if (response.ok) {
        setJobs(response.data || []);
        setError("");
      } else {
        setError(response.message || "Unable to load jobs.");
      }
      setLoading(false);
    };

    loadJobs();
  }, []);

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="max-w-4xl rounded-3xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tuition Jobs</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Browse active tuition requests from students.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm border border-red-200 text-red-700 dark:bg-slate-900 dark:border-red-700/40">
            <p>{error}</p>
          </div>
        ) : jobs.length ? (
          jobs.map((job) => (
            <article
              key={job.id}
              className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{job.title || "Tuition Job"}</h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{job.subject || "General"}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {job.mode || "Any"}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{job.description || "No description provided."}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
                <span>{job.city ? `${job.city}, ${job.province || ""}` : "Location not set"}</span>
                <span>Budget: PKR {job.budget || "—"}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 text-center dark:bg-slate-900 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">No jobs available right now.</p>
            <Link
              to="/signup"
              className="mt-4 inline-flex rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Create an account
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Jobs;
