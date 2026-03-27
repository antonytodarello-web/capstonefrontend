import React from "react";
import { Container } from "react-bootstrap";

export default function NotFound() {
  return (
    <Container className="text-center mt-5">
      <h2>Pagina non trovata</h2>
      <p>Ups! Il percorso che hai inserito non esiste.</p>
    </Container>
  );
}
