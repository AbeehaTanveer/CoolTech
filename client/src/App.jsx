import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
  });
  const [action, setAction] = useState('deposit'); // new state for action type
  const [openDialog, setOpenDialog] = useState(false); // state for opening the dialog

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleActionChange = (e) => {
    setAction(e.target.value); // updates action between 'deposit' and 'transfer'
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Open the dialog when the user clicks on deposit/transfer
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Close dialog without action
  };

  const handleDialogSubmit = async () => {
    try {
      const stripePromise = await loadStripe(
        'pk_test_51QWyxoJidkmtqOoJ9CmevuN9lvc2BCv3eojbZYsoklZen1BipnHl2TK77RiaVVFqvm48eRIiN84SE2U1owGmYjwm0093iz4wRE'
      );

      // Send form data to the backend
      const response = await axios.post('http://localhost:1010/profile', formData);

      // Get session ID from backend response
      const session = response.data;

      // Redirect to Stripe checkout
      const result = await stripePromise.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log('Stripe error:', result.error.message);
      }

      // Close the dialog after submission
      setOpenDialog(false);
    } catch (error) {
      console.error('Error in form submission:', error);
      setOpenDialog(false); // Close dialog on error
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Submit Your Details</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <FormControl fullWidth>
            <InputLabel>Action</InputLabel>
            <Select value={action} onChange={handleActionChange}>
              <MenuItem onClick={handle} value="deposit">Deposit</MenuItem>
              <MenuItem value="transfer">Transfer</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>{action === 'deposit' ? 'Debit' : 'Credit'} Amount: </label>
          <input
            type="number"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" variant="contained" color="primary">
          {action === 'deposit' ? 'Deposit' : 'Transfer'}
        </Button>
      </form>

      {/* Dialog for amount input */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Enter Amount</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.balance}
            onChange={handleChange}
            name="balance"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
