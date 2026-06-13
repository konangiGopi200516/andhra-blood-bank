import React, { useState, useEffect } from 'react';
import { Database, Droplet, AlertTriangle, CheckCircle } from 'lucide-react';

const BloodInventory = ({ isAdmin = false }) => {
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('admin_inventory');
    return saved ? JSON.parse(saved) : [
      { type: 'A+', stock: 45 },
      { type: 'A-', stock: 12 },
      { type: 'B+', stock: 60 },
      { type: 'B-', stock: 8 },
      { type: 'O+', stock: 120 },
      { type: 'O-', stock: 5 },
      { type: 'AB+', stock: 30 },
      { type: 'AB-', stock: 15 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('admin_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const updateStock = (index, delta) => {
    const newInventory = [...inventory];
    const newStock = newInventory[index].stock + delta;
    if (newStock >= 0) {
      newInventory[index].stock = newStock;
      setInventory(newInventory);
    }
  };

  const getStatus = (stock) => {
    if (stock >= 30) return 'Optimal';
    if (stock >= 10) return 'Low';
    return 'Critical';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Optimal': return '#2e7d32'; // Green
      case 'Low': return '#f57c00'; // Orange
      case 'Critical': return '#d32f2f'; // Red
      default: return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Optimal': return <CheckCircle size={18} color="#2e7d32" />;
      case 'Low': return <AlertTriangle size={18} color="#f57c00" />;
      case 'Critical': return <AlertTriangle size={18} color="#d32f2f" />;
      default: return null;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Database size={40} /> Blood Inventory
        </h2>
        <p className="text-muted">Real-time tracking of blood stock levels across the central bank.</p>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        {inventory.map((item, index) => {
          const status = getStatus(item.stock);
          return (
          <div key={index} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: `4px solid ${getStatusColor(status)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#ffebee', padding: '12px', borderRadius: '50%', color: 'var(--primary)' }}>
                  <Droplet size={24} />
                </div>
                <h3 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--dark)' }}>{item.type}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600', color: getStatusColor(status) }}>
                {getStatusIcon(status)}
                {status}
              </div>
            </div>
            
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted">Available Units</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {isAdmin && <button onClick={() => updateStock(index, -1)} style={{ background: '#e0e0e0', color: 'var(--dark)', border: 'none', borderRadius: '4px', width: '32px', height: '32px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>}
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--dark)', minWidth: '40px', textAlign: 'center' }}>{item.stock}</span>
                {isAdmin && <button onClick={() => updateStock(index, 1)} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', width: '32px', height: '32px', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>}
              </div>
            </div>
          </div>
        )})}
      </div>
      
      <div style={{ marginTop: '40px', background: 'white', padding: '32px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginBottom: '20px', color: 'var(--dark)' }}>Recent Collections</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ borderBottom: '2px solid #f0f0f0' }}>
            <tr>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Date</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Hospital/Camp</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Blood Group</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Units Collected</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '16px 8px', fontWeight: '500' }}>Today, 10:30 AM</td>
              <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>Red Cross Camp</td>
              <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>O+</td>
              <td style={{ padding: '16px 8px' }}>15</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '16px 8px', fontWeight: '500' }}>Yesterday</td>
              <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>City Hospital Drive</td>
              <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>A-</td>
              <td style={{ padding: '16px 8px' }}>8</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '16px 8px', fontWeight: '500' }}>Oct 24, 2023</td>
              <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>Community Center</td>
              <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>B+</td>
              <td style={{ padding: '16px 8px' }}>22</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BloodInventory;
