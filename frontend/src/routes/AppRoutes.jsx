import { Route, Routes, useLocation } from "react-router";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Teachers from "../pages/Teachers";
import Courses from "../pages/Courses";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import StudentLayout from "../components/layout/StudentLayout";
import TeacherLayout from "../components/layout/TeacherLayout";
import AdminLayout from "../components/layout/AdminLayout";

// pages
import StudentDashboard from "../pages/student/StudentDashboard";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <RoleRoute role="student">
              <StudentLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
        </Route>

        {/* TEACHER */}
        <Route
          path="/teacher"
          element={
            <RoleRoute role="teacher">
              <TeacherLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<TeacherDashboard />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RoleRoute role="admin">
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>

      {/* FOOTER */}
      {!hideLayout && <Footer />}
    </>
  );
}

export default AppRoutes;
