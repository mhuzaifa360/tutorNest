import { useAuth } from "../../context/AuthContext";
import { FiUsers, FiDollarSign, FiStar } from "react-icons/fi";

const TeacherDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Students",
      value: "12",
      icon: <FiUsers className="text-[28px] text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />,
      bgIcon: "bg-blue-100 dark:bg-blue-900/40",
      bgCard: "bg-white dark:bg-slate-900",
    },
    {
      title: "Total Earnings",
      value: "Rs 45,000",
      icon: <FiDollarSign className="text-[28px] text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />,
      bgIcon: "bg-emerald-100 dark:bg-emerald-900/40",
      bgCard: "bg-white dark:bg-slate-900",
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: <FiStar className="text-[28px] text-amber-500 dark:text-amber-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />,
      bgIcon: "bg-amber-100 dark:bg-amber-900/40",
      bgCard: "bg-white dark:bg-slate-900",
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in font-inter pb-12">
      {/* WELCOME HERO SECTION */}
      <div className="relative overflow-hidden rounded-[24px] shadow-sm group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-800 dark:to-indigo-950/40 z-0"></div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none z-0">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute right-[-20%] top-[-50%] w-[150%] h-[200%] text-indigo-500 fill-current">
            <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3C90.8,-33.5,96.8,-18.1,97.3,-2.6C97.8,12.9,92.8,28.5,83.9,41.9C75,55.3,62.2,66.5,47.9,73.5C33.6,80.5,17.8,83.3,2.4,79.1C-13,74.9,-28,63.7,-42.2,55.5C-56.4,47.3,-69.8,42,-78.9,31.5C-88,21,-92.8,5.3,-91.3,-9.9C-89.8,-25.1,-82,-39.8,-71.2,-50.7C-60.4,-61.6,-46.6,-68.7,-32.9,-75.7C-19.2,-82.7,-5.6,-89.6,8.2,-91.3C22,-93,42.4,-89.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 md:p-10 lg:p-12 backdrop-blur-sm bg-white/30 dark:bg-slate-900/20">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user?.firstName || "Teacher"}!</span> 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-3 text-lg font-medium">
              Ready to inspire and educate today? View your daily insights below.
            </p>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
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
    </div>
  );
};

export default TeacherDashboard;
