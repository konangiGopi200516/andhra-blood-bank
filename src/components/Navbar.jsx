import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplet, Heart, Activity } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  // Get logged in user from local storage
  const donorUser = JSON.parse(localStorage.getItem('donorUser') || 'null');
  const hospitalUser = JSON.parse(localStorage.getItem('hospitalUser') || 'null');
  const loggedInUser = donorUser || hospitalUser;

  const handleLogout = () => {
    localStorage.removeItem('donorUser');
    localStorage.removeItem('hospitalUser');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-brand">
          <Droplet size={32} strokeWidth={2.5} />
          <span>Andhra Blood Connect</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/donor/auth" className={`nav-link ${isActive('/donor/auth') || isActive('/donor/dashboard')}`}>Donors</Link>
          <Link to="/hospital/auth" className={`nav-link ${isActive('/hospital/auth') || isActive('/hospital/dashboard')}`}>Hospitals</Link>
          <Link to="/inventory" className={`nav-link ${isActive('/inventory')}`}>Inventory</Link>
          <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>Admin</Link>
        </div>

        {loggedInUser && (
          <div style={{ position: 'absolute', right: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', 
              padding: '6px 16px 6px 6px', 
              background: 'white', 
              borderRadius: '30px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              border: '1px solid #eaeaea',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--primary) 0%, #ff5252 100%)', 
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 2px 6px rgba(211,47,47,0.3)'
              }}>
                {(loggedInUser.fullName || loggedInUser.hospitalName || loggedInUser.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--dark)' }}>
                  {loggedInUser.fullName || loggedInUser.hospitalName || 'User'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {loggedInUser.email}
                </span>
              </div>
            </div>
            
            <button onClick={handleLogout} className="btn" style={{ 
              padding: '8px 16px', 
              background: 'white', 
              color: 'var(--dark)', 
              border: '1px solid #eaeaea', 
              fontSize: '0.9rem', 
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#d32f2f'; e.currentTarget.style.borderColor = '#ffcdd2'; e.currentTarget.style.background = '#ffebee'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--dark)'; e.currentTarget.style.borderColor = '#eaeaea'; e.currentTarget.style.background = 'white'; }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
