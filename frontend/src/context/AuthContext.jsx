import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { loginUser } from "../api/auth";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const data = await loginUser(email, password);

    localStorage.setItem(
      "access_token",
      data.access_token
    );

    setToken(data.access_token);

    return data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  const updateAuthenticatedUser = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedToken =
        localStorage.getItem("access_token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/me");

        setUser(response.data);
      } catch (error) {
        console.error(
          "Failed to load authenticated user:",
          error
        );

        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        loading,
        login,
        logout,
        updateAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
