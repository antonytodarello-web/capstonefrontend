import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
  Form,
  Badge,
} from "react-bootstrap";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import "../styles/customer.css";
export default function CustomerHome() {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [orderItems, setOrderItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      const url =
        category === "ALL" ? "/products" : `/products/category/${category}`;

      const res = await api.get(url);
      console.log(`Dati ricevuti per ${category}:`, res.data);
      setProducts(res.data);
    } catch (err) {
      console.error("Errore caricamento prodotti:", err);
      setProducts([]);
    }
  }, [category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const changeQuantity = (product, delta) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);

      if (!existing && delta > 0)
        return [...prev, { productId: product.id, quantity: 1 }];

      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter((i) => i.productId !== product.id);

        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: newQty } : i,
        );
      }
      return prev;
    });
  };

  const getQuantity = (id) => {
    const item = orderItems.find((i) => i.productId === id);
    return item ? item.quantity : 0;
  };

  const sendOrder = async () => {
    if (!selectedTable) return alert("Per favore, seleziona un tavolo!");
    if (orderItems.length === 0) return alert("Il carrello è vuoto.");

    try {
      await api.post(
        `/orders/create?clientId=${user.id}&tableId=${selectedTable}`,
        orderItems,
      );
      setOrderItems([]);
      alert("Ordine inviato con successo! Arriverà a breve.");
    } catch (err) {
      console.error("Errore invio ordine:", err);
      alert("Si è verificato un errore durante l'invio.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar
        expand="lg"
        className="shadow-sm px-3"
        style={{ backgroundColor: "#c7a97d" }}
        sticky="top">
        <Container fluid>
          <Navbar.Brand className="fw-bold text-dark me-4">
            Caffetteria da Nina
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto d-flex align-items-center gap-2">
              {[
                { key: "ALL", label: "Tutte" },
                { key: "BAR", label: "Bar" },
                { key: "CAFFETTERIA", label: "Caffetteria" },
                { key: "PASTICCERIA", label: "Pasticceria" },
                { key: "TAVOLA_CALDA", label: "Tavola Calda" },
              ].map((c) => (
                <Nav.Link
                  key={c.key}
                  onClick={(e) => {
                    e.preventDefault();
                    setCategory(c.key);
                  }}
                  active={category === c.key}
                  className="px-3 rounded"
                  style={{
                    fontWeight: category === c.key ? "bold" : "normal",
                    backgroundColor:
                      category === c.key ? "rgba(0,0,0,0.05)" : "transparent",
                    color: "#3f2a14",
                  }}>
                  {c.label}
                </Nav.Link>
              ))}
            </Nav>

            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              <Form.Select
                size="sm"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                style={{ width: "130px", border: "1px solid #3f2a14" }}>
                <option value="">Scegli Tavolo</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((t) => (
                  <option key={t} value={t}>
                    Tavolo {t}
                  </option>
                ))}
              </Form.Select>

              <Button
                variant="dark"
                size="sm"
                onClick={logout}
                className="px-3">
                Esci
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Container className="py-5">
          <div className="mb-4">
            <h2 className="fw-bold" style={{ color: "#3f2a14" }}>
              {category === "ALL"
                ? "Il nostro Menù"
                : category.replace("_", " ")}
            </h2>
            <hr
              style={{
                width: "50px",
                height: "3px",
                backgroundColor: "#c7a97d",
                opacity: 1,
              }}
            />
          </div>

          <Row>
            {products.length > 0 ? (
              products.map((p) => (
                <Col key={p.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className="menu-card h-100 border-0 shadow-sm">
                    {p.imageUrl && (
                      <Card.Img
                        variant="top"
                        src={p.imageUrl}
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    )}
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="h6 fw-bold mb-0">
                          {p.name}
                        </Card.Title>
                        {p.category && (
                          <Badge bg="light" text="dark" className="border">
                            {p.category.type}
                          </Badge>
                        )}
                      </div>

                      <Card.Text
                        className="text-muted flex-grow-1"
                        style={{ fontSize: "0.85rem" }}>
                        {p.description || "Nessuna descrizione disponibile."}
                      </Card.Text>

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span
                          className="fw-bold fs-5"
                          style={{ color: "#3f2a14" }}>
                          € {p.price ? p.price.toFixed(2) : "0.00"}
                        </span>

                        <div className="d-flex align-items-center gap-2 bg-light rounded-pill p-1">
                          <Button
                            size="sm"
                            variant="white"
                            className="rounded-circle shadow-sm p-0"
                            style={{ width: "28px", height: "28px" }}
                            onClick={() => changeQuantity(p, -1)}>
                            -
                          </Button>
                          <span className="px-1 fw-bold">
                            {getQuantity(p.id)}
                          </span>
                          <Button
                            size="sm"
                            variant="white"
                            className="rounded-circle shadow-sm p-0"
                            style={{ width: "28px", height: "28px" }}
                            onClick={() => changeQuantity(p, 1)}>
                            +
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center py-5">
                <p className="text-muted">
                  Nessun prodotto trovato in questa categoria.
                </p>
              </Col>
            )}
          </Row>
          {orderItems.length > 0 && (
            <Button
              onClick={sendOrder}
              className="loating-order-btn d-flex align-items-center gap-2">
              INVIA ORDINE ({orderItems.reduce((a, i) => a + i.quantity, 0)})
            </Button>
          )}
        </Container>
      </main>
      <footer className="text-light mt-auto">
        <div style={{ backgroundColor: "#3f2a14", padding: "40px 0 20px" }}>
          <Container>
            <Row className="align-items-center">
              <Col md={4} className="text-center text-md-start mb-4 mb-md-0">
                <h5
                  className="fw-bold mb-3 text-uppercase"
                  style={{ letterSpacing: "2px" }}>
                  CAFFETTERIA DA NINA
                </h5>
                <p className="small text-secondary mb-0">
                  Qualità e tradizione dal 1990.
                </p>
              </Col>
              <Col md={4} className="text-center mb-4 mb-md-0">
                <p className="mb-1 small">Via Roma 12, Bologna</p>
                <p className="mb-1 small">Tel: 051-123456</p>
                <p className="small">
                  <a
                    href="mailto:info@nina.it"
                    style={{ color: "#c7a97d", textDecoration: "none" }}>
                    info@nina.it
                  </a>
                </p>
              </Col>
              <Col md={4} className="text-center text-md-end">
                <div className="d-flex justify-content-center justify-content-md-end gap-3 fs-5 mb-3">
                  <i
                    className="bi bi-facebook"
                    style={{ cursor: "pointer" }}></i>
                  <i
                    className="bi bi-instagram"
                    style={{ cursor: "pointer" }}></i>
                  <i className="bi bi-tiktok" style={{ cursor: "pointer" }}></i>
                </div>
                <p className="small text-secondary mb-0">
                  © {new Date().getFullYear()} — Tutti i diritti riservati
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      </footer>
    </div>
  );
}
