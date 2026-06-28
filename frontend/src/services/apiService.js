import { apiRequest, apiMultipartRequest } from "./httpService";

const buildQuery = (params = {}) =>
  new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  ).toString();

const apiRequestWithParams = (url, params = {}, options = {}) => {
  const query = buildQuery(params);
  return apiRequest(`${url}${query ? `?${query}` : ""}`, options);
};

// ==================
// AUTH API
// ==================

export const authApi = {
  login: (role, body) => {
    if (role === "admin") {
      return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ ...body, role }),
      });
    }

    return apiRequest(`/auth/${role}/login`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  signupStudent: (formData) => apiMultipartRequest("/auth/student/signup", formData),
  signupTeacher: (formData) => apiMultipartRequest("/auth/teacher/signup", formData),
};

// ==================
// PROFILE API
// ==================

export const profileApi = {
  me: () => apiRequest("/profile/me"),
  files: () => apiRequest("/upload/files"),

  update: (body) =>
    apiRequest("/profile/update", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  changePassword: (body) =>
    apiRequest("/profile/change-password", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteAccount: () =>
    apiRequest("/profile/delete-account", {
      method: "DELETE",
    }),

  uploadProfileImage: (formData) => apiMultipartRequest("/upload/profile-image", formData),
  uploadDocument: (formData) => apiMultipartRequest("/upload/document", formData),
  deleteFile: (id) => apiRequest(`/upload/delete/${id}`, { method: "DELETE" }),
};

// ==================
// ADMIN API
// ==================

export const adminApi = {
  overview: () => apiRequest("/admin/overview"),
  users: () => apiRequest("/admin/users"),
  deleteUser: (role, id) =>
    apiRequest(`/admin/users/${role}/${id}`, { method: "DELETE" }),

  students: () => apiRequest("/admin/students"),
  teachers: () => apiRequest("/admin/teachers"),
  setTeacherStatus: (id, status) =>
    apiRequest(`/admin/teachers/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  teacherDocuments: (teacherId) => apiRequest(`/upload/teachers/${teacherId}/documents`),

  courses: () => apiRequest("/admin/courses"),
  updateCourse: (id, body) =>
    apiRequest(`/admin/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteCourse: (id) =>
    apiRequest(`/admin/courses/${id}`, { method: "DELETE" }),

  jobs: () => apiRequest("/admin/jobs"),
  updateJob: (id, body) =>
    apiRequest(`/admin/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteJob: (id) => apiRequest(`/admin/jobs/${id}`, { method: "DELETE" }),

  applications: () => apiRequest("/admin/applications"),
  updateApplication: (id, status) =>
    apiRequest(`/admin/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  reviews: () => apiRequest("/admin/reviews"),
  deleteReview: (id) =>
    apiRequest(`/admin/reviews/${id}`, { method: "DELETE" }),
};

// ==================
// STUDENT API
// ==================

export const studentApi = {
  getProfile: (id) => apiRequest(`/students/getSingleStudent/${id}`),
  overview: () => apiRequest("/student/overview"),

  updateProfile: (id, body) =>
    apiRequest(`/students/updateStudent/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  getAll: () => apiRequest("/students/getStudents"),

  delete: (id) =>
    apiRequest(`/students/deleteStudent/${id}`, { method: "DELETE" }),

  getMyCourses: () => apiRequest("/students/my-courses"),

  findTeachers: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== "" && value !== null && value !== undefined)
    ).toString();
    return apiRequest(`/teachers${query ? `?${query}` : ""}`);
  },

  getTeacher: (id) => apiRequest(`/teachers/${id}`),
  savedTeachers: () => apiRequest("/student/saved-teachers"),
  saveTeacher: (teacherId) =>
    apiRequest("/student/saved-teachers", {
      method: "POST",
      body: JSON.stringify({ teacherId }),
    }),
  removeSavedTeacher: (teacherId) =>
    apiRequest(`/student/saved-teachers/${teacherId}`, { method: "DELETE" }),

  courses: () => apiRequest("/courses/getCourses"),
  enroll: (courseId) =>
    apiRequest("/enrollments/enroll", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    }),
  enrolledCourses: () => apiRequest("/enrollments/my-courses"),
  hireTeacher: (teacherId, message) =>
    apiRequest("/hire-requests", {
      method: "POST",
      body: JSON.stringify({ teacherId, message }),
    }),

  jobs: () => apiRequest("/student/jobs"),
  createJob: (body) =>
    apiRequest("/jobs", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateJob: (id, body) =>
    apiRequest(`/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  deleteJob: (id) => apiRequest(`/jobs/${id}`, { method: "DELETE" }),

  applications: () => apiRequest("/applications/student"),
  updateApplication: (id, status) =>
    apiRequest(`/applications/${id}/${status === "accepted" ? "accept" : "reject"}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  conversations: () => apiRequest("/student/conversations"),
  messages: (role, id) => apiRequest(`/student/messages/${role}/${id}`),
  sendMessage: (body) =>
    apiRequest("/student/messages", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  notifications: () => apiRequest("/notifications/getNotifications"),
  markNotificationRead: (id) =>
    apiRequest(`/notifications/markAsRead/${id}`, { method: "PUT" }),
  deleteNotification: (id) =>
    apiRequest(`/notifications/deleteNotification/${id}`, { method: "DELETE" }),

  reviews: (params = {}) => apiRequestWithParams("/reviews/getReviews", params),
  createReview: (body) =>
    apiRequest("/reviews/createReview", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ==================
// SEARCH API
// ==================

export const searchApi = {
  teachers: (params = {}) => apiRequestWithParams("/search/teachers", params),
  courses: (params = {}) => apiRequestWithParams("/search/courses", params),
  jobs: (params = {}) => apiRequestWithParams("/search/jobs", params),
};

// ==================
// NOTIFICATION API
// ==================

export const notificationApi = {
  getAll: () => apiRequest("/notifications"),
  getUnreadCount: () => apiRequest("/notifications/unread-count"),
  markAsRead: (id) => apiRequest(`/notifications/markAsRead/${id}`, { method: "PUT" }),
  markAllAsRead: () => apiRequest("/notifications/markAllAsRead", { method: "PUT" }),
  delete: (id) =>
    apiRequest(`/notifications/deleteNotification/${id}`, { method: "DELETE" }),
};

// ==================
// MESSAGES API
// ==================

export const messagesApi = {
  send: (body) =>
    apiRequest("/messages/send", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  conversations: (userId) => apiRequest(`/messages/conversations/${userId}`),
  getConversation: (conversationId) => apiRequest(`/messages/${conversationId}`),
};

// ==================
// MEETING API
// ==================

export const meetingApi = {
  list: () => apiRequest("/meetings"),
  schedule: (body) =>
    apiRequest("/meetings", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id, body) =>
    apiRequest(`/meetings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};

// ==================
// DASHBOARD API
// ==================

export const dashboardApi = {
  student: (id) => apiRequest(`/dashboard/student/${id}`),
  teacher: (id) => apiRequest(`/dashboard/teacher/${id}`),
  admin: () => apiRequest("/dashboard/admin"),
};

// ==================
// TEACHER API
// ==================

export const teacherApi = {
  getProfile: (id) => apiRequest(`/teachers/getTeacherRating/${id}`),

  updateProfile: (id, body) =>
    apiRequest(`/teachers/updateTeacher/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  getAll: () => apiRequest("/teachers/getTeachers"),

  getRanked: () => apiRequest("/teachers/ranked"),

  delete: (id) =>
    apiRequest(`/teachers/deleteTeacher/${id}`, { method: "DELETE" }),

  jobs: (params = {}) => apiRequestWithParams("/jobs", params),
  job: (id) => apiRequest(`/jobs/${id}`),
  applyJob: (body) =>
    apiRequest("/applications", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  applications: () => apiRequest("/applications/teacher"),
};

// ==================
// COURSE API
// ==================

export const courseApi = {
  create: (body) =>
    apiRequest("/courses/createCourse", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getAll: () => apiRequest("/courses/getCourses"),

  getOne: (id) => apiRequest(`/courses/getSingleCourse/${id}`),

  update: (id, body) =>
    apiRequest(`/courses/updateCourse/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (id) =>
    apiRequest(`/courses/deleteCourse/${id}`, { method: "DELETE" }),
};

// ==================
// JOB API
// ==================

export const jobApi = {
  create: (body) =>
    apiRequest("/jobs", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getAll: (params = {}) => apiRequestWithParams("/jobs", params),

  getOne: (id) => apiRequest(`/jobs/${id}`),

  getRanked: () => apiRequest("/jobs/ranked"),

  update: (id, body) =>
    apiRequest(`/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (id) =>
    apiRequest(`/jobs/${id}`, { method: "DELETE" }),
};

// ==================
// APPLICATION API
// ==================

export const applicationApi = {
  apply: (body) =>
    apiRequest("/applications", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getAll: () => apiRequest("/applications"),

  getOne: (id) => apiRequest(`/applications/${id}`),
  getStudent: () => apiRequest("/applications/student"),
  getTeacher: () => apiRequest("/applications/teacher"),
  accept: (id) => apiRequest(`/applications/${id}/accept`, { method: "PATCH" }),
  reject: (id) => apiRequest(`/applications/${id}/reject`, { method: "PATCH" }),

  updateStatus: (id, status) =>
    apiRequest(`/applications/${id}/${status === "accepted" ? "accept" : "reject"}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id) =>
    apiRequest(`/applications/deleteApplication/${id}`, { method: "DELETE" }),
};
