import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, Clock, AlertCircle } from 'lucide-react';

const DeliveryTracking = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const FIREBASE_URL = 'https://blood-bank-3b1cc-default-rtdb.firebaseio.com/requests.json';

  const fetchDeliveries = async () => {
    try {
      const response = await fetch(FIREBASE_URL);
      const data = await response.json();
      if (data) {
        // Filter only Dispatched requests
        const reqArray = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .filter(req => req.status === 'Dispatched');
        setDeliveries(reqArray);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Blood Issue & Delivery Tracking</h2>
          <p className="text-muted">Manage and track blood transport to partner hospitals.</p>
        </div>
      </div>

      <div className="card-grid" style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {loading ? <p>Loading active deliveries...</p> : deliveries.length === 0 ? (
          <div style={{ background: 'white', padding: '32px', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)' }}>
            No active deliveries at the moment.
          </div>
        ) : deliveries.map(delivery => (
          <div key={delivery.id} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ background: '#e3f2fd', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1976d2' }}>
                  <Truck size={32} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>{delivery.driver || 'Assigned Driver'}</h3>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={16} /> +91 98765 43210</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px' }}>{delivery.vehicle || 'Pending Vehicle'}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '6px 16px', borderRadius: '20px', fontWeight: '600', display: 'inline-block', marginBottom: '8px' }}>
                  In Transit
                </div>
                <div style={{ color: '#f57c00', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                  <Clock size={16} /> ETA: 12 mins
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div>
                <p className="text-muted" style={{ marginBottom: '4px', fontSize: '0.9rem' }}>Blood Details</p>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <span style={{ color: 'var(--primary)' }}>{delivery.bloodGroup}</span> 
                  <span style={{ color: 'var(--text-main)', marginLeft: '8px' }}>({delivery.units} Units)</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Patient: {delivery.patientName}</div>
              </div>
              <div>
                <p className="text-muted" style={{ marginBottom: '4px', fontSize: '0.9rem' }}>Destination</p>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--dark)' }}>{delivery.hospital}</div>
              </div>
              <div>
                <p className="text-muted" style={{ marginBottom: '4px', fontSize: '0.9rem' }}>Dispatch Info</p>
                <div style={{ fontSize: '1rem', fontWeight: '500' }}>Req ID: {delivery.id.substring(1, 8).toUpperCase()}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Time: {delivery.dispatchTime}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryTracking;
