
import { useEffect, useState } from "react";
import Typography from "../common/Typography";
import { Link } from "react-router-dom";
import Btn from "../common/Btn";
import { teacherApi } from "../../services/apiService";

function FeaturedTutors() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTutors = async () => {
      setLoading(true);
      const res = await teacherApi.getRanked();
      if (res.ok) {
        setTutors(res.data || []);
        setError("");
      } else {
        setTutors([]);
        setError(res.message || "Unable to load tutors.");
      }
      setLoading(false);
    };
    loadTutors();
  }, []);

  return (
    <section className="w-full py-16 bg-lightGreyBG dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="text-center mb-5">
          <Typography variant="h2" className="font-bold text-textBlack dark:text-white">
            Featured Tutors
          </Typography>

          <Typography variant="h4" className="text-textGrey dark:text-gray-400 mt-3">
            Learn from our top-rated educators with years of teaching experience.
          </Typography>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8 text-center text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/20">
            Loading featured tutors...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-800 dark:bg-red-900/20">
            {error}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm hover:shadow-lg border border-transparent dark:border-slate-800 transition-all duration-300 flex flex-col gap-4 items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                    {tutor.firstName?.[0] || "T"}
                    {tutor.lastName?.[0] || ""}
                  </div>

                  <Typography variant="h4" className="font-semibold text-textBlack dark:text-white text-center">
                    {tutor.firstName} {tutor.lastName}
                  </Typography>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {(Array.isArray(tutor.subjects) ? tutor.subjects : []).slice(0, 3).map((sub) => (
                      <span
                        key={sub}
                        className="text-xs bg-lightGreyBG dark:bg-slate-800 px-2 py-1 rounded-full text-textGrey dark:text-gray-300"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>

                  <Typography className="text-textGrey dark:text-gray-400 text-sm">
                    ⭐ {tutor.rating ?? 0} ({tutor.totalReviews ?? 0})
                  </Typography>

                  <Typography className="font-semibold text-textBlack dark:text-white">
                    PKR {tutor.hourlyFee || "—"}/hour
                  </Typography>

                  <Link to={`/dashboard/tutors/${tutor.id}`} className="w-full">
                    <Btn variant="blue" className="w-full">
                      View Profile
                    </Btn>
                  </Link>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-5">
              <Link to="/teachers">
                <button className="bg-primary text-white px-6 py-3 rounded-full hover:opacity-90 transition">
                  View All Tutors
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default FeaturedTutors;
