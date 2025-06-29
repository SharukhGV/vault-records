import React, { useState, useEffect } from 'react';
import { cashStorage } from './storageService';

const CashComponent = () => {
  const [cashEntries, setCashEntries] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCashEntries();
  }, []);

  const loadCashEntries = () => {
    const entries = cashStorage.getAll();
    setCashEntries(entries);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.date) {
      setError('Date is required');
      return false;
    }
    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      setError('Valid amount is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      cashStorage.update(editingId, formData);
      setEditingId(null);
    } else {
      cashStorage.create(formData);
    }
    loadCashEntries();
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      notes: ''
    });
  };

  const handleEdit = (id) => {
    const entry = cashStorage.getById(id);
    if (entry) {
      setFormData({
        date: entry.date,
        amount: entry.amount,
        notes: entry.notes || ''
      });
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      cashStorage.delete(id);
      loadCashEntries();
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          amount: '',
          notes: ''
        });
      }
    }
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  return (
    <div className="component-container">
      <h2>Cash Transactions</h2>
      
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            step="0.01"
            placeholder="Positive for income, negative for expense"
            required
          />
        </div>
        
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Optional description"
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingId ? 'Update Entry' : 'Add Entry'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  date: new Date().toISOString().split('T')[0],
                  amount: '',
                  notes: ''
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cashEntries.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">No cash entries yet</td>
              </tr>
            ) : (
              cashEntries.map(entry => (
                <tr key={entry.id} className={parseFloat(entry.amount) < 0 ? 'negative' : 'positive'}>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td>{formatCurrency(entry.amount)}</td>
                  <td>{entry.notes || '-'}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(entry.id)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(entry.id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashComponent;