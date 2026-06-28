/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMessageSquare, FiStar, FiTrash2 } from "react-icons/fi";
import { studentApi } from "../../services/apiService";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";
import { getImageUrl } from "../../utils/getImageUrl";

function SavedTutors() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await studentApi.savedTeachers();
    if (res.ok) {
      setTeachers(res.data || []);
      setError("");
    } else {
      setError(res.message || "Unable to load saved teachers.");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    const res = await studentApi.removeSavedTeacher(id);
    if (res.ok) {
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
    }
  };

  const message = async (teacher) => {
    await studentApi.sendMessage({
      receiverId: teacher.id,
      receiverRole: "teacher",
      body: "Hi, I would like to discuss tutoring with you.",
    });
    navigate("/student/messages");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Saved Teachers" description="Your saved teacher shortlist." />
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : teachers.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teachers.map((teacher) => (
            <Card key={teacher.id}>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 font-bold text-white">
                  {getImageUrl(teacher.profileImage) ? (
                    <img
                      src={getImageUrl(teacher.profileImage)}
                      alt={`${teacher.firstName} ${teacher.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    `${teacher.firstName?.[0] || ""}${teacher.lastName?.[0] || ""}` || "T"
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-950 dark:text-white">
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {teacher.qualification || "Teacher"}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-amber-600">
                    <FiStar /> {teacher.rating || 0}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  Subject:{" "}
                  {(Array.isArray(teacher.subjects) ? teacher.subjects[0] : teacher.subjects) ||
                    "Not added"}
                </p>
                <p>City: {teacher.city || "Not added"}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`/student/tutors/${teacher.id}`}
                  className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  View Profile
                </Link>
                <button
                  type="button"
                  onClick={() => message(teacher)}
                  className="rounded-lg border px-3 py-2 text-sm font-semibold dark:border-slate-700"
                  title="Message"
                >
                  <FiMessageSquare />
                </button>
                <button
                  type="button"
                  onClick={() => remove(teacher.id)}
                  className="rounded-lg border px-3 py-2 text-sm font-semibold text-red-600 dark:border-slate-700"
                  title="Remove"
                >
                  <FiTrash2 />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No saved teachers" description="Save teachers from the Find Tutors page." />
      )}
    </div>
  );
}

export default SavedTutors;
