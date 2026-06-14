import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  //  RESTORE USER AFTER REFRESH
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAdmin(user.roleName === "admin");
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    setAuthLoading(false);
  }, []);

  // REGISTER 
  const register = async (form) => {
    try {
      const data = await registerUser(form);
      if (data.error) {
        return { ok: false, error: data.error };
      }
      return { ok: true };
    }
    catch {
      return { ok: false, error: "Server error" };
    }
  };
  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);

      if (data.error) {
        return { ok: false, error: data.error };
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setCurrentUser(data.user);
      setIsAdmin(data.user.roleName === "admin");

      return { ok: true, user: data.user };

    } catch {
      return { ok: false, error: "Server error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ✅ FIXED
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAdmin,
      authLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);