import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StudentLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold mb-6">
          Student Panel
        </h2>

        <p className="mb-4">Welcome, {user?.name}</p>

        <nav className="flex flex-col gap-3">
          <Link to="/student/dashboard">Dashboard</Link>
          <Link to="/student/courses">My Courses</Link>
          <Link to="/student/messages">Messages</Link>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;