import { useAuth } from "../../context/AuthContext";
import { FiBookOpen, FiClock, FiAward, FiArrowRight, FiPlayCircle, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Enrolled Courses",
      value: "4",
      icon: <FiBookOpen className="text-[28px] text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />,
      bgIcon: "bg-blue-100 dark:bg-blue-900/40",
      bgCard: "bg-white dark:bg-slate-900",
    },
    {
      title: "Hours Learned",
      value: "28",
      icon: <FiClock className="text-[28px] text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />,
      bgIcon: "bg-indigo-100 dark:bg-indigo-900/40",
      bgCard: "bg-white dark:bg-slate-900",
    },
    {
      title: "Certificates",
      value: "2",
      icon: <FiAward className="text-[28px] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />,
      bgIcon: "bg-emerald-100 dark:bg-emerald-900/40",
      bgCard: "bg-white dark:bg-slate-900",
    },
  ];

  const recentActivity = [
    { id: 1, title: "Completed 'React Fundamentals' module", time: "2 hours ago", type: "completion" },
    { id: 2, title: "Enrolled in 'Advanced Mathematics'", time: "1 day ago", type: "enrollment" },
    { id: 3, title: "Submitted Physics Assignment", time: "3 days ago", type: "assignment" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in font-inter pb-12">
      
      {/* WELCOME HERO SECTION */}
      <div className="relative overflow-hidden rounded-[24px] shadow-sm group">
        {/* Soft Blue Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-indigo-950/40 z-0"></div>
        
        {/* Subtle Wave Illustration using CSS/SVG patterns */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none z-0">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute right-[-20%] top-[-50%] w-[150%] h-[200%] text-blue-500 fill-current">
            <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18.1,97.3,-2.6C97.8,12.9,92.8,28.5,83.9,41.9C75,55.3,62.2,66.5,47.9,73.5C33.6,80.5,17.8,83.3,2.4,79.1C-13,74.9,-28,63.7,-42.2,55.5C-56.4,47.3,-69.8,42,-78.9,31.5C-88,21,-92.8,5.3,-91.3,-9.9C-89.8,-25.1,-82,-39.8,-71.2,-50.7C-60.4,-61.6,-46.6,-68.7,-32.9,-75.7C-19.2,-82.7,-5.6,-89.6,8.2,-91.3C22,-93,42.4,-89.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 md:p-10 lg:p-12 backdrop-blur-sm bg-white/30 dark:bg-slate-900/20">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.firstName || "Student"}!</span> 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-3 text-lg font-medium">
              Ready to continue your learning journey today? Pick up where you left off.
            </p>
          </div>
          
          <Link 
            to="/courses" 
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.35)] hover:-translate-y-1 active:scale-95 group shrink-0"
          >
            Browse Courses 
            <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* STATS GLASS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`${stat.bgCard} p-6 rounded-2xl shadow-sm hover:shadow-lg border border-slate-100/50 dark:border-slate-800 flex items-center gap-6 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer`}
          >
            <div className={`p-4 rounded-2xl ${stat.bgIcon} shadow-inner`}>
              {stat.icon}
            </div>
            <div className="flex-1">
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm tracking-wide uppercase">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* CURRENT COURSES */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiPlayCircle className="text-blue-500" /> Continue Learning
            </h2>
            <Link to="/student/courses" className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 transition-colors bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">View All</Link>
          </div>
          
          <div className="flex flex-col gap-5">
            {/* Mock Course Card 1 */}
            <div className="flex items-center gap-5 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md hover:-translate-y-0.5 bg-white dark:bg-slate-800 transition-all duration-300 cursor-pointer group">
              <div className="w-24 h-24 rounded-[16px] bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white font-black text-2xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                JS
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Modern JavaScript Core</h3>
                  <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1.5 font-medium">Instructor: Ali Khan</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[65%] relative">
                       <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30"></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-10">65%</span>
                </div>
              </div>
            </div>

            {/* Mock Course Card 2 */}
            <div className="flex items-center gap-5 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md hover:-translate-y-0.5 bg-white dark:bg-slate-800 transition-all duration-300 cursor-pointer group">
              <div className="w-24 h-24 rounded-[16px] bg-gradient-to-br from-emerald-400 to-teal-500 flex-shrink-0 flex items-center justify-center text-white font-black text-2xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                UI
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">UI/UX Design Masterclass</h3>
                  <span className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">Started</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1.5 font-medium">Instructor: Sara Ahmed</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full w-[30%] relative">
                       <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30"></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-10">30%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
            <FiCheckCircle className="text-indigo-500" /> Recent Activity
          </h2>
          
          <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3.5 flex flex-col gap-8">
            {recentActivity.map((activity, idx) => (
              <div key={activity.id} className="relative pl-7 group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[11px] top-0.5 w-[20px] h-[20px] rounded-full border-4 border-white dark:border-slate-900 transition-transform duration-300 group-hover:scale-125
                  ${idx === 0 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                  : idx === 1 ? 'bg-indigo-400' 
                  : 'bg-slate-300 dark:bg-slate-600'}`}
                ></div>
                
                <p className={`text-[15px] leading-tight font-semibold transition-colors duration-200
                  ${idx === 0 ? 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400' 
                  : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-500'}`}
                >
                  {activity.title}
                </p>
                <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default StudentDashboard;