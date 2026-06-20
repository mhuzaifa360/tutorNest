import { Route, Routes } from "react-router";
import { Outlet } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Teachers from "../pages/Teachers";
import Courses from "../pages/Courses";

import RoleRoute from "./RoleRoute";
import AppLayout from "../components/layout/AppLayout";

// pages
import StudentDashboard from "../pages/student/StudentDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

// Simple wrapper for nested role routes
const RoleWrapper = ({ role }) => (
  <RoleRoute role={role}>
    <Outlet />
  </RoleRoute>
);

function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/courses" element={<Courses />} />
        
        {/* STUDENT */}
        <Route path="/student" element={<RoleWrapper role="student" />}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
        </Route>

        {/* TEACHER */}
        <Route path="/teacher" element={<RoleWrapper role="teacher" />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin" element={<RoleWrapper role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </AppLayout>
  );
}

export default AppRoutes;
