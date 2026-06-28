/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiSearch, FiStar } from "react-icons/fi";
import { studentApi } from "../../services/apiService";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";
import { getImageUrl } from "../../utils/getImageUrl";

const input = "h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

function FindTutors() {
  const [filters, setFilters] = useState({ search: "", subject: "", city: "", province: "", teachingMode: "", minFee: "", maxFee: "", minExperience: "", minRating: "" });
  const [teachers, setTeachers] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const [res, savedRes] = await Promise.all([
      studentApi.findTeachers(filters),
      studentApi.savedTeachers(),
    ]);
    if (res.ok) {
      setTeachers(res.data || []);
      if (savedRes.ok) {
        setSavedIds(new Set((savedRes.data || []).map((teacher) => Number(teacher.id))));
      }
      setError("");
    } else setError(res.message || "Unable to load tutors.");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (event) => setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const toggleSaveTeacher = async (teacherId) => {
    const numericId = Number(teacherId);
    setSavingId(teacherId);
    const alreadySaved = savedIds.has(numericId);
    const nextSaved = new Set(savedIds);
    if (alreadySaved) nextSaved.delete(numericId);
    else nextSaved.add(numericId);
    setSavedIds(nextSaved);

    const res = alreadySaved
      ? await studentApi.removeSavedTeacher(teacherId)
      : await studentApi.saveTeacher(teacherId);
    setSavingId(null);
    if (!res.ok) {
      setSavedIds(savedIds);
      setError(res.message || "Unable to save teacher.");
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader title="Find Tutors" description="Search and filter verified teachers by subject, city, fee, experience, and rating." />
      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input name="search" value={filters.search} onChange={update} placeholder="Search by name or qualification" className={`${input} w-full pl-9`} />
          </div>
          <input name="subject" value={filters.subject} onChange={update} placeholder="Subject" className={input} />
          <input name="city" value={filters.city} onChange={update} placeholder="City" className={input} />
          <input name="province" value={filters.province} onChange={update} placeholder="Province" className={input} />
          <select name="teachingMode" value={filters.teachingMode} onChange={update} className={input}>
            <option value="">Teaching mode</option>
            <option value="online">Online</option>
            <option value="home">Home</option>
            <option value="both">Both</option>
          </select>
          <input name="minFee" value={filters.minFee} onChange={update} placeholder="Min fee" type="number" className={input} />
          <input name="maxFee" value={filters.maxFee} onChange={update} placeholder="Max fee" type="number" className={input} />
          <input name="minExperience" value={filters.minExperience} onChange={update} placeholder="Experience" type="number" className={input} />
          <input name="minRating" value={filters.minRating} onChange={update} placeholder="Rating" type="number" className={input} />
          <button onClick={load} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Apply Filters</button>
        </div>
      </Card>

      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : teachers.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teachers.map((teacher) => (
            <Card key={teacher.id}>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {getImageUrl(teacher.profileImage) ? (
                    <img
                      src={getImageUrl(teacher.profileImage)}
                      alt={`${teacher.firstName} ${teacher.lastName}`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <>
                      {teacher.firstName?.[0]}{teacher.lastName?.[0]}
                    </>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-950 dark:text-white">{teacher.firstName} {teacher.lastName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.qualification || "Teacher"} • {teacher.experience || 0} yrs</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-amber-600"><FiStar /> {teacher.rating || 0} ({teacher.reviewsCount || 0})</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(Array.isArray(teacher.subjects) ? teacher.subjects : []).slice(0, 3).map((subject) => (
                  <span key={subject} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs dark:bg-slate-800">{subject}</span>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold">PKR {teacher.hourlyFee || 0}/hour</p>
              <div className="mt-4 flex gap-2">
                <Link to={`/student/tutors/${teacher.id}`} className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white">View Profile</Link>
                <button
                  type="button"
                  onClick={() => toggleSaveTeacher(teacher.id)}
                  disabled={savingId === teacher.id}
                  className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                    savedIds.has(Number(teacher.id))
                      ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/30"
                      : "dark:border-slate-700"
                  }`}
                  aria-label={savedIds.has(Number(teacher.id)) ? "Remove saved teacher" : "Save teacher"}
                >
                  <FiBookmark className={savedIds.has(Number(teacher.id)) ? "fill-current" : ""} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : <EmptyState title="No tutors found" description="Try widening your filters." />}
    </div>
  );
}

export default FindTutors;
