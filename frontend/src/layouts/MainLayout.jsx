import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";

export default function MainLayout() {
  const location = useLocation();
  const isDashboard = /^(?:\/student|\/teacher|\/admin)(?:\/|$)/.test(location.pathname);
  const showSidebar = isDashboard;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <Navbar />

      <div className="relative flex min-h-[calc(100vh-72px)]">
        {showSidebar && <Sidebar />}

        <main
          className={`flex-1 px-4 py-6 md:px-6 lg:px-8 ${showSidebar ? "lg:pl-[280px]" : ""}`}
        >
          <div className="mx-auto w-full max-w-[1440px]">
            <Outlet />
          </div>
        </main>
      </div>

      {!isDashboard && <Footer />}
    </div>
  );
}
