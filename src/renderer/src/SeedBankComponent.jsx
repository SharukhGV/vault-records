import React, { useState, useEffect } from 'react';
import { seedStorage } from './storageService';

const SeedBankComponent = () => {
  const [seedEntries, setSeedEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    seedName: '',
    variety: '',
    quantity: '',
    source: '',
    collectionYear: new Date().getFullYear(),
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSeedEntries();
  }, []);

  useEffect(() => {
    // Filter entries whenever searchTerm or seedEntries changes
    const filtered = seedEntries.filter(entry => 
      entry.seedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.variety?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEntries(filtered);
  }, [searchTerm, seedEntries]);

  const loadSeedEntries = () => {
    const entries = seedStorage.getAll();
    setSeedEntries(entries);
    setFilteredEntries(entries); // Initialize filtered entries with all entries
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const validateForm = () => {
    if (!formData.date) {
      setError('Date is required');
      return false;
    }
    if (!formData.seedName) {
      setError('Seed name is required');
      return false;
    }
    if (!formData.quantity || isNaN(parseInt(formData.quantity))) {
      setError('Valid quantity is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingId) {
      seedStorage.update(editingId, formData);
      setEditingId(null);
    } else {
      seedStorage.create(formData);
    }
    loadSeedEntries();
    setFormData({
      date: new Date().toISOString().split('T')[0],
      seedName: '',
      variety: '',
      quantity: '',
      source: '',
      collectionYear: new Date().getFullYear(),
      notes: ''
    });
  };

  const handleEdit = (id) => {
    const entry = seedStorage.getById(id);
    if (entry) {
      setFormData({
        date: entry.date,
        seedName: entry.seedName,
        variety: entry.variety || '',
        quantity: entry.quantity,
        source: entry.source || '',
        collectionYear: entry.collectionYear || new Date().getFullYear(),
        notes: entry.notes || ''
      });
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this seed entry?')) {
      seedStorage.delete(id);
      loadSeedEntries();
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          seedName: '',
          variety: '',
          quantity: '',
          source: '',
          collectionYear: new Date().getFullYear(),
          notes: ''
        });
      }
    }
  };

  // Generate year options for collection year (current year + 10 years back)
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 10; year--) {
    yearOptions.push(year);
  }

  return (
    <div className="component-container">
      <h2>Seed Bank Inventory</h2>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search seeds by name, variety, source or notes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')} 
            className="clear-search-btn"
          >
            Clear
          </button>
        )}
      </div>
      
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
          <label htmlFor="seedName">Seed Name*</label>
          <input
            type="text"
            id="seedName"
            name="seedName"
            value={formData.seedName}
            onChange={handleInputChange}
            placeholder="e.g., Tomato, Basil"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="variety">Variety</label>
          <input
            type="text"
            id="variety"
            name="variety"
            value={formData.variety}
            onChange={handleInputChange}
            placeholder="e.g., Beefsteak, Genovese"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">Quantity*</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
            placeholder="Number of packets/seeds"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="source">Source</label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            placeholder="Where you got these seeds"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="collectionYear">Collection Year</label>
          <select
            id="collectionYear"
            name="collectionYear"
            value={formData.collectionYear}
            onChange={handleInputChange}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Storage location, special instructions, etc."
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
                  seedName: '',
                  variety: '',
                  quantity: '',
                  source: '',
                  collectionYear: new Date().getFullYear(),
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
              <th>Seed Name</th>
              <th>Variety</th>
              <th>Quantity</th>
              <th>Year</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  {searchTerm ? 'No matching seeds found' : 'No seed entries yet'}
                </td>
              </tr>
            ) : (
              filteredEntries.map(entry => (
                <tr key={entry.id}>
                  <td className="secondary-text">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="seed-name">
                    <span className="capitalize">{entry.seedName}</span>
                    {entry.notes && (
                      <div className="seed-notes">{entry.notes}</div>
                    )}
                  </td>
                  <td className="secondary-text">{entry.variety || '-'}</td>
                  <td className="quantity">{entry.quantity}</td>
                  <td className="secondary-text">{entry.collectionYear}</td>
                  <td className="secondary-text">{entry.source || '-'}</td>
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

export default SeedBankComponent;