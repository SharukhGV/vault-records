import React from 'react';
import { cashStorage, metalsStorage, seedStorage } from './storageService';

const TotalsSummary = () => {
  // Calculate cash total
  const cashEntries = cashStorage.getAll();
  const cashTotal = cashEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0);

  // Calculate metals totals by type and purity
  const metalsEntries = metalsStorage.getAll();
  const metalsTotals = metalsEntries.reduce((acc, entry) => {
    const key = `${entry.metalType}-${entry.purity}`;
    if (!acc[key]) {
      acc[key] = {
        metalType: entry.metalType,
        purity: entry.purity,
        totalGrams: 0
      };
    }
    acc[key].totalGrams += parseFloat(entry.grams || 0);
    return acc;
  }, {});

  // Calculate seed totals by name and variety
  const seedEntries = seedStorage.getAll();
  const seedTotals = seedEntries.reduce((acc, entry) => {
    const key = `${entry.seedName}-${entry.variety || 'default'}`;
    if (!acc[key]) {
      acc[key] = {
        seedName: entry.seedName,
        variety: entry.variety || 'Standard',
        totalQuantity: 0
      };
    }
    acc[key].totalQuantity += parseInt(entry.quantity || 0);
    return acc;
  }, {});

  // Format currency
  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  return (
    <div className="totals-container">
      <h2>Wealth Summary</h2>
      
      <div className="summary-cards">
        <div className="summary-card cash-summary">
          <h3>Cash Balance</h3>
          <div className="total-amount" style={{ color: cashTotal >= 0 ? '#4cc9f0' : '#f72585' }}>
            {formatCurrency(cashTotal)}
          </div>
          <div className="entries-count">{cashEntries.length} transaction{cashEntries.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="summary-card metals-summary">
          <h3>Precious Metals</h3>
          <div className="metals-details">
            {Object.values(metalsTotals).length > 0 ? (
              Object.values(metalsTotals).map((metal, index) => (
                <div key={index} className="metal-item">
                  <span className="metal-type">{metal.metalType.charAt(0).toUpperCase() + metal.metalType.slice(1)}</span>
                  <span className="metal-purity">{metal.purity}</span>
                  <span className="metal-grams">{metal.totalGrams.toFixed(2)}g</span>
                </div>
              ))
            ) : (
              <div className="no-metals">No metals recorded</div>
            )}
          </div>
          <div className="entries-count">{metalsEntries.length} entr{metalsEntries.length !== 1 ? 'ies' : 'y'}</div>
        </div>

        <div className="summary-card seeds-summary">
          <h3>Seed Inventory</h3>
          <div className="seeds-details">
            {Object.values(seedTotals).length > 0 ? (
              Object.values(seedTotals).map((seed, index) => (
                <div key={index} className="seed-item">
                  <span className="seed-name">{seed.seedName}</span>
                  {seed.variety !== 'Standard' && (
                    <span className="seed-variety">{seed.variety}</span>
                  )}
                  <span className="seed-quantity">{seed.totalQuantity}</span>
                </div>
              ))
            ) : (
              <div className="no-seeds">No seeds recorded</div>
            )}
          </div>
          <div className="entries-count">{seedEntries.length} entr{seedEntries.length !== 1 ? 'ies' : 'y'}</div>
        </div>
      </div>
    </div>
  );
};

export default TotalsSummary;