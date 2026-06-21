import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const studentRouteMap = {
  dashboard: "",
  tutors: "tutors",
  "saved-tutors": "saved-tutors",
  courses: "courses",
  "my-courses": "my-courses",
  jobs: "jobs",
  applications: "applications",
  messages: "messages",
  notifications: "notifications",
  reviews: "reviews",
  profile: "profile",
  settings: "settings",
};

export function LegacyStudentRedirect() {
  const params = useParams();
  const rest = params["*"] || "";
  const segment = rest.split("/")[0] || "dashboard";
  const target = studentRouteMap[segment];

  if (target === undefined) {
    return <Navigate to="/student" replace />;
  }

  return <Navigate to={target ? `/student/${target}` : "/student"} replace />;
}

export function LegacyTeacherRedirect() {
  const params = useParams();
  const rest = params["*"] || "";
  const segment = rest.split("/")[0] || "dashboard";
  const target = segment === "dashboard" ? "" : segment;
  return <Navigate to={target ? `/teacher/${target}` : "/teacher"} replace />;
}

export function LegacyDashboardRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role?.toLowerCase();
  if (role === "teacher") {
    return <Navigate to="/teacher" replace />;
  }
  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/student" replace />;
}
