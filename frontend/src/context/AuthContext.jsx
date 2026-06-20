/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getToken,
  getUser,
  setToken,
  setUser,
  clearAuth,
  decodeToken,
} from "../services/authService";
import { profileApi } from "../services/apiService";

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

  const updateUser = useCallback((userData) => {
    if (!userData) return;
    const nextUser = {
      ...userData,
      initials: getInitials(userData.firstName, userData.lastName),
    };
    setUser(nextUser);
    setUserState(nextUser);
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = getToken();
    if (!token) return null;

    const response = await profileApi.me();
    if (response.ok && response.user) {
      updateUser(response.user);
      return response.user;
    }
    return null;
  }, [updateUser]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

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
        updateUser(userData);
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
    <AuthContext.Provider value={{ user, login, logout, updateUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
