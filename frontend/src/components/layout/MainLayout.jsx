import Navbar from "./Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="pt-20">{children}</main>
    </div>
  );
}

export default MainLayout;