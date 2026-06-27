import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Teachers from "../pages/Teachers";
import Courses from "../pages/Courses";
import Jobs from "../pages/Jobs";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import { LegacyStudentRedirect, LegacyTeacherRedirect, LegacyDashboardRedirect } from "./LegacyRedirects";

import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherJobDetails from "../pages/teacher/TeacherJobDetails";
import FindTutors from "../pages/student/FindTutors";
import TeacherProfile from "../pages/student/TeacherProfile";
import SavedTutors from "../pages/student/SavedTutors";
import StudentCourses from "../pages/student/StudentCourses";
import MyCourses from "../pages/student/MyCourses";
import TuitionJobs from "../pages/student/TuitionJobs";
import StudentApplications from "../pages/student/Applications";
import Messages from "../pages/student/Messages";
import StudentNotifications from "../pages/student/Notifications";
import StudentReviews from "../pages/student/Reviews";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/Users";
import AdminTeachers from "../pages/admin/Teachers";
import AdminStudents from "../pages/admin/Students";
import AdminCourses from "../pages/admin/Courses";
import AdminJobs from "../pages/admin/Jobs";
import AdminApplications from "../pages/admin/Applications";
import AdminReviews from "../pages/admin/Reviews";
import AdminReports from "../pages/admin/Reports";
import AdminSettings from "../pages/admin/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachers/:id" element={<TeacherProfile />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* STUDENT DASHBOARD ROUTES */}
        <Route element={<ProtectedRoute requiredRole="student" />}>
          <Route path="/student" element={<DashboardHome />} />
          <Route path="/student/messages" element={<Messages />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/settings" element={<Settings />} />
          <Route path="/student/tutors" element={<FindTutors />} />
          <Route path="/student/tutors/:id" element={<TeacherProfile />} />
          <Route path="/student/saved-tutors" element={<SavedTutors />} />
          <Route path="/student/courses" element={<StudentCourses />} />
          <Route path="/student/my-courses" element={<MyCourses />} />
          <Route path="/student/jobs" element={<TuitionJobs />} />
          <Route path="/student/applications" element={<StudentApplications />} />
          <Route path="/student/notifications" element={<StudentNotifications />} />
          <Route path="/student/reviews" element={<StudentReviews />} />
        </Route>

        {/* TEACHER DASHBOARD ROUTES */}
        <Route element={<ProtectedRoute requiredRole="teacher" />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/jobs/:id" element={<TeacherJobDetails />} />
          <Route path="/teacher/messages" element={<Messages />} />
          <Route path="/teacher/profile" element={<Profile />} />
          <Route path="/teacher/settings" element={<Settings />} />
          <Route path="/teacher/students" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<StudentCourses />} />
          <Route path="/teacher/earnings" element={<TeacherDashboard />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/teachers" element={<AdminTeachers />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/profile" element={<Profile />} />
        </Route>

        {/* LEGACY ROUTES */}
        <Route path="/dashboard/*" element={<LegacyDashboardRedirect />} />
        <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
        <Route path="/settings" element={<Navigate to="/student/settings" replace />} />
        <Route path="/student/*" element={<LegacyStudentRedirect />} />
        <Route path="/teacher/*" element={<LegacyTeacherRedirect />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
