/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  FiBookOpen,
  FiCalendar,
  FiEdit3,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiTrash2,
  FiUpload,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { profileApi } from "../services/apiService";
import PageContainer from "../components/layout/PageContainer";
import { ErrorState, LoadingState } from "../components/student/StudentStates";
import { getImageUrl } from "../utils/getImageUrl";

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

const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const fileUrl = (file) => getImageUrl(file?.url);

const isPreviewable = (file) =>
  file?.mimeType?.startsWith("image/") || file?.mimeType === "application/pdf";

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <div className="mt-0.5 text-blue-600 dark:text-blue-400">{icon}</div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">
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
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({});
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);

  const load = async () => {
    setLoading(true);
    const res = await profileApi.me();
    const profileUser = res.user || res.data?.user || res.data || null;
    if (res.ok && profileUser) {
      setUser(profileUser);
      updateUser(profileUser);
      const nextFiles = res.data?.files || profileUser.files || [];
      setFiles(nextFiles);
      setError("");
    } else {
      setError(res.message || "Unable to load profile.");
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [updateUser]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const openEditor = () => {
    setProfileImagePreview(getImageUrl(user?.profileImage));
    setProfileImageFile(null);
    setDocumentFiles([]);
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      mobile: user?.mobile || "",
      province: user?.province || "",
      city: user?.city || "",
      gender: user?.gender || "",
      subjects: Array.isArray(user?.subjects)
        ? user.subjects.join(", ")
        : user?.subjects || "",
      bio: user?.bio || "",
      qualification: user?.qualification || "",
      experience: user?.experience || "",
      hourlyFee: user?.hourlyFee || "",
    });
    setEditing(true);
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setToast("Please select a valid image file");
      return;
    }
    const preview = await readImageFile(file);
    setProfileImagePreview(preview);
    setProfileImageFile(file);
  };

  const refreshFiles = async () => {
    const res = await profileApi.files();
    if (res.ok) {
      setFiles(res.data?.files || []);
    }
  };

  const handleDocumentChange = (event) => {
    setDocumentFiles(Array.from(event.target.files || []));
    setToast("");
  };

  const deleteDocument = async (id) => {
    const res = await profileApi.deleteFile(id);
    if (res.ok) {
      setFiles((prev) => prev.filter((file) => file.id !== id));
      setToast("Document deleted");
    } else {
      setToast(res.message || "Unable to delete document");
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    const payload = {
      ...form,
      subjects: form.subjects
        ? form.subjects.split(",").map((subject) => subject.trim()).filter(Boolean)
        : [],
    };

    let uploadedProfileImage = "";
    if (profileImageFile) {
      const formData = new FormData();
      formData.append("file", profileImageFile);
      const uploadRes = await profileApi.uploadProfileImage(formData);
      if (!uploadRes.ok) {
        setToast(uploadRes.message || "Profile image upload failed");
        setSaving(false);
        return;
      }
      uploadedProfileImage = uploadRes.data?.url || "";
    }

    for (const file of documentFiles) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await profileApi.uploadDocument(formData);
      if (!uploadRes.ok) {
        setToast(uploadRes.message || `Unable to upload ${file.name}`);
        setSaving(false);
        return;
      }
    }

    const res = await profileApi.update(payload);
    const profileUser = res.user || res.data?.user || res.data || null;
    if (res.ok && profileUser) {
      const nextUser = {
        ...profileUser,
        profileImage: uploadedProfileImage || profileUser.profileImage,
      };
      setUser(nextUser);
      updateUser(nextUser);
      await refreshFiles();
      setEditing(false);
      setToast(res.message || "Profile updated successfully");
    } else if (res.ok) {
      const optimisticUser = {
        ...user,
        ...payload,
        profileImage: uploadedProfileImage || user?.profileImage,
      };
      setUser(optimisticUser);
      updateUser(optimisticUser);
      await refreshFiles();
      setEditing(false);
      setToast(res.message || "Profile updated successfully");
    } else {
      setToast(res.message || "Update failed");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState label="Loading your profile..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState message={error} onRetry={load} />
      </PageContainer>
    );
  }

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.firstName ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}` : user?.name ||
    "TutorNest User";
  const profileImageUrl = getImageUrl(user?.profileImage);
  const documents = files.filter((file) => file.type === "document" || file.type === "verification");

  return (
    <PageContainer className="space-y-6 rounded-3xl bg-gray-50 p-0 dark:bg-slate-950">
      {toast && (
        <div className="fixed right-6 top-24 z-50 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Profile</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-950 dark:text-white">
            Your account details
          </h1>
        </div>

        <button
          type="button"
          onClick={openEditor}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <FiEdit3 />
          Edit Profile
        </button>
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
              <h2 className="text-2xl font-bold text-gray-950 dark:text-white">{fullName}</h2>
              <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700 dark:bg-slate-800 dark:text-gray-300">
                {user?.role || "user"}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Manage how TutorNest shows your information across dashboards, messages, and
              learning activity.
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
        <InfoRow icon={<FiUser />} label="Gender" value={user?.gender} />
        <InfoRow icon={<FiCalendar />} label="Joined" value={formatDate(user?.createdAt)} />
        {user?.role === "student" && (
          <InfoRow icon={<FiBookOpen />} label="Class Level" value={user?.classLevel} />
        )}
      </div>

      {user?.role === "teacher" && (
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoRow icon={<FiUser />} label="Qualification" value={user?.qualification} />
          <InfoRow
            icon={<FiCalendar />}
            label="Experience"
            value={`${user?.experience || 0} years`}
          />
          <InfoRow
            icon={<FiShield />}
            label="Hourly Fee"
            value={user?.hourlyFee ? `PKR ${user.hourlyFee}` : ""}
          />
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

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-950 dark:text-white">User Documents</h3>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-slate-800 dark:text-gray-300">
            {documents.length} uploaded
          </span>
        </div>
        {documents.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 dark:border-slate-800"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {document.mimeType?.startsWith("image/") ? (
                    <img
                      src={fileUrl(document)}
                      alt={document.originalName}
                      className="h-11 w-11 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                      <FiFileText />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {document.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.max(1, Math.round((document.size || 0) / 1024))} KB
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {isPreviewable(document) && (
                    <a
                      href={fileUrl(document)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border p-2 text-gray-600 transition hover:text-blue-600 dark:border-slate-700 dark:text-gray-300"
                      title="Preview"
                    >
                      <FiExternalLink />
                    </a>
                  )}
                  <a
                    href={fileUrl(document)}
                    download={document.originalName}
                    className="rounded-lg border p-2 text-gray-600 transition hover:text-blue-600 dark:border-slate-700 dark:text-gray-300"
                    title="Download"
                  >
                    <FiDownload />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            No verification documents uploaded yet.
          </p>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-slate-900">
            <h3 className="mb-4 text-lg font-bold text-gray-950 dark:text-white">Edit profile</h3>
            <div className="mb-5 flex items-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-slate-800">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-xl font-bold text-white">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  user?.initials || "U"
                )}
              </div>
              <label className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-gray-200">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="mb-5 rounded-lg border border-gray-200 p-4 dark:border-slate-800">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="font-semibold text-gray-950 dark:text-white">Documents</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Upload CNIC, degree, certificates, resume, or verification documents.
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:text-gray-200">
                  <FiUpload />
                  Upload
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleDocumentChange}
                    className="hidden"
                  />
                </label>
              </div>
              {documentFiles.length > 0 && (
                <p className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-300">
                  {documentFiles.length} new document{documentFiles.length > 1 ? "s" : ""} selected
                </p>
              )}
              <div className="mt-4 space-y-2">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3 dark:bg-slate-800/70"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {document.originalName}
                      </p>
                      <a
                        href={fileUrl(document)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-blue-600 dark:text-blue-300"
                      >
                        Open in new tab
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteDocument(document.id)}
                      className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30"
                      title="Delete document"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={form.firstName}
                onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800"
                placeholder="First name"
              />
              <input
                value={form.lastName}
                onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800"
                placeholder="Last name"
              />
              <input
                value={form.mobile}
                onChange={(event) => setForm((prev) => ({ ...prev, mobile: event.target.value }))}
                className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800"
                placeholder="Mobile"
              />
              <select
                value={form.gender}
                onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
                className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                value={form.province}
                onChange={(event) => setForm((prev) => ({ ...prev, province: event.target.value }))}
                className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800"
                placeholder="Province"
              />
              <input
                value={form.city}
                onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800"
                placeholder="City"
              />
              <input
                value={form.subjects}
                onChange={(event) => setForm((prev) => ({ ...prev, subjects: event.target.value }))}
                className="rounded-lg border p-2 md:col-span-2 dark:border-slate-700 dark:bg-slate-800"
                placeholder="Subjects (comma separated)"
              />
              {user?.role === "teacher" && (
                <>
                  <input
                    value={form.qualification}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, qualification: event.target.value }))
                    }
                    className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Qualification"
                  />
                  <input
                    value={form.experience}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, experience: event.target.value }))
                    }
                    className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Experience (years)"
                  />
                  <input
                    value={form.hourlyFee}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, hourlyFee: event.target.value }))
                    }
                    className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Hourly fee"
                  />
                  <textarea
                    value={form.bio}
                    onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                    className="rounded-lg border p-2 md:col-span-2 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Bio"
                    rows={4}
                  />
                </>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border px-4 py-2 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={saveProfile}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default Profile;
