/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
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
 * Extracts initials from first and last name.
 */
const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "U";
  const first = firstName ? firstName.charAt(0).toUpperCase() : "";
  const last = lastName ? lastName.charAt(0).toUpperCase() : "";
  return `${first}${last}`.trim() || "U";
};

/**
 * Safely restore user from localStorage on app load.
 * Priority: stored user object > decoded JWT token > null
 */
const getInitialUser = () => {
  try {
    // First try the stored user object
    let userToReturn = null;
    const savedUser = getUser();
    
    if (savedUser && savedUser.role) {
      userToReturn = savedUser;
    } else {
      // Fallback: decode from JWT token
      const token = getToken();
      if (token) {
        const decoded = decodeToken(token);
        if (decoded && decoded.id && decoded.role) {
          userToReturn = {
            id: decoded.id,
            role: decoded.role,
            firstName: decoded.firstName || "",
            lastName: decoded.lastName || "",
          };
        }
      }
    }

    if (userToReturn) {
      // Ensure initials are calculated
      userToReturn.initials = getInitials(userToReturn.firstName, userToReturn.lastName);
      return userToReturn;
    }
    return null;
  } catch {
    // If anything goes wrong, return null (don't crash the app)
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(getInitialUser);

  // When user changes, ensure we have initials
  useEffect(() => {
    if (user && !user.initials) {
      setUserState(prev => ({
        ...prev,
        initials: getInitials(prev?.firstName, prev?.lastName)
      }));
    }
  }, [user]);

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
        userData.initials = getInitials(userData.firstName, userData.lastName);
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