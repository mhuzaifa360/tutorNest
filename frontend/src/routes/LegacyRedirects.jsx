import { Navigate, useParams } from "react-router-dom";

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
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to={target ? `/dashboard/${target}` : "/dashboard"} replace />;
}

export function LegacyTeacherRedirect() {
  const params = useParams();
  const rest = params["*"] || "";
  const segment = rest.split("/")[0] || "dashboard";
  const target = segment === "dashboard" ? "" : segment;
  return <Navigate to={target ? `/dashboard/${target}` : "/dashboard"} replace />;
}
