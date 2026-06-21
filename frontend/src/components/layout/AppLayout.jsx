import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function AppLayout({ children }) {
  const location = useLocation();

  const isDashboard =
    location.pathname.startsWith("/student") ||
    location.pathname.startsWith("/teacher") ||
    location.pathname.startsWith("/admin");

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    isDashboard;

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-gray-900 dark:text-white font-inter overflow-hidden transition-colors duration-300">
      {/* Sidebar (Only visible on student/teacher/admin dashboard routes) */}
      {isDashboard && <Sidebar />}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ${isDashboard ? 'lg:ml-[280px]' : ''}`}>
        {/* Top Navbar */}
        <Navbar isDashboard={isDashboard} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full relative px-4 py-8 pb-24 md:px-6 lg:px-8">
          {children}
          {!isDashboard && <Footer />}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
