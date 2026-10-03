import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

// Keeps "who is logged in" for the whole app.
// The cookie is the real session; this state just mirrors /api/auth/me.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On page load, ask the backend if the cookie is still valid
  useEffect(() => {
    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // expectedRole is the Student/Admin tab. It is only a friendly check:
  // the backend decides the real role from the database.
  const login = async (email, password, expectedRole) => {
    const { user: loggedIn } = await authApi.login({ email, password });

    if (expectedRole && loggedIn.role !== expectedRole) {
      await authApi.logout();
      throw new Error(`This account does not have ${expectedRole} access`);
    }

    setUser(loggedIn);
    return loggedIn;
  };

  const register = async (name, email, password) => {
    const { user: created } = await authApi.register({ name, email, password });
    setUser(created);
    return created;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
