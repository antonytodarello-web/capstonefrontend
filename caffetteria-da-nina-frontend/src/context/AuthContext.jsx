import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const fullname = localStorage.getItem("fullname");
    const id = localStorage.getItem("userId");

    if (token && role) {
      setUser({ token, role: role.toUpperCase(), fullname, id });
    }
    setLoading(false);
  }, []);

  const login = (token, role, fullname, id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("fullname", fullname);
    localStorage.setItem("userId", id);
    setUser({ token, role: role.toUpperCase(), fullname, id });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
