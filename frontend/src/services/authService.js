import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "tutornest_token";

/**
 * SAVE TOKEN
 */
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * GET TOKEN
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * REMOVE TOKEN
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * DECODE JWT TOKEN (SAFE)
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    console.log("JWT Decode Error:", error);
    return null;
  }
};