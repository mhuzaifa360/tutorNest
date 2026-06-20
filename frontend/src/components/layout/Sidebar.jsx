import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiBell,
  FiBookmark,
  FiBriefcase,
  FiClipboard,
  FiDollarSign,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiSearch,
  FiSettings,
  FiStar,
  FiUser,
  FiUsers,
  FiBook,
} from "react-icons/fi";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Toggle sidebar event listener (triggered from Navbar mobile menu button)
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  const role = user?.role || "student";

  // Dynamic links based on role
  const getLinks = () => {
    if (role === "teacher") {
      return [
        { name: "Dashboard", path: "/teacher/dashboard", icon: <FiHome /> },
        { name: "My Students", path: "/teacher/students", icon: <FiUsers /> },
        { name: "Earnings", path: "/teacher/earnings", icon: <FiDollarSign /> },
        { name: "Messages", path: "/messages", icon: <FiMessageSquare /> },
        { name: "Settings", path: "/teacher/settings", icon: <FiSettings /> },
      ];
    }
    // Default to student
    return [
      { name: "Dashboard", path: "/student/dashboard", icon: <FiHome /> },
      { name: "Find Tutors", path: "/student/tutors", icon: <FiSearch /> },
      { name: "Saved Tutors", path: "/student/saved-tutors", icon: <FiBookmark /> },
      { name: "Courses", path: "/student/courses", icon: <FiBook /> },
      { name: "My Courses", path: "/student/my-courses", icon: <FiClipboard /> },
      { name: "Tuition Jobs", path: "/student/jobs", icon: <FiBriefcase /> },
      { name: "Applications", path: "/student/applications", icon: <FiUsers /> },
      { name: "Messages", path: "/student/messages", icon: <FiMessageSquare /> },
      { name: "Notifications", path: "/student/notifications", icon: <FiBell /> },
      { name: "Reviews", path: "/student/reviews", icon: <FiStar /> },
      { name: "Profile", path: "/student/profile", icon: <FiUser /> },
      { name: "Settings", path: "/student/settings", icon: <FiSettings /> },
    ];
  };

  const links = getLinks();
  const roleTitle = role === "teacher" ? "Teacher Panel" : role === "admin" ? "Admin Panel" : "Student Panel";

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-blue-700 to-indigo-900 text-white flex flex-col transition-transform duration-300 ease-in-out shadow-2xl shadow-indigo-900/20 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* LOGO AREA */}
        <div className="h-20 px-8 flex items-center shrink-0 border-b border-white/10">
           <Link to="/" className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
             TutorNest.
           </Link>
        </div>

        {/* PROFILE SUMMARY */}
        <div className="px-8 py-6 mb-2 shrink-0">
          <p className="text-indigo-200 text-xs font-semibold tracking-wider uppercase mb-3">{roleTitle}</p>
          <div className="flex items-center gap-3">
             <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner border border-white/10 text-lg shrink-0">
               {user?.initials || "U"}
             </div>
             <div className="min-w-0">
               <p className="font-bold leading-tight text-white text-[15px] truncate">{user?.firstName || "User"}</p>
               <p className="text-xs text-indigo-200 mt-0.5 font-medium truncate capitalize">{role}</p>
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
                onClick={() => setIsOpen(false)}
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
            <span className="tracking-wide text-[15px]">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
