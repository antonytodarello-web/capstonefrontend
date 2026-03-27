import React, { useEffect, useState } from "react";
import {
  Container,
  Modal,
  Button,
  Badge,
  Spinner,
  Navbar,
} from "react-bootstrap";
import api from "../api/axiosConfig";
import "../styles/dashboard.css";
export default function EmployeeDashboard() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const res = await api.get("/employee/tables");
      setTables(res.data || []);
    } catch (err) {
      console.error("Errore caricamento tavoli:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrdersForTable = async (tableId) => {
    try {
      const res = await api.get(`/orders/table/${tableId}`);
      const list = Array.isArray(res.data)
        ? res.data
        : res.data
          ? [res.data]
          : [];
      setOrders(list);
      setSelectedTable(tableId);
      setShowModal(true);
    } catch (err) {
      console.error("Errore caricamento ordini:", err);
    }
  };

  const markDelivered = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/status?status=DELIVERED`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "DELIVERED" } : o)),
      );
      await loadTables();
    } catch (err) {
      console.error("Errore aggiornamento stato ordine:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <Container fluid className="py-4">
      <Navbar expand="lg" className="bg-light shadow-sm px-3 mb-4">
        <Container fluid>
          <Navbar.Brand className="fw-bold">Caffetteria da Nina</Navbar.Brand>
        </Container>
      </Navbar>

      <h2 className="text-center mb-4 fw-bold" style={{ color: "#3f2a14" }}>
        Mappa Tavoli
      </h2>

      <div
        className="d-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "20px",
        }}>
        {tables.map((t) => {
          const color =
            t.status === "FREE"
              ? "#b8e994"
              : t.status === "OCCUPIED"
                ? "#ffe784"
                : "#f5b7b1";

          return (
            <div
              key={t.id}
              onClick={() => loadOrdersForTable(t.id)}
              className="table-card text-center p-3 shadow-sm"
              style={{ backgroundColor: color, cursor: "pointer" }}>
              <h5 className="fw-bold mb-2">Tavolo {t.number}</h5>
              <Badge bg={t.status === "FREE" ? "success" : "warning"}>
                {t.status}
              </Badge>
            </div>
          );
        })}
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Ordini Tavolo {selectedTable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orders.length === 0 ? (
            <p className="text-center text-muted">
              Nessun ordine per questo tavolo.
            </p>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="mb-4 p-3 border rounded"
                style={{ backgroundColor: "#faf5ec" }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Ordine #{o.id}</strong>
                  <Badge
                    bg={
                      o.status === "DELIVERED"
                        ? "success"
                        : o.status === "IN_PROGRESS"
                          ? "warning text-dark"
                          : "secondary"
                    }>
                    {o.status}
                  </Badge>
                </div>

                <ul className="list-unstyled my-2">
                  {o.items?.map((it) => (
                    <li key={it.id} className="d-flex justify-content-between">
                      <span>{it.product?.name}</span>
                      <span>x {it.quantity}</span>
                    </li>
                  ))}
                </ul>

                {o.status === "DELIVERED" ? (
                  <div className="text-success fw-bold">Consegnato</div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline-success"
                    onClick={() => markDelivered(o.id)}>
                    Segna consegnato
                  </Button>
                )}
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
