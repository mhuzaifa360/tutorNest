
import { useEffect, useState } from "react";
import Typography from "../components/common/Typography";
import PageContainer from "../components/layout/PageContainer";
import { searchApi } from "../services/apiService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    setLoading(true);
    const res = await searchApi.courses();
    if (res.ok) {
      setCourses(res.data || []);
      setError("");
    } else {
      setCourses([]);
      setError(res.message || "Unable to load courses.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <section className="w-full bg-lightGreyBG dark:bg-slate-950 transition-colors duration-300 py-20">
      <PageContainer>
        <div className="text-center mb-12">
          <Typography variant="h2" className="font-bold text-textBlack dark:text-white">
            Our Courses
          </Typography>

          <Typography className="text-textGrey dark:text-gray-400 mt-3">
            Explore our comprehensive range of courses designed to help you excel in your studies.
          </Typography>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8 text-center text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/20">
            Loading courses...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-800 dark:bg-red-900/20">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-700 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-200">
            No courses available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-lg border border-transparent dark:border-slate-800 transition-all duration-300 flex flex-col gap-4"
              >
                <Typography className="font-semibold text-lg text-textBlack dark:text-white">
                  {course.title}
                </Typography>
                <Typography className="text-textGrey dark:text-gray-400 text-sm leading-relaxed">
                  {course.description || course.desc || "No course description provided."}
                </Typography>
                <div className="flex flex-col gap-2 text-sm text-textGrey dark:text-gray-400">
                  <span>Price: PKR {course.price ?? "N/A"}</span>
                  <span>Teacher ID: {course.teacherId || "N/A"}</span>
                </div>
                <button className="mt-auto rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90 transition">
                  Join Course
                </button>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </section>
  );
}

export default Courses;
