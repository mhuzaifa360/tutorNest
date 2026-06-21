import { useEffect, useState } from "react";
import { studentApi } from "../../services/apiService";
import PageContainer from "../../components/layout/PageContainer";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ teacherId: "", rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await studentApi.reviews();
    if (res.ok) {
      setReviews((res.data || []).filter(Boolean));
      setError("");
    } else setError(res.message || "Unable to load reviews.");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const res = await studentApi.createReview({ ...form, rating: Number(form.rating) });
    if (res.ok) {
      setForm({ teacherId: "", rating: 5, comment: "" });
      load();
    } else setError(res.message || "Unable to submit review.");
  };

  return (
    <PageContainer className="space-y-5 animate-fade-in">
      <PageHeader title="Reviews" description="Rate teachers and write feedback after learning sessions." />
      <Card>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
          <input required type="number" placeholder="Teacher ID" value={form.teacherId} onChange={(e) => setForm((p) => ({ ...p, teacherId: e.target.value }))} className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
          <select value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))} className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white">
            {[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
          </select>
          <input required placeholder="Write review" value={form.comment} onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))} className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white md:col-span-2" />
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:w-fit">Submit Review</button>
        </form>
      </Card>
      {loading ? <LoadingState /> : error ? <ErrorState message={error} onRetry={load} /> : reviews.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {reviews.map((review) => (
            <Card key={review.id}>
              <p className="font-bold text-gray-950 dark:text-white">{review.rating}/5 stars</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
              <p className="mt-2 text-xs text-gray-500">Teacher #{review.teacherId}</p>
            </Card>
          ))}
        </div>
      ) : <EmptyState title="No reviews yet" description="Submit your first teacher review above." />}
    </PageContainer>
  );
}

export default Reviews;
