import { getToken } from "./authService";

const API_BASE = "http://localhost:5000/v1";

/**
 * Creates headers with JWT authorization.
 */
const authHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Safe JSON response parser — prevents "undefined is not valid JSON" crash.
 */
const safeJson = async (response) => {
  try {
    const text = await response.text();
    if (!text) return { success: false, message: "Empty response" };
    return JSON.parse(text);
  } catch {
    return { success: false, message: "Invalid server response" };
  }
};

/**
 * Generic API request wrapper with error handling.
 */
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: authHeaders(),
      ...options,
    });
    const data = await safeJson(response);
    return { ok: response.ok, ...data };
  } catch (error) {
    return { ok: false, success: false, message: error.message || "Network error" };
  }
};

// ==================
// STUDENT API
// ==================

export const studentApi = {
  getProfile: (id) => apiRequest(`/students/getSingleStudent/${id}`),

  updateProfile: (id, body) =>
    apiRequest(`/students/updateStudent/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  getAll: () => apiRequest("/students/getStudents"),

  delete: (id) =>
    apiRequest(`/students/deleteStudent/${id}`, { method: "DELETE" }),

  getMyCourses: () => apiRequest("/students/my-courses"),
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
    apiRequest("/jobs/createJob", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getAll: () => apiRequest("/jobs/getJobs"),

  getOne: (id) => apiRequest(`/jobs/getSingleJob/${id}`),

  getRanked: () => apiRequest("/jobs/ranked"),

  update: (id, body) =>
    apiRequest(`/jobs/updateJob/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (id) =>
    apiRequest(`/jobs/deleteJob/${id}`, { method: "DELETE" }),
};

// ==================
// APPLICATION API
// ==================

export const applicationApi = {
  apply: (body) =>
    apiRequest("/applications/apply", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getAll: () => apiRequest("/applications/getApplications"),

  getOne: (id) => apiRequest(`/applications/getSingleApplication/${id}`),

  updateStatus: (id, status) =>
    apiRequest(`/applications/updateApplication/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  delete: (id) =>
    apiRequest(`/applications/deleteApplication/${id}`, { method: "DELETE" }),
};
