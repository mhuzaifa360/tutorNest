/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { FiBookOpen, FiStar } from "react-icons/fi";
import { studentApi } from "../../services/apiService";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";
import { useAuth } from "../../context/AuthContext";
import { getImageUrl } from "../../utils/getImageUrl";

const input = "h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white";

function StudentCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [enrollingId, setEnrollingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [filters, setFilters] = useState({ category: "", price: "", level: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const [res, enrolledRes] = await Promise.all([
      studentApi.courses(),
      user?.role?.toLowerCase() === "student"
        ? studentApi.enrolledCourses()
        : Promise.resolve({ ok: true, data: [] }),
    ]);
    if (res.ok) {
      setCourses(res.data || []);
      if (enrolledRes.ok) {
        setEnrolledIds(new Set((enrolledRes.data || []).map((course) => Number(course.id))));
      }
      setError("");
    } else setError(res.message || "Unable to load courses.");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = courses.filter((course) => {
    const categoryMatch = filters.category ? course.title?.toLowerCase().includes(filters.category.toLowerCase()) : true;
    const priceMatch = filters.price ? Number(course.price || 0) <= Number(filters.price) : true;
    const levelMatch = filters.level ? course.description?.toLowerCase().includes(filters.level.toLowerCase()) : true;
    return categoryMatch && priceMatch && levelMatch;
  });

  const enroll = async (courseId) => {
    if (enrolledIds.has(Number(courseId))) return;
    setEnrollingId(courseId);
    const res = await studentApi.enroll(courseId);
    if (res.ok) {
      setEnrolledIds((prev) => new Set([...prev, Number(courseId)]));
      setStatusMessage(res.message || "Enrolled successfully.");
    } else if (res.message?.toLowerCase().includes("already")) {
      setEnrolledIds((prev) => new Set([...prev, Number(courseId)]));
      setStatusMessage("You are already enrolled in this course.");
    } else {
      setStatusMessage(res.message || "Unable to enroll.");
    }
    setEnrollingId(null);
  };

  const canEnroll = user?.role?.toLowerCase() === "student";

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Courses" description="Browse available courses and enroll instantly." />
      {statusMessage && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
          {statusMessage}
        </div>
      )}
      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <input className={input} placeholder="Category / title" value={filters.category} onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))} />
          <input className={input} placeholder="Max price" type="number" value={filters.price} onChange={(e) => setFilters((p) => ({ ...p, price: e.target.value }))} />
          <input className={input} placeholder="Level" value={filters.level} onChange={(e) => setFilters((p) => ({ ...p, level: e.target.value }))} />
        </div>
      </Card>

      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <Card key={course.id}>
              <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-4xl text-blue-600 dark:bg-blue-900/30">
                {getImageUrl(course.image || course.courseImage) ? (
                  <img
                    src={getImageUrl(course.image || course.courseImage)}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiBookOpen />
                )}
              </div>
              <h3 className="mt-4 font-bold text-gray-950 dark:text-white">{course.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{course.description}</p>
              <p className="mt-2 text-sm text-gray-500">Teacher: {course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : "TutorNest"}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold">PKR {course.price || 0}</span>
                <span className="flex items-center gap-1 text-sm text-amber-600"><FiStar /> 4.8</span>
              </div>
              {canEnroll && (
                <button
                  onClick={() => enroll(course.id)}
                  disabled={enrollingId === course.id || enrolledIds.has(Number(course.id))}
                  className={`mt-4 w-full rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed ${
                    enrolledIds.has(Number(course.id))
                      ? "bg-emerald-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {enrolledIds.has(Number(course.id))
                    ? "Enrolled"
                    : enrollingId === course.id
                    ? "Enrolling..."
                    : "Enroll"}
                </button>
              )}
            </Card>
          ))}
        </div>
      ) : <EmptyState title="No courses found" description="Try changing your filters." />}
    </div>
  );
}

export default StudentCourses;
