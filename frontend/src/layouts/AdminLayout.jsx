import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { adminApi } from "../services/apiService";
import AdminNavbar from "../components/admin/AdminNavbar";
import Sidebar from "../components/admin/Sidebar";

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let active = true;
    adminApi.overview().then((response) => {
      if (active && response.ok) {
        setNotifications(response.data?.notifications || []);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 dark:bg-slate-950 dark:text-white">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="min-h-screen md:pl-72">
        <AdminNavbar onMenuClick={() => setOpen(true)} notifications={notifications} />
        <main className="px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
