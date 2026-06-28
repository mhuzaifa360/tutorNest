/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiBookmark, FiMessageSquare, FiStar, FiUserCheck, FiX } from "react-icons/fi";
import { studentApi } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";
import { Card, EmptyState, ErrorState, LoadingState } from "../../components/student/StudentStates";
import { getImageUrl } from "../../utils/getImageUrl";

function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const [hireMessage, setHireMessage] = useState("Hi, I would like to hire you for tutoring.");

  const load = async () => {
    setLoading(true);
    const res = await studentApi.getTeacher(id);
    if (res.ok) {
      setTeacher(res.data);
      setError("");
    } else {
      setError(res.message || "Unable to load teacher profile.");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!teacher) return <EmptyState title="Teacher not found" />;

  const isStudent = user?.role?.toLowerCase() === "student";
  const profileImageUrl = getImageUrl(teacher.profileImage);

  const toggleSave = async () => {
    if (!isStudent) return;
    setSending(true);
    const nextSaved = !teacher.isSaved;
    setTeacher((prev) => ({ ...prev, isSaved: nextSaved }));
    const res = nextSaved
      ? await studentApi.saveTeacher(teacher.id)
      : await studentApi.removeSavedTeacher(teacher.id);
    if (res.ok) {
      setStatusMessage(nextSaved ? "Teacher saved." : "Teacher removed from saved list.");
    } else {
      setTeacher((prev) => ({ ...prev, isSaved: !nextSaved }));
      setStatusMessage(res.message || "Could not update saved teacher.");
    }
    setSending(false);
  };

  const handleMessage = async () => {
    if (!isStudent) return;
    setSending(true);
    const res = await studentApi.sendMessage({
      receiverId: teacher.id,
      receiverRole: "teacher",
      body: "Hi, I am interested in learning with you.",
    });
    setSending(false);
    if (res.ok) {
      navigate("/student/messages");
    } else {
      setStatusMessage(res.message || "Unable to open chat.");
    }
  };

  const handleHire = async () => {
    setSending(true);
    const res = await studentApi.hireTeacher(teacher.id, hireMessage);
    setSending(false);
    if (res.ok) {
      setHireOpen(false);
      setStatusMessage(res.message || "Hire request sent successfully.");
    } else {
      setStatusMessage(res.message || "Unable to send hire request.");
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <Card>
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-2xl font-bold text-white">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={`${teacher.firstName} ${teacher.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              `${teacher.firstName?.[0] || ""}${teacher.lastName?.[0] || ""}` || "T"
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-950 dark:text-white">
              {teacher.firstName} {teacher.lastName}
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {teacher.qualification || "Teacher"} - {teacher.experience || 0} years experience
            </p>
            <p className="mt-2 flex items-center gap-1 text-amber-600">
              <FiStar /> {teacher.rating || 0} ({teacher.reviewsCount || 0} reviews)
            </p>
            {statusMessage && (
              <p className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-300">
                {statusMessage}
              </p>
            )}
          </div>
          {isStudent && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={toggleSave}
                disabled={sending}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                  teacher.isSaved
                    ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/30"
                    : "dark:border-slate-700"
                }`}
              >
                <FiBookmark className={teacher.isSaved ? "fill-current" : ""} />
                {teacher.isSaved ? "Remove Saved" : "Save Teacher"}
              </button>
              <button
                type="button"
                onClick={handleMessage}
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700"
              >
                <FiMessageSquare /> Message
              </button>
              <button
                type="button"
                onClick={() => setHireOpen(true)}
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                <FiUserCheck /> Hire Me
              </button>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="font-bold text-gray-950 dark:text-white">Bio</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
            {teacher.bio || "No bio added yet."}
          </p>
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
            <span
              key={subject}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {subject}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold text-gray-950 dark:text-white">Reviews</h2>
        {teacher.reviews?.length ? (
          teacher.reviews.map((review) => {
            const studentName =
              `${review.student?.firstName || ""} ${review.student?.lastName || ""}`.trim() ||
              "Student";
            const studentImage = getImageUrl(review.student?.profileImage);

            return (
              <div key={review.id} className="mt-3 rounded-lg border border-gray-200 p-3 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-xs font-bold text-white">
                    {studentImage ? (
                      <img src={studentImage} alt={studentName} className="h-full w-full object-cover" />
                    ) : (
                      studentName.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-950 dark:text-white">{studentName}</p>
                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-amber-600">{review.rating}/5</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
              </div>
            );
          })
        ) : (
          <EmptyState title="No reviews yet" description="Be the first to review this teacher after a session." />
        )}
      </Card>

      {hireOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-gray-950 dark:text-white">Send hire request</h3>
              <button
                type="button"
                onClick={() => setHireOpen(false)}
                className="rounded-lg border p-2 dark:border-slate-700"
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>
            <textarea
              value={hireMessage}
              onChange={(event) => setHireMessage(event.target.value)}
              rows={5}
              className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-950 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setHireOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleHire}
                disabled={sending || !hireMessage.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherProfile;
