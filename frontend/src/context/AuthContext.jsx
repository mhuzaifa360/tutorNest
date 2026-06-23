/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getToken,
  getUser,
  setToken,
  setUser,
  clearAuth,
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
        // Fallback: use saved token/user if present
        const token = getToken();
        if (token) {
          const saved = getUser();
          if (saved && saved.role) userToReturn = saved;
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
  const [authReady, setAuthReady] = useState(false);

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
    if (!token) {
      setAuthReady(true);
      return null;
    }

    const response = await profileApi.me();
    const profileUser = response.user || response.data?.user || response.data || null;
    if (response.ok && profileUser) {
      updateUser(profileUser);
      setAuthReady(true);
      return profileUser;
    }

    clearAuth();
    setAuthReady(true);
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
        setUser(userData);
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
    <AuthContext.Provider value={{ user, authReady, login, logout, updateUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
