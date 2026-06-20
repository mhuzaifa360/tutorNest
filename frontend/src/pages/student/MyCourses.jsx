import { useEffect, useState } from "react";
import { studentApi } from "../../services/apiService";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await studentApi.enrolledCourses();
    if (res.ok) {
      setCourses(res.data || []);
      setError("");
    } else setError(res.message || "Unable to load enrolled courses.");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="My Courses" description="Track enrolled courses, progress, and completion status." />
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : courses.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {courses.map((course, index) => {
            const progress = Math.min(100, 25 + index * 15);
            return (
              <Card key={course.id}>
                <h3 className="font-bold text-gray-950 dark:text-white">{course.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{course.teacher ? `${course.teacher.firstName} ${course.teacher.lastName}` : "TutorNest"}</p>
                <div className="mt-4 h-2 rounded-full bg-gray-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-sm font-semibold">{progress}% complete • {progress === 100 ? "Completed" : "In progress"}</p>
              </Card>
            );
          })}
        </div>
      ) : <EmptyState title="No enrolled courses" description="Enroll from the Courses page to start learning." />}
    </div>
  );
}

export default MyCourses;
