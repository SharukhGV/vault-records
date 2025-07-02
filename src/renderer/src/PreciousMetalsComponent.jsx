import React, { useState, useEffect } from 'react';
import { metalsStorage } from './storageService';

const PreciousMetalsComponent = () => {
  const [metalsEntries, setMetalsEntries] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    metalType: 'gold',
    purity: '24k',
    grams: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMetalsEntries();
  }, []);

  const loadMetalsEntries = () => {
    const entries = metalsStorage.getAll();
    setMetalsEntries(entries);
  };

const handleInputChange = (e) => {
  const { name, value } = e.target;
  
  if (name === 'metalType') {
    // When metal type changes, reset purity to the first option of the new metal type
    setFormData(prev => ({ 
      ...prev, 
      metalType: value,
      purity: purityOptions[value][0] // Set to first purity option for the new metal type
    }));
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};
  const validateForm = () => {
    if (!formData.date) {
      setError('Date is required');
      return false;
    }
    if (!formData.grams || isNaN(parseFloat(formData.grams))) {
      setError('Valid weight in grams is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      metalsStorage.update(editingId, formData);
      setEditingId(null);
    } else {
      metalsStorage.create(formData);
    }
    loadMetalsEntries();
    setFormData({
      date: new Date().toISOString().split('T')[0],
      metalType: 'gold',
      purity: '24k',
      grams: '',
      notes: ''
    });
  };

  const handleEdit = (id) => {
    const entry = metalsStorage.getById(id);
    if (entry) {
      setFormData({
        date: entry.date,
        metalType: entry.metalType,
        purity: entry.purity,
        grams: entry.grams,
        notes: entry.notes || ''
      });
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      metalsStorage.delete(id);
      loadMetalsEntries();
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          metalType: 'gold',
          purity: '24k',
          grams: '',
          notes: ''
        });
      }
    }
  };

  const purityOptions = {
    gold: ['24k', '22k', '18k', '14k', '10k'],
    silver: ['999', '925', '900', '800'],
    platinum: ['950', '900', '850']
  };

  return (
    <div className="component-container">
      <h2>Precious Metals Inventory</h2>
      
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
          <label htmlFor="metalType">Metal Type</label>
          <select
            id="metalType"
            name="metalType"
            value={formData.metalType}
            onChange={handleInputChange}
          >
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="purity">Purity</label>
          <select
            id="purity"
            name="purity"
            value={formData.purity}
            onChange={handleInputChange}
          >
            {purityOptions[formData.metalType].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="grams">Grams</label>
          <input
            type="number"
            id="grams"
            name="grams"
            value={formData.grams}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            placeholder="Weight in grams"
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
                  metalType: 'gold',
                  purity: '24k',
                  grams: '',
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
              <th>Metal</th>
              <th>Purity</th>
              <th>Grams</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {metalsEntries.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No metals entries yet</td>
              </tr>
            ) : (
              metalsEntries.map(entry => (
                <tr key={entry.id}>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="capitalize">{entry.metalType}</td>
                  <td>{entry.purity}</td>
                  <td>{parseFloat(entry.grams).toFixed(2)}g</td>
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

export default PreciousMetalsComponent;