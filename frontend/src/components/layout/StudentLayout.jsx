import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiHome, FiBook, FiMessageSquare, FiLogOut, FiSettings, FiMenu } from "react-icons/fi";
import { useState } from "react";
import HomeButton from "../common/HomeButton";
import UserMenu from "../common/UserMenu";

const StudentLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/student/dashboard", icon: <FiHome /> },
    { name: "My Courses", path: "/student/courses", icon: <FiBook /> },
    { name: "Messages", path: "/messages", icon: <FiMessageSquare /> },
    { name: "Settings", path: "/student/settings", icon: <FiSettings /> },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 font-inter overflow-hidden">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - Full Height */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-blue-700 to-indigo-900 text-white flex flex-col transition-transform duration-300 ease-in-out shadow-2xl shadow-indigo-900/20 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* LOGO AREA */}
        <div className="h-20 px-8 flex items-center shrink-0 border-b border-white/10">
           <Link to="/" className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
             TutorNest.
           </Link>
        </div>

        {/* PROFILE SUMMARY */}
        <div className="px-8 py-6 mb-2 shrink-0">
          <p className="text-indigo-200 text-xs font-semibold tracking-wider uppercase mb-3">Student Panel</p>
          <div className="flex items-center gap-3">
             <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner border border-white/10 text-lg">
               {user?.initials || "U"}
             </div>
             <div>
               <p className="font-bold leading-tight text-white text-[15px]">{user?.firstName || "Student"}</p>
               <p className="text-xs text-indigo-200 mt-0.5 font-medium">Active Learner</p>
             </div>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 py-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? "bg-white/15 text-white font-semibold shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                    : "text-indigo-100/70 hover:bg-white/10 hover:text-white hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,255,255,0.08)] font-medium"
                  }
                `}
              >
                {/* Active Left Border Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-fade-in-right"></div>
                )}
                
                <span className={`text-[22px] transition-transform duration-300 ${isActive ? "scale-110 text-white" : "group-hover:scale-110"}`}>
                  {link.icon}
                </span>
                <span className="tracking-wide text-[15px]">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON - FIXED AT BOTTOM */}
        <div className="p-6 mt-auto shrink-0 border-t border-white/10 bg-indigo-900/50 backdrop-blur-md">
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl transition-all duration-300 text-indigo-100 hover:bg-red-500/90 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-[1.02] group font-semibold"
          >
            <FiLogOut className="text-[22px] group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="tracking-wide text-[15px]">Logout Account</span>
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE AREA (Navbar + Main Content) */}
      <div className="flex-1 flex flex-col lg:ml-72 min-h-screen relative w-full overflow-hidden transition-all duration-300">
        
        {/* TOP NAVBAR FOR DASHBOARD */}
        <header className="h-20 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 z-30 sticky top-0 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors lg:hidden"
            >
              <FiMenu className="text-2xl" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">Student Dashboard</h1>
          </div>
          
          {/* We import the global Navbar, but hide its logo and desktop links using CSS or we can just render the right-side profile logic */}
          {/* To keep it clean and DRY without duplicating the avatar logic, we can embed the Navbar component but it will conflict with our layout if it's strictly coded. Let's just use the global Navbar and pass a prop, OR duplicate the right side since it's just ThemeToggle and Avatar. */}
          
          <div className="flex items-center gap-3">
            <HomeButton />
            <UserMenu />
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative">
          <div className="max-w-7xl mx-auto w-full pb-10">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default StudentLayout;
