import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiBookOpen, FiBookmark, FiBriefcase, FiMessageSquare, FiUsers } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { dashboardApi } from "../../services/apiService";
import PageContainer from "../../components/layout/PageContainer";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";

const Stat = ({ title, value, icon }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">{value}</p>
      </div>
      <div className="rounded-lg bg-blue-50 p-3 text-xl text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
        {icon}
      </div>
    </div>
  </Card>
);

function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    const res = await dashboardApi.student(user.id);
    if (res.ok) {
      setData(res.data);
      setError("");
    } else {
      setError(res.message || "Unable to load dashboard.");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  if (loading) return <LoadingState label="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const stats = data?.stats || {};

  return (
    <PageContainer className="animate-fade-in space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.firstName || "Student"}`}
        description="Track courses, tutors, jobs, applications, and messages from one workspace."
        action={
          <Link
            to="/dashboard/tutors"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Find Tutors
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Enrolled Courses" value={stats.enrolledCourses || 0} icon={<FiBookOpen />} />
        <Stat title="Saved Teachers" value={stats.savedTeachers || 0} icon={<FiBookmark />} />
        <Stat title="Active Jobs" value={stats.activeJobs || 0} icon={<FiBriefcase />} />
        <Stat title="Unread Messages" value={stats.unreadMessages || 0} icon={<FiMessageSquare />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-gray-950 dark:text-white">Recommended Teachers</h2>
            <Link to="/dashboard/tutors" className="text-sm font-semibold text-blue-600">
              View all
            </Link>
          </div>
          {data?.recommendedTeachers?.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {data.recommendedTeachers.map((teacher) => (
                <Link
                  key={teacher.id}
                  to={`/dashboard/tutors/${teacher.id}`}
                  className="rounded-lg border border-gray-200 p-4 transition hover:border-blue-300 dark:border-slate-800"
                >
                  <p className="font-semibold text-gray-950 dark:text-white">
                    {teacher.firstName} {teacher.lastName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {teacher.qualification || "Tutor"} • {teacher.experience || 0} yrs
                  </p>
                  <p className="mt-2 text-sm text-amber-600">Rating {teacher.rating || 0}</p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recommendations yet"
              description="Tutors will appear as they join TutorNest."
            />
          )}
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-bold text-gray-950 dark:text-white">
            <FiBell /> Recent Activity
          </h2>
          {data?.recentActivity?.length ? (
            <div className="space-y-3">
              {data.recentActivity.map((item) => (
                <div key={item.id} className="rounded-lg bg-gray-50 p-3 dark:bg-slate-800">
                  <p className="text-sm font-semibold text-gray-950 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No recent activity"
              description="Notifications and activity will appear here."
            />
          )}
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold text-gray-950 dark:text-white">Latest Courses</h2>
          {data?.latestCourses?.length ? (
            data.latestCourses.map((course) => (
              <div
                key={course.id}
                className="mb-3 rounded-lg border border-gray-200 p-3 dark:border-slate-800"
              >
                <p className="font-semibold">{course.title}</p>
                <p className="text-sm text-gray-500">
                  {course.teacher
                    ? `${course.teacher.firstName} ${course.teacher.lastName}`
                    : "TutorNest"}
                </p>
              </div>
            ))
          ) : (
            <EmptyState title="No courses yet" description="New courses will show up here." />
          )}
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-bold text-gray-950 dark:text-white">
            <FiUsers /> Recent Applications
          </h2>
          {data?.recentApplications?.length ? (
            data.recentApplications.map((app) => (
              <div
                key={app.id}
                className="mb-3 rounded-lg border border-gray-200 p-3 dark:border-slate-800"
              >
                <p className="font-semibold">
                  {app.tutor ? `${app.tutor.firstName} ${app.tutor.lastName}` : "Teacher"}
                </p>
                <p className="text-sm text-gray-500">{app.status}</p>
              </div>
            ))
          ) : (
            <EmptyState
              title="No applications yet"
              description="Teacher applications to your jobs will appear here."
            />
          )}
        </Card>
      </div>
    </PageContainer>
  );
}

export default StudentDashboard;
