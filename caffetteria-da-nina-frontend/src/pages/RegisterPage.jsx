import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/auth.css";
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", formData);
      setSuccess("Registrazione completata! Reindirizzamento al login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setError("Email già registrata oppure dati non validi.");
      } else {
        setError("Errore durante la registrazione. Riprova più tardi.");
      }
    }
  };

  return (
    <Container
      className="auth-box"
      style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2 className="text-center mb-4">Registrati come Cliente</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome completo</Form.Label>
          <Form.Control
            type="text"
            name="fullname"
            placeholder="Inserisci il tuo nome"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="esempio@mail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Password (min 4 caratteri)</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Scegli una password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button className="auth-btn w-100">Registrati</Button>

        <div className="text-center mt-3">
          <Button
            variant="link"
            onClick={() => navigate("/login")}
            style={{
              textDecoration: "none",
              color: "#3f2a14",
              fontWeight: "500",
            }}>
            Hai già un account? Accedi
          </Button>
        </div>
      </Form>
    </Container>
  );
}
