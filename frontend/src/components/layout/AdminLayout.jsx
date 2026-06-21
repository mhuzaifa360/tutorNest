import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import HomeButton from "../common/HomeButton";
import UserMenu from "../common/UserMenu";

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

      <div className="flex-1 flex flex-col bg-gray-100">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <HomeButton />
          <UserMenu />
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;