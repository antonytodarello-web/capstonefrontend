import React, { useState, useContext } from "react";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, role, fullname, id } = res.data;
      login(token, role, fullname, id);

      // 🔁 Redirect in base al ruolo
      if (role.toUpperCase() === "ADMIN") window.location.href = "/admin";
      else if (role.toUpperCase() === "EMPLOYEE")
        window.location.href = "/employee";
      else window.location.href = "/home";
    } catch (err) {
      alert("Email o password non validi");
    }
  };

  return (
    <div className="auth-box">
      <h3 className="text-center mb-3">Login</h3>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn auth-btn w-100">
          Accedi
        </button>
      </form>
    </div>
  );
}
