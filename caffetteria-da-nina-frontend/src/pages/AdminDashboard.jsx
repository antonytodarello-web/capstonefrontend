import React, { useEffect, useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import api from "../api/axiosConfig";
import "../styles/admin.css";

export default function AdminDashboard() {
  const [tab, setTab] = useState("prodotti");
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [edit, setEdit] = useState(null);

  const [product, setProduct] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    vegetarian: false,
    vegan: false,
    imageUrl: "",
    categoryType: "",
  });

  const [employee, setEmployee] = useState({
    id: null,
    fullname: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [p, e] = await Promise.all([
        api.get("/products"),
        api.get("/admin/users"),
      ]);
      setProducts(p.data);
      setEmployees(e.data);
    } catch (err) {
      console.error("Errore caricamento dati", err);
    }
  };

  const saveProduct = async () => {
    if (!product.categoryType) return alert("Seleziona una categoria!");

    const payload = {
      ...product,
      price: parseFloat(product.price),
      category: { type: product.categoryType },
    };

    try {
      if (edit && edit === "product-edit") {
        await api.put(`/products/admin/${product.id}`, payload);
      } else {
        await api.post("/products/admin", payload);
      }
      setShowProductModal(false);
      setProduct({
        name: "",
        description: "",
        price: "",
        vegetarian: false,
        vegan: false,
        imageUrl: "",
        categoryType: "",
      });
      setEdit(null);
      loadData();
    } catch (err) {
      console.error("Errore salvataggio prodotto", err);
      alert("Errore salvataggio prodotto. Controlla i log del server.");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Vuoi davvero eliminare questo prodotto?")) return;
    try {
      await api.delete(`/products/admin/${id}`);
      loadData();
    } catch (err) {
      console.error("Errore eliminazione", err);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await api.post("/admin/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.replace("Immagine caricata con successo: ", "");
      setProduct({ ...product, imageUrl: url });
    } catch (err) {
      console.error("Upload fallito", err);
      alert("Errore caricamento immagine");
    }
  };

  const saveEmployee = async () => {
    try {
      if (edit && edit === "emp-edit") {
        await api.put(`/admin/users/${employee.id}`, employee);
      } else {
        await api.post("/admin/users/create", employee);
      }
      setShowEmployeeModal(false);
      setEmployee({ fullname: "", email: "", password: "" });
      setEdit(null);
      loadData();
    } catch (err) {
      console.error("Errore salvataggio dipendente", err);
      alert("Errore salvataggio dipendente");
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Vuoi davvero eliminare questo dipendente?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      loadData();
    } catch (err) {
      console.error("Errore eliminazione", err);
    }
  };

  return (
    <Container
      className="py-4"
      style={{ backgroundColor: "#f5f0e6", minHeight: "100vh" }}>
      <h2 className="text-center mb-4 fw-bold" style={{ color: "#3f2a14" }}>
        Area Amministratore
      </h2>

      <Tabs activeKey={tab} onSelect={(k) => setTab(k)} fill className="mb-4">
        <Tab eventKey="prodotti" title="Gestione Prodotti">
          <div className="text-end my-3">
            <Button
              onClick={() => {
                setProduct({
                  name: "",
                  description: "",
                  price: "",
                  vegetarian: false,
                  vegan: false,
                  imageUrl: "",
                  categoryType: "",
                });
                setEdit(null);
                setShowProductModal(true);
              }}
              style={{ backgroundColor: "#d4b483", border: "none" }}>
              Nuovo Prodotto
            </Button>
          </div>

          <Table
            hover
            responsive
            bordered
            className="admin-table align-middle text-center shadow-sm">
            <thead style={{ backgroundColor: "#3f2a14", color: "#fff" }}>
              <tr>
                <th>Immagine</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Prezzo</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt="prodotto"
                        thumbnail
                        style={{
                          height: "60px",
                          width: "60px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span className="text-muted small">No foto</span>
                    )}
                  </td>
                  <td>
                    <div className="fw-bold">{p.name}</div>
                  </td>
                  <td>{p.category ? p.category.type : "---"}</td>
                  <td>€ {p.price.toFixed(2)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      className="me-2"
                      onClick={() => {
                        setEdit("product-edit");
                        setProduct({
                          ...p,
                          categoryType: p.category ? p.category.type : "",
                        });
                        setShowProductModal(true);
                      }}>
                      ✏
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteProduct(p.id)}>
                      🗑
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="dipendenti" title="Gestione Staff">
          <div className="text-end my-3">
            <Button
              className="admin-btn"
              onClick={() => {
                setEmployee({ fullname: "", email: "", password: "" });
                setEdit(null);
                setShowEmployeeModal(true);
              }}>
              Nuovo Dipendente
            </Button>
          </div>

          <Table
            hover
            responsive
            bordered
            className="align-middle text-center bg-white shadow-sm">
            <thead style={{ backgroundColor: "#3f2a14", color: "#fff" }}>
              <tr>
                <th>Nome Completo</th>
                <th>Email</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td>{e.fullname}</td>
                  <td>{e.email}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-warning"
                      className="me-2"
                      onClick={() => {
                        setEdit("emp-edit");
                        setEmployee(e);
                        setShowEmployeeModal(true);
                      }}>
                      ✏
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteEmployee(e.id)}>
                      🗑
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {edit ? "Modifica Prodotto" : "Nuovo Prodotto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome Prodotto</Form.Label>
              <Form.Control
                placeholder="es. Cornetto alla crema"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoria (Necessaria per il filtro)</Form.Label>
              <Form.Select
                value={product.categoryType}
                onChange={(e) =>
                  setProduct({ ...product, categoryType: e.target.value })
                }>
                <option value="">Seleziona...</option>
                <option value="BAR">Bar</option>
                <option value="CAFFETTERIA">Caffetteria</option>
                <option value="PASTICCERIA">Pasticceria</option>
                <option value="TAVOLA_CALDA">Tavola Calda</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Label>Prezzo (€)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.10"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                />
              </Col>
              <Col className="d-flex align-items-end gap-2">
                <Form.Check
                  type="checkbox"
                  label="Vegetariano"
                  checked={product.vegetarian}
                  onChange={(e) =>
                    setProduct({ ...product, vegetarian: e.target.checked })
                  }
                />
                <Form.Check
                  type="checkbox"
                  label="Vegano"
                  checked={product.vegan}
                  onChange={(e) =>
                    setProduct({ ...product, vegan: e.target.checked })
                  }
                />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Immagine Prodotto</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowProductModal(false)}>
            Annulla
          </Button>
          <Button
            style={{ backgroundColor: "#3f2a14", border: "none" }}
            onClick={saveProduct}>
            {edit ? "Aggiorna Prodotto" : "Crea Prodotto"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEmployeeModal}
        onHide={() => setShowEmployeeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {edit === "emp-edit" ? "Modifica Staff" : "Aggiungi Nuovo Staff"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control
                type="text"
                placeholder="es. Mario Rossi"
                value={employee.fullname}
                onChange={(e) =>
                  setEmployee({ ...employee, fullname: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email aziendale</Form.Label>
              <Form.Control
                type="email"
                placeholder="mario.rossi@caffetteria.it"
                value={employee.email}
                onChange={(e) =>
                  setEmployee({ ...employee, email: e.target.value })
                }
              />
            </Form.Group>
            {!edit && (
              <Form.Group className="mb-3">
                <Form.Label>Password Provvisoria</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Inserisci password"
                  value={employee.password}
                  onChange={(e) =>
                    setEmployee({ ...employee, password: e.target.value })
                  }
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowEmployeeModal(false)}>
            Annulla
          </Button>
          <Button
            style={{ backgroundColor: "#3f2a14", border: "none" }}
            onClick={saveEmployee}>
            {edit === "emp-edit" ? "Aggiorna Dipendente" : "Salva Dipendente"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
