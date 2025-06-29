import React, { useState } from 'react';
import CashComponent from './CashComponent';
import PreciousMetalsComponent from './PreciousMetalsComponent';
import TotalsSummary from './TotalsSummary';
import './styles.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo">Wealth Tracker</div>
        <nav className="main-nav">
          <button
            className={`nav-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <i className="fas fa-chart-pie"></i>
            <span>Summary</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'cash' ? 'active' : ''}`}
            onClick={() => setActiveTab('cash')}
          >
            <i className="fas fa-money-bill-wave"></i>
            <span>Cash Transactions</span>
          </button>
          <button
            className={`nav-btn ${activeTab === 'metals' ? 'active' : ''}`}
            onClick={() => setActiveTab('metals')}
          >
            <i className="fas fa-gem"></i>
            <span>Precious Metals</span>
          </button>
        </nav>
      </div>
      
      <div className="main-content">
        {activeTab === 'summary' && <TotalsSummary />}
        {activeTab === 'cash' && <CashComponent />}
        {activeTab === 'metals' && <PreciousMetalsComponent />}
      </div>
    </div>
  );
};

export default App;