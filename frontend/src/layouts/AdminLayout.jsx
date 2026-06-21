import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { adminApi } from "../services/apiService";
import AdminNavbar from "../components/admin/AdminNavbar";
import Sidebar from "../components/admin/Sidebar";
import PageContainer from "../components/layout/PageContainer";

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
      <div className="min-h-screen md:pl-[280px]">
        <AdminNavbar onMenuClick={() => setOpen(true)} notifications={notifications} />
        <main className="py-8 pb-24">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
