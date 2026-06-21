import { useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import { notificationApi } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";

const typeLabels = {
  application: "Job application",
  job: "Course update",
  review: "Review",
  system: "Admin alert",
  message: "Message received",
};

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    const [listRes, unreadRes] = await Promise.all([
      notificationApi.getAll(),
      notificationApi.getUnreadCount(user.id),
    ]);
    if (listRes.ok) setNotifications(listRes.data || []);
    if (unreadRes.ok) setUnreadCount(unreadRes.data?.count || 0);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markRead = async (id) => {
    await notificationApi.markAsRead(id);
    await load();
  };

  const markAllRead = async () => {
    await notificationApi.markAllAsRead();
    await load();
  };

  const remove = async (id) => {
    await notificationApi.delete(id);
    await load();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-label="Notifications"
      >
        <FiBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 divide-y overflow-hidden rounded-xl border bg-white shadow-lg dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between p-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Notifications</h4>
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-72 overflow-auto">
            {loading && (
              <div className="space-y-2 p-3">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-14 animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />
                ))}
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No notifications yet.</div>
            )}

            {!loading &&
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-gray-100 p-3 last:border-0 dark:border-slate-800 ${
                    notification.isRead ? "opacity-75" : "bg-blue-50/40 dark:bg-blue-950/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => !notification.isRead && markRead(notification.id)}
                      className="flex-1 text-left"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        {typeLabels[notification.type] || notification.type || "Update"}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{notification.message}</p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(notification.id)}
                      className="text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
