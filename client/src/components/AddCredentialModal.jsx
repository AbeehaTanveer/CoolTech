import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const AddCredentialModal = ({ divisions, onSuccess }) => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    url: '',
    division: '',
    username: '',
    password: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setFormData({
      serviceName: '',
      url: '',
      division: '',
      username: '',
      password: '',
      notes: ''
    });
    setErrorMsg('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post('http://localhost:1010/credential', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      onSuccess(response.data.credential);
      handleClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to add credential');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="mb-3">
        Add New Credential
      </Button>

      <Modal show={show} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Add New Credential</Modal.Title>
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
                placeholder="e.g., AWS Console"
                required
              />
            </Form.Group>

      
            <Form.Group className="mb-3">
              <Form.Label>Username/Email</Form.Label>
              <Form.Control
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username@cooltech.com"
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
                placeholder="••••••••"
                required
              />
            </Form.Group>

     
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Save Credential'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddCredentialModal;
