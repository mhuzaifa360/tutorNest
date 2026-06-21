import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function AppLayout({ children }) {
  const location = useLocation();

  // Check if current route is a dashboard route
  const isDashboard = /^\/(student|teacher)(\/|$)/.test(location.pathname);
  const isAdminArea = /^\/admin(\/|$)/.test(location.pathname);

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup" || isAdminArea;

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-gray-900 dark:text-white font-inter overflow-hidden transition-colors duration-300">
      {/* Sidebar (Only visible on student/teacher dashboard routes) */}
      {isDashboard && <Sidebar />}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ${isDashboard ? 'lg:ml-[280px]' : ''}`}>
        {/* Top Navbar */}
        <Navbar isDashboard={isDashboard} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full relative flex flex-col">
          <div className="flex-1 max-w-full px-4 py-8 md:px-6 lg:px-8 xl:px-10">
            <div className="mx-auto w-full max-w-[1600px] space-y-8">
              {children}
            </div>
          </div>
          {/* Footer (Only visible on non-dashboard routes) */}
          {!isDashboard && <Footer />}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
