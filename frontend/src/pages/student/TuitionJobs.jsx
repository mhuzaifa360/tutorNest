import { useEffect, useState } from "react";
import { studentApi } from "../../services/apiService";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";

const emptyForm = { title: "", subject: "", classLevel: "", description: "", budget: "", city: "", province: "", mode: "home" };
const input = "h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white";

function TuitionJobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await studentApi.jobs();
    if (res.ok) {
      setJobs(res.data || []);
      setError("");
    } else setError(res.message || "Unable to load jobs.");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, budget: Number(form.budget) || 0, description: `${form.description}\nClass Level: ${form.classLevel}\nProvince: ${form.province}` };
    const res = editingId ? await studentApi.updateJob(editingId, payload) : await studentApi.createJob(payload);
    if (res.ok) {
      setForm(emptyForm);
      setEditingId(null);
      load();
    } else setError(res.message || "Unable to save job.");
  };

  const edit = (job) => {
    setEditingId(job.id);
    setForm({
      title: job.title || "",
      subject: job.subject || "",
      classLevel: job.classLevel || "",
      description: job.description || "",
      budget: job.budget || "",
      city: job.city || "",
      province: job.province || "",
      mode: job.mode || "home",
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    const res = await studentApi.deleteJob(id);
    if (res.ok) load();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Tuition Jobs" description="Create and manage tuition requests for teachers to apply." />
      <Card>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
          {["title", "subject", "classLevel", "budget", "city", "province"].map((field) => (
            <input key={field} className={input} placeholder={field} value={form[field]} onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))} required={field !== "province"} />
          ))}
          <select className={input} value={form.mode} onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value }))}>
            <option value="home">Home</option>
            <option value="online">Online</option>
          </select>
          <textarea className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white md:col-span-4" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:w-fit">{editingId ? "Update Job" : "Create Job"}</button>
        </form>
      </Card>

      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : jobs.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="font-bold text-gray-950 dark:text-white">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.subject} • {job.city} • {job.mode}</p>
                </div>
                <span className="text-sm font-semibold">{job.status}</span>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{job.description}</p>
              <p className="mt-3 font-semibold">Budget: PKR {job.budget || 0}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => edit(job)} className="rounded-lg border px-3 py-2 text-sm font-semibold dark:border-slate-700">Edit</button>
                <button onClick={() => remove(job.id)} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      ) : <EmptyState title="No jobs created" description="Create a tuition job to receive teacher applications." />}
    </div>
  );
}

export default TuitionJobs;
