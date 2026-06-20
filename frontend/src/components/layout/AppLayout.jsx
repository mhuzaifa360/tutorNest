import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function AppLayout({ children }) {
  const location = useLocation();

  // Check if current route is a dashboard route
  const isDashboard = 
    location.pathname.startsWith("/student") || 
    location.pathname.startsWith("/teacher") || 
    location.pathname.startsWith("/admin");

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-inter overflow-hidden">
      {/* Sidebar (Only visible on dashboard routes) */}
      {isDashboard && <Sidebar />}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ${isDashboard ? 'md:ml-72' : ''}`}>
        
        {/* Top Navbar */}
        <Navbar isDashboard={isDashboard} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full relative flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          
          {/* Footer (Only visible on non-dashboard routes) */}
          {!isDashboard && <Footer />}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
