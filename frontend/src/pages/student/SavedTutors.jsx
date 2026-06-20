import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentApi } from "../../services/apiService";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";

function SavedTutors() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await studentApi.savedTeachers();
    if (res.ok) {
      setTeachers(res.data || []);
      setError("");
    } else setError(res.message || "Unable to load saved tutors.");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    const res = await studentApi.removeSavedTeacher(id);
    if (res.ok) load();
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Saved Tutors" description="Your saved teacher shortlist." />
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : teachers.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teachers.map((teacher) => (
            <Card key={teacher.id}>
              <h3 className="font-bold text-gray-950 dark:text-white">{teacher.firstName} {teacher.lastName}</h3>
              <p className="mt-1 text-sm text-gray-500">{teacher.qualification || "Teacher"} • {teacher.experience || 0} yrs</p>
              <p className="mt-2 text-sm">PKR {teacher.hourlyFee || 0}/hour</p>
              <div className="mt-4 flex gap-2">
                <Link to={`/student/tutors/${teacher.id}`} className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white">View</Link>
                <button onClick={() => remove(teacher.id)} className="rounded-lg border px-3 py-2 text-sm font-semibold dark:border-slate-700">Remove</button>
              </div>
            </Card>
          ))}
        </div>
      ) : <EmptyState title="No saved tutors" description="Save tutors from the Find Tutors page." />}
    </div>
  );
}

export default SavedTutors;
