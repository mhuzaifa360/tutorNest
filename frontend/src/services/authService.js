const TOKEN_KEY = "tutornest_token";
const USER_KEY = "tutornest_user";

// ==================
// TOKEN MANAGEMENT
// ==================

// SAVE TOKEN
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// GET TOKEN
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// REMOVE TOKEN
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ==================
// USER MANAGEMENT
// ==================

// SAVE USER
export const setUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    console.warn("Failed to save user to localStorage");
  }
};

// GET USER (safe JSON parsing)
export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch {
    // Remove corrupt data
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

// ==================
// JWT DECODE
// ==================

// DECODE JWT (safe — never crashes)
export const decodeToken = (token) => {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};

// ==================
// CLEAR ALL AUTH
// ==================

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // Also clear legacy keys if any
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};