import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { notificationApi } from "../../services/apiService";
import PageContainer from "../../components/layout/PageContainer";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../../components/student/StudentStates";

function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await notificationApi.getAll();
    if (res.ok) {
      setNotifications(res.data || []);
      setError("");
    } else {
      setError(res.message || "Unable to load notifications.");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await notificationApi.markAsRead(id);
    load();
  };

  const markAllRead = async () => {
    await notificationApi.markAllAsRead();
    load();
  };

  const remove = async (id) => {
    await notificationApi.delete(id);
    load();
  };

  return (
    <PageContainer className="animate-fade-in space-y-5">
      <PageHeader
        title="Notifications"
        description="New applications, enrollments, messages, and system updates."
        action={
          notifications.some((item) => !item.isRead) ? (
            <button
              type="button"
              onClick={markAllRead}
              className="rounded-lg border px-4 py-2 text-sm font-semibold dark:border-slate-700"
            >
              Mark all read
            </button>
          ) : null
        }
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : notifications.length ? (
        <div className="space-y-3">
          {notifications.map((item) => (
            <Card key={item.id} className={item.isRead ? "opacity-70" : ""}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <p className="font-bold text-gray-950 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.message}</p>
                  <p className="mt-1 text-xs uppercase text-blue-600">{item.type}</p>
                </div>
                <div className="flex gap-2">
                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => markRead(item.id)}
                      className="rounded-lg border px-3 py-2 text-sm font-semibold dark:border-slate-700"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No notifications" description="You are all caught up." />
      )}
    </PageContainer>
  );
}

export default Notifications;
