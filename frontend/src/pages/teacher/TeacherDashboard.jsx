import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBriefcase, FiDollarSign, FiMessageSquare, FiStar, FiUsers } from "react-icons/fi";
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
      <div className="rounded-lg bg-indigo-50 p-3 text-xl text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
        {icon}
      </div>
    </div>
  </Card>
);

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    const res = await dashboardApi.teacher(user.id);
    if (res.ok) {
      setData(res.data);
      setError("");
    } else {
      setError(res.message || "Unable to load teacher dashboard.");
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
        title={`Welcome back, ${user?.firstName || "Teacher"}`}
        description="Track students, applications, earnings, and messages from one workspace."
        action={
          <Link
            to="/teacher/messages"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Open Messages
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat title="Total Students" value={stats.students || 0} icon={<FiUsers />} />
        <Stat
          title="Total Earnings"
          value={`PKR ${Number(stats.earnings || 0).toLocaleString()}`}
          icon={<FiDollarSign />}
        />
        <Stat title="Average Rating" value={stats.rating || 0} icon={<FiStar />} />
        <Stat title="Unread Messages" value={stats.unreadMessages || 0} icon={<FiMessageSquare />} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-bold text-gray-950 dark:text-white">
            <FiBriefcase /> Recent Applications
          </h2>
          {data?.recentApplications?.length ? (
            data.recentApplications.map((application) => (
              <div
                key={application.id}
                className="mb-3 rounded-lg border border-gray-200 p-3 dark:border-slate-800"
              >
                <p className="font-semibold">{application.job?.title || "Job application"}</p>
                <p className="text-sm text-gray-500">
                  {application.job?.student
                    ? `${application.job.student.firstName} ${application.job.student.lastName}`
                    : "Student"}{" "}
                  • {application.status}
                </p>
              </div>
            ))
          ) : (
            <EmptyState
              title="No applications yet"
              description="Applications from students will appear here."
            />
          )}
        </Card>

        <Card>
          <h2 className="mb-4 font-bold text-gray-950 dark:text-white">Recent Reviews</h2>
          {data?.recentReviews?.length ? (
            data.recentReviews.map((review) => (
              <div
                key={review.id}
                className="mb-3 rounded-lg border border-gray-200 p-3 dark:border-slate-800"
              >
                <p className="font-semibold">
                  {review.student
                    ? `${review.student.firstName} ${review.student.lastName}`
                    : "Student"}{" "}
                  • {review.rating}/5
                </p>
                <p className="text-sm text-gray-500">{review.comment || "No comment"}</p>
              </div>
            ))
          ) : (
            <EmptyState title="No reviews yet" description="Student reviews will appear here." />
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default TeacherDashboard;
