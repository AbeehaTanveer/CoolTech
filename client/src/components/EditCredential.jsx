import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

const EditCredentialModal = ({ credential, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (credential) {
      setFormData({
        serviceName: credential.serviceName,
        url: credential.url || "",
        division: credential.division || "",
        username: credential.username,
        password: credential.password,
        notes: credential.notes || "",
      });
    }
  }, [credential]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await axios.put(
        `http://localhost:1010/credential/credentials/${credential._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onUpdateSuccess(response.data.credential);
      handleClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update credential");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Credential</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Service/Platform Name</Form.Label>
            <Form.Control
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username/Email</Form.Label>
            <Form.Control
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Update Credential"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditCredentialModal;
