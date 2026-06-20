import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiBookmark, FiMessageSquare, FiStar, FiUserCheck } from "react-icons/fi";
import { studentApi } from "../../services/apiService";
import { Card, EmptyState, ErrorState, LoadingState } from "../../components/student/StudentStates";

function TeacherProfile() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await studentApi.getTeacher(id);
    if (res.ok) {
      setTeacher(res.data);
      setError("");
    } else setError(res.message || "Unable to load teacher profile.");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!teacher) return <EmptyState title="Teacher not found" />;

  return (
    <div className="space-y-5 animate-fade-in">
      <Card>
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            {teacher.firstName?.[0]}{teacher.lastName?.[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-950 dark:text-white">{teacher.firstName} {teacher.lastName}</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{teacher.qualification} • {teacher.experience || 0} years experience</p>
            <p className="mt-2 flex items-center gap-1 text-amber-600"><FiStar /> {teacher.rating || 0} ({teacher.reviewsCount || 0} reviews)</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => studentApi.saveTeacher(teacher.id)} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold dark:border-slate-700"><FiBookmark /> Save</button>
            <button onClick={() => studentApi.sendMessage({ receiverId: teacher.id, receiverRole: "teacher", body: "Hi, I am interested in learning with you." })} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold dark:border-slate-700"><FiMessageSquare /> Message</button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"><FiUserCheck /> Hire Teacher</button>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-bold text-gray-950 dark:text-white">Bio</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{teacher.bio || "No bio added yet."}</p>
        </Card>
        <Card>
          <h2 className="font-bold text-gray-950 dark:text-white">Details</h2>
          <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <p>Teaching mode: {teacher.teachingMode || "-"}</p>
            <p>Hourly fee: PKR {teacher.hourlyFee || 0}</p>
            <p>Location: {[teacher.city, teacher.province].filter(Boolean).join(", ") || "-"}</p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-bold text-gray-950 dark:text-white">Subjects</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(Array.isArray(teacher.subjects) ? teacher.subjects : []).map((subject) => (
            <span key={subject} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{subject}</span>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold text-gray-950 dark:text-white">Reviews</h2>
        {teacher.reviews?.length ? teacher.reviews.map((review) => (
          <div key={review.id} className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-slate-800">
            <p className="text-sm text-amber-600">{review.rating}/5</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
          </div>
        )) : <EmptyState title="No reviews yet" description="Be the first to review this teacher after a session." />}
      </Card>
    </div>
  );
}

export default TeacherProfile;
