import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">

      <aside className="w-64 bg-black text-white p-4">
        <h2 className="text-xl font-bold mb-6">
          Admin Panel
        </h2>

        <p className="mb-4">Welcome, {user?.name}</p>

        <nav className="flex flex-col gap-3">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/reports">Reports</Link>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;