import { createContext, useContext, useEffect, useState } from "react";
import { getToken, decodeToken, removeToken } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();

    if (token) {
      const decoded = decodeToken(token);

      if (decoded) {
        setUser(decoded); // contains id, role, name
      }
    }
  }, []);

  const login = (token) => {
    const decoded = decodeToken(token);
    setUser(decoded);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);