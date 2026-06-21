import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Typography from "../components/common/Typography";
import PageContainer from "../components/layout/PageContainer";
import Btn from "../components/common/Btn";
import { searchApi } from "../services/apiService";

const SUBJECTS = [
  "All",
  "Mathematics",
  "Physics",
  "Computer Science",
  "Programming",
  "English",
  "Chemistry",
  "Biology",
];

function Teachers() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [price, setPrice] = useState("All");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeachers = async (params = {}) => {
    setLoading(true);
    const res = await searchApi.teachers(params);
    if (res.ok) {
      setTeachers(res.data || []);
      setError("");
    } else {
      setTeachers([]);
      setError(res.message || "Unable to load tutors.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const params = {
      name: search || undefined,
      subject: subject !== "All" ? subject : undefined,
      minFee: price === "high" ? 46 : price === "low" ? 0 : undefined,
      maxFee: price === "low" ? 45 : undefined,
    };
    loadTeachers(params);
  };

  return (
    <section className="w-full bg-lightGreyBG dark:bg-slate-950 transition-colors duration-300 py-20">
      <PageContainer>
        <div className="text-center mb-10">
          <Typography variant="h2" className="font-bold text-textBlack dark:text-white">
            Find Your Perfect Tutor
          </Typography>
          <Typography className="text-textGrey dark:text-gray-400 mt-2">
            Browse our verified tutors and find the perfect match for your learning needs.
          </Typography>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row mb-10">
          <input
            type="text"
            placeholder="Search tutors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-textBlack dark:text-white placeholder:text-gray-400 outline-none transition-colors"
          />

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full md:w-1/4 p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-textBlack dark:text-white transition-colors"
          >
            {SUBJECTS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full md:w-1/4 p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-textBlack dark:text-white transition-colors"
          >
            <option value="All">All Prices</option>
            <option value="low">Below 45</option>
            <option value="high">Above 45</option>
          </select>
        </form>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <Typography className="text-textGrey dark:text-gray-400">
            {loading ? "Loading tutors..." : `${teachers.length} tutors found`}
          </Typography>
          <Btn type="submit" variant="blue" onClick={handleSearch} className="w-full md:w-auto">
            Search
          </Btn>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-900/20">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:shadow-lg transition flex flex-col gap-3 items-center border border-transparent dark:border-slate-800"
              >
                <div className="w-12 h-12 bg-primary text-white flex items-center justify-center rounded-full font-bold text-lg">
                  {teacher.firstName?.[0] || "T"}
                  {teacher.lastName?.[0] || ""}
                </div>
                <Typography className="font-semibold text-textBlack dark:text-white text-center">
                  {teacher.firstName} {teacher.lastName}
                </Typography>
                <div className="flex flex-wrap justify-center gap-2">
                  {(Array.isArray(teacher.subjects) ? teacher.subjects : []).slice(0, 3).map((subject) => (
                    <span
                      key={subject}
                      className="text-xs bg-lightGreyBG dark:bg-slate-800 text-textGrey dark:text-gray-300 px-2 py-1 rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                <Typography className="text-textGrey dark:text-gray-400 text-sm">
                  ⭐ {teacher.rating?.average ?? teacher.rating ?? 0} ({teacher.rating?.totalReviews ?? "0"})
                </Typography>
                <Typography className="font-semibold text-textBlack dark:text-white">
                  PKR {teacher.hourlyFee || teacher.hourlyFee === 0 ? teacher.hourlyFee : "-"}/hour
                </Typography>
                <Link to={`/teachers/${teacher.id}`} className="w-full">
                  <Btn variant="blue" className="w-full">
                    View Profile
                  </Btn>
                </Link>
              </div>
            ))}
          </div>
        )}
      </PageContainer>
    </section>
  );
}

export default Teachers;
