import { useEffect, useState } from "react";
import { studentApi } from "../../services/apiService";
import PageContainer from "../../components/layout/PageContainer";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await studentApi.applications();
    if (res.ok) {
      setApplications(res.data || []);
      setError("");
    } else setError(res.message || "Unable to load applications.");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id, status) => {
    const res = await studentApi.updateApplication(id, status);
    if (res.ok) load();
  };

  return (
    <PageContainer className="space-y-5 animate-fade-in">
      <PageHeader title="Applications" description="Review teacher applications received on your tuition jobs." />
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : applications.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {applications.map((app) => (
            <Card key={app.id}>
              <h3 className="font-bold text-gray-950 dark:text-white">{app.tutor ? `${app.tutor.firstName} ${app.tutor.lastName}` : "Teacher"}</h3>
              <p className="text-sm text-gray-500">{app.job?.title || `Job #${app.jobId}`} • {app.tutor?.experience || 0} yrs • PKR {app.tutor?.hourlyFee || 0}/hr</p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{app.message}</p>
              <p className="mt-3 text-sm font-semibold">Status: {app.status}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => update(app.id, "accepted")} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Accept</button>
                <button onClick={() => update(app.id, "rejected")} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Reject</button>
              </div>
            </Card>
          ))}
        </div>
      ) : <EmptyState title="No applications yet" description="Applications will appear after teachers apply to your jobs." />}
    </PageContainer>
  );
}

export default Applications;
