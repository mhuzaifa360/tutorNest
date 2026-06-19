import { createContext, useContext, useEffect, useState } from "react";
import {
  getToken,
  saveToken,
  removeToken,
  decodeToken,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Page refresh par user restore
  useEffect(() => {
    const token = getToken();

    if (token) {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        const decoded = decodeToken(token);

        if (decoded) {
          setUser(decoded);
        }
      }
    }
  }, []);

  // Login
  const login = (userData, token) => {
    saveToken(token);

    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  // Logout
  const logout = () => {
    removeToken();

    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);