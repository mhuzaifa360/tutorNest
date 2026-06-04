import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TeacherLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-green-600 text-white p-4">
        <h2 className="text-xl font-bold mb-6">
          Teacher Panel
        </h2>

        <p className="mb-4">Welcome, {user?.name}</p>

        <nav className="flex flex-col gap-3">
          <Link to="/teacher/dashboard">Dashboard</Link>
          <Link to="/teacher/students">My Students</Link>
          <Link to="/teacher/earnings">Earnings</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;