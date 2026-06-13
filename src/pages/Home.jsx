import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Activity, Users, Droplet, Search, AlertCircle, Building } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({ donors: 0, hospitals: 0, units: 0 });

  useEffect(() => {
    const donorsStr = localStorage.getItem('admin_donors_v2');
    const hospitalsStr = localStorage.getItem('admin_hospitals_v3');
    const inventoryStr = localStorage.getItem('admin_inventory');

    const donorsList = donorsStr ? JSON.parse(donorsStr) : [];
    const hospitalsList = hospitalsStr ? JSON.parse(hospitalsStr) : [];
    const inventoryList = inventoryStr ? JSON.parse(inventoryStr) : [];

    const dCount = donorsList.length > 0 ? donorsList.length : 5;
    const hCount = hospitalsList.length > 0 ? hospitalsList.length : 24;
    
    const uCount = inventoryList.length > 0 
      ? inventoryList.reduce((sum, item) => sum + (Number(item.stock) || 0), 0)
      : 295;

    setStats({ donors: dCount, hospitals: hCount, units: uCount });
  }, []);

  return (
    <div className="animate-fade-in">
      <section className="hero" style={{ padding: '80px 0 100px', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="text-gradient" style={{ fontSize: '4.5rem', marginBottom: '16px', lineHeight: '1.1' }}>
            Donate blood today, save a life tomorrow.
          </h1>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-main)', maxWidth: '700px', margin: '0 auto 48px', fontWeight: '500' }}>
            Find Blood Instantly During Emergencies. Join the largest AI-powered network connecting donors with hospitals in real-time.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/donor/dashboard" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              <Droplet size={24} />
              Donate Blood
            </Link>
            <Link to="/hospital/request" className="btn" style={{ backgroundColor: '#ff9800', color: 'white', padding: '16px 32px', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)' }}>
              <AlertCircle size={24} />
              Request Blood
            </Link>
            <Link to="/search" className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem', backgroundColor: 'white' }}>
              <Search size={24} />
              Search Blood
            </Link>
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section style={{ backgroundColor: 'white', padding: '60px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'center' }}>
            
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'inline-flex', backgroundColor: 'var(--primary-light)', padding: '20px', borderRadius: '50%', color: 'var(--primary)', marginBottom: '16px' }}>
                <Users size={40} />
              </div>
              <h2 style={{ fontSize: '3rem', color: 'var(--dark)', marginBottom: '8px' }}>{stats.donors}+</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Donors</p>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'inline-flex', backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '50%', color: '#1976d2', marginBottom: '16px' }}>
                <Building size={40} />
              </div>
              <h2 style={{ fontSize: '3rem', color: 'var(--dark)', marginBottom: '8px' }}>{stats.hospitals}+</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Partner Hospitals</p>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'inline-flex', backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '50%', color: '#2e7d32', marginBottom: '16px' }}>
                <Heart size={40} />
              </div>
              <h2 style={{ fontSize: '3rem', color: 'var(--dark)', marginBottom: '8px' }}>{stats.units}+</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Blood Units Collected</p>
            </div>

          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '80px 24px' }}>
        <div className="card-grid" style={{ padding: '0' }}>
          <div className="feature-card">
            <div className="feature-icon">
              <ShieldCheck size={32} />
            </div>
            <h3 className="feature-title">AI-Powered Matching</h3>
            <p className="feature-desc">Our intelligent algorithm instantly connects emergency requests with the nearest eligible donors based on real-time location.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#fff3e0', color: '#f57c00' }}>
              <AlertCircle size={32} />
            </div>
            <h3 className="feature-title">Emergency Broadcasts</h3>
            <p className="feature-desc">Critical blood shortages trigger immediate push notifications to eligible donors within a 10km radius.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
              <Activity size={32} />
            </div>
            <h3 className="feature-title">Real-time Inventory</h3>
            <p className="feature-desc">Hospitals and blood banks have synchronized access to live blood stock data, eliminating critical wait times.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
