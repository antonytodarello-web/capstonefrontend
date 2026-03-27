import React from "react";
import { Button, Container } from "react-bootstrap";
import "../styles/dashboard.css";
export default function LandingPage() {
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fdf2e9,#fff3e0)",
        color: "#3f2a14",
      }}>
      <h1
        className="mb-4"
        style={{ fontFamily: "Playfair Display, serif", fontWeight: "bold" }}>
        Caffetteria da Nina
      </h1>
      <p className="mb-4 fs-5" style={{ maxWidth: "500px" }}>
        Benvenuto nella nostra caffetteria! Scopri i nostri prodotti e ordina
        comodamente dal tuo tavolo.
      </p>
      <div className="d-flex gap-3">
        <Button
          href="/login"
          style={{
            backgroundColor: "#3f2a14",
            border: "none",
            padding: "0.5rem 1.5rem",
            fontWeight: "bold",
          }}>
          Accedi
        </Button>
        <Button
          href="/register"
          variant="outline-dark"
          style={{
            borderColor: "#3f2a14",
            color: "#3f2a14",
            fontWeight: "bold",
            padding: "0.5rem 1.5rem",
          }}>
          Registrati
        </Button>
      </div>
    </Container>
  );
}
