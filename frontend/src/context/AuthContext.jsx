/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import {
  getToken,
  getUser,
  setToken,
  setUser,
  clearAuth,
  decodeToken,
} from "../services/authService";

const AuthContext = createContext();

/**
 * Safely restore user from localStorage on app load.
 * Priority: stored user object > decoded JWT token > null
 */
const getInitialUser = () => {
  try {
    // First try the stored user object
    const savedUser = getUser();
    if (savedUser && savedUser.role) return savedUser;

    // Fallback: decode from JWT token
    const token = getToken();
    if (!token) return null;

    const decoded = decodeToken(token);
    if (decoded && decoded.id && decoded.role) {
      return {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email || "",
      };
    }

    return null;
  } catch {
    // If anything goes wrong, return null (don't crash the app)
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getInitialUser);

  /**
   * Login: saves token + user to localStorage and updates state.
   * @param {object} userData - User object from API response
   * @param {string} token - JWT token from API response
   */
  const login = (userData, token) => {
    try {
      if (token) {
        setToken(token);
      }
      if (userData) {
        setUser(userData);
        setUserState(userData);
      }
    } catch (err) {
      console.error("Login save error:", err);
    }
  };

  /**
   * Logout: clears all auth data from localStorage and resets state.
   */
  const logout = () => {
    clearAuth();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);