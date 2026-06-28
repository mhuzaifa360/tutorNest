
import { useEffect, useState } from "react";
import Typography from "../common/Typography";
import { FaStar } from "react-icons/fa";
import { studentApi } from "../../services/apiService";
import { getImageUrl } from "../../utils/getImageUrl";

function StudentReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      const res = await studentApi.reviews({ limit: 6 });
      if (res.ok) {
        setReviews(res.data || []);
        setError("");
      } else {
        setReviews([]);
        setError(res.message || "Unable to load reviews.");
      }
      setLoading(false);
    };
    loadReviews();
  }, []);

  return (
    <section className="w-full py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="text-center mb-12">
          <Typography variant="h2" className="font-bold text-textBlack dark:text-white">
            What Our Students Say
          </Typography>

          <Typography variant="p" className="text-textGrey dark:text-gray-400 mt-3">
            Real success stories from students who achieved their goals with TutorNest.
          </Typography>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8 text-center text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/20">
            Loading reviews...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-800 dark:bg-red-900/20">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((item) => {
              const studentName =
                `${item.student?.firstName || ""} ${item.student?.lastName || ""}`.trim() ||
                "Student";
              const teacherName =
                `${item.teacher?.firstName || ""} ${item.teacher?.lastName || ""}`.trim() ||
                "Teacher";
              const studentImage = getImageUrl(item.student?.profileImage);

              return (
              <div
                key={item.id}
                className="bg-lightGreyBG dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-5"
              >
                <div className="flex gap-1 text-yellow-400">
                  {Array.from({ length: Number(item.rating || 0) }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                <Typography className="text-textGrey dark:text-gray-300 leading-relaxed" variant="p">
                  "{item.comment || item.description || item.text || "No review text available."}"
                </Typography>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 overflow-hidden rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {studentImage ? (
                      <img src={studentImage} alt={studentName} className="h-full w-full object-cover" />
                    ) : (
                      studentName.charAt(0)
                    )}
                  </div>
                  <div>
                    <Typography className="font-semibold text-textBlack dark:text-white">
                      {studentName}
                    </Typography>
                    <Typography className="text-sm text-textGrey dark:text-gray-400">
                      Reviewed {teacherName} - {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default StudentReviews;
