import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Teachers from "../pages/Teachers";
import Courses from "../pages/Courses";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import AdminLayout from "../layouts/AdminLayout";
import MainLayout from "../layouts/MainLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import { LegacyStudentRedirect, LegacyTeacherRedirect } from "./LegacyRedirects";

import TeacherDashboard from "../pages/teacher/TeacherDashboard";
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
    <AppLayout>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* UNIFIED DASHBOARD SHELL */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />

          <Route
            path="tutors"
            element={
              <ProtectedRoute requiredRole="student">
                <FindTutors />
              </ProtectedRoute>
            }
          />
          <Route
            path="tutors/:id"
            element={
              <ProtectedRoute requiredRole="student">
                <TeacherProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="saved-tutors"
            element={
              <ProtectedRoute requiredRole="student">
                <SavedTutors />
              </ProtectedRoute>
            }
          />
          <Route
            path="courses"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-courses"
            element={
              <ProtectedRoute requiredRole="student">
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobs"
            element={
              <ProtectedRoute requiredRole="student">
                <TuitionJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="applications"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentNotifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="reviews"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="students"
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="earnings"
            element={
              <ProtectedRoute requiredRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* LEGACY REDIRECTS */}
        <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
        <Route path="/student/*" element={<LegacyStudentRedirect />} />
        <Route path="/teacher/*" element={<LegacyTeacherRedirect />} />

        {/* ADMIN AREA */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/teacher" element={<Navigate to="/dashboard" replace />} />
        <Route path="/student" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default AppRoutes;
