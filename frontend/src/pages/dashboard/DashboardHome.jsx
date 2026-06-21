import { useAuth } from "../../context/AuthContext";
import StudentDashboard from "../../pages/student/StudentDashboard";
import TeacherDashboard from "../../pages/teacher/TeacherDashboard";
import { Navigate } from "react-router-dom";

export default function DashboardHome() {
  const { user } = useAuth();

  if (user?.role === "teacher") {
    return <TeacherDashboard />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <StudentDashboard />;
}
