import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiCalendar,
  FiEdit3,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
};

const toList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return "";
  if (profileImage.startsWith("http") || profileImage.startsWith("/")) {
    return profileImage;
  }
  return `http://localhost:5000/uploads/${profileImage}`;
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <div className="mt-0.5 text-blue-600 dark:text-blue-400">{icon}</div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
        {value || "Not added"}
      </p>
    </div>
  </div>
);

const ChipList = ({ items }) => {
  const list = toList(items);

  if (!list.length) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No subjects added yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {list.map((item) => (
        <span
          key={item}
          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

function Profile() {
  const { user } = useAuth();

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    "TutorNest User";
  const profileImageUrl = getProfileImageUrl(user?.profileImage);

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Profile
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-950 dark:text-white">
              Your account details
            </h1>
          </div>

          <Link
            to="/profile/edit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <FiEdit3 />
            Edit Profile
          </Link>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-sm">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={fullName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                user?.initials || "U"
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                  {fullName}
                </h2>
                <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700 dark:bg-slate-800 dark:text-gray-300">
                  {user?.role || "user"}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Manage how TutorNest shows your information across dashboards,
                messages, and learning activity.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <InfoRow icon={<FiMail />} label="Email" value={user?.email} />
          <InfoRow icon={<FiPhone />} label="Phone" value={user?.mobile} />
          <InfoRow
            icon={<FiMapPin />}
            label="Location"
            value={[user?.city, user?.province].filter(Boolean).join(", ")}
          />
          <InfoRow icon={<FiShield />} label="Role" value={user?.role} />
          <InfoRow icon={<FiCalendar />} label="Joined" value={formatDate(user?.createdAt)} />
          {user?.role === "student" && (
            <InfoRow icon={<FiBookOpen />} label="Class Level" value={user?.classLevel} />
          )}
        </div>

        {user?.role === "teacher" && (
          <div className="grid gap-4 lg:grid-cols-3">
            <InfoRow icon={<FiUser />} label="Qualification" value={user?.qualification} />
            <InfoRow icon={<FiCalendar />} label="Experience" value={`${user?.experience || 0} years`} />
            <InfoRow icon={<FiShield />} label="Hourly Fee" value={user?.hourlyFee ? `PKR ${user.hourlyFee}` : ""} />
          </div>
        )}

        {(user?.role === "teacher" || user?.role === "student") && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">Subjects</h3>
            <div className="mt-4">
              <ChipList items={user?.subjects} />
            </div>
          </div>
        )}

        {user?.role === "teacher" && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-gray-950 dark:text-white">Bio</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {user?.bio || "No bio added yet."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Profile;
