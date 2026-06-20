import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Teachers from "../pages/Teachers";
import Courses from "../pages/Courses";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import Settings from "../pages/Settings";

import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import AdminLayout from "../layouts/AdminLayout";

// pages
import StudentDashboard from "../pages/student/StudentDashboard";
import FindTutors from "../pages/student/FindTutors";
import TeacherProfile from "../pages/student/TeacherProfile";
import SavedTutors from "../pages/student/SavedTutors";
import StudentCourses from "../pages/student/StudentCourses";
import MyCourses from "../pages/student/MyCourses";
import TuitionJobs from "../pages/student/TuitionJobs";
import StudentApplications from "../pages/student/Applications";
import StudentMessages from "../pages/student/Messages";
import StudentNotifications from "../pages/student/Notifications";
import StudentReviews from "../pages/student/Reviews";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
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

        {/* PROFILE ROUTES */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        
        {/* PROTECTED DASHBOARDS */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/tutors"
          element={
            <ProtectedRoute requiredRole="student">
              <FindTutors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/tutors/:id"
          element={
            <ProtectedRoute requiredRole="student">
              <TeacherProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/saved-tutors"
          element={
            <ProtectedRoute requiredRole="student">
              <SavedTutors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/my-courses"
          element={
            <ProtectedRoute requiredRole="student">
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/jobs"
          element={
            <ProtectedRoute requiredRole="student">
              <TuitionJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/messages"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/reviews"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute requiredRole="student">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/settings"
          element={
            <ProtectedRoute requiredRole="student">
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
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
        </Route>

        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/teacher" element={<Navigate to="/teachers" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default AppRoutes;
