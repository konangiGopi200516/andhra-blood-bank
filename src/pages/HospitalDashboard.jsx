import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Building, Activity, Droplet, PlusCircle, AlertCircle, Clock, Phone, MapPin } from 'lucide-react';

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [liveRequests, setLiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged in hospital details
  const storedUser = localStorage.getItem('hospitalUser');
  if (!storedUser) {
    return <Navigate to="/hospital/auth" replace />;
  }

  const [hospital, setHospital] = useState({
    name: "Loading...",
    location: "Loading...",
    contact: "Loading...",
    status: "Active"
  });

  const FIREBASE_URL = 'https://blood-bank-3b1cc-default-rtdb.firebaseio.com/requests.json';

  useEffect(() => {
    // Load hospital info
    const stored = localStorage.getItem('hospitalUser');
    let hName = "Demo Hospital";
    if (stored) {
      const parsed = JSON.parse(stored);
      hName = parsed.hospitalName;
      setHospital({
        name: parsed.hospitalName,
        location: parsed.address,
        contact: parsed.phone,
        status: "Active"
      });
    }

    // Fetch requests
    const fetchRequests = async () => {
      try {
        const response = await fetch(FIREBASE_URL);
        const data = await response.json();
        if (data) {
          const reqArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).filter(req => req.hospital === hName)
             .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setLiveRequests(reqArray);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const inventory = [
    { group: 'A+', units: 45, status: 'Normal' },
    { group: 'O+', units: 12, status: 'Low' },
    { group: 'B+', units: 30, status: 'Normal' },
    { group: 'AB+', units: 8, status: 'Critical' },
    { group: 'A-', units: 15, status: 'Normal' },
    { group: 'O-', units: 5, status: 'Critical' },
    { group: 'B-', units: 10, status: 'Low' },
    { group: 'AB-', units: 4, status: 'Critical' },
  ];

  // Mock legacy requests
  const recentRequests = [];

  const nearbyBloodBanks = [
    { id: 1, name: 'Vijayawada Central Blood Bank', distance: '12 km', status: 'Available', bloodTypes: 'O+, A+, B+', phone: '+91 98765 43210', address: 'MG Road, Vijayawada' },
    { id: 2, name: 'Guntur Red Cross Society', distance: '45 km', status: 'Available', bloodTypes: 'All Types', phone: '+91 98765 43211', address: 'Arundelpet, Guntur' },
    { id: 3, name: 'Eluru Regional Health Hub', distance: '60 km', status: 'Limited', bloodTypes: 'A-, O-, AB+', phone: '+91 98765 43212', address: 'Powerpet, Eluru' },
    { id: 4, name: 'Tenali Life Savers', distance: '35 km', status: 'Available', bloodTypes: 'O+, O-, B+', phone: '+91 98765 43213', address: 'Bose Road, Tenali' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Normal': return { bg: '#e8f5e9', text: '#2e7d32' };
      case 'Low': return { bg: '#fff3e0', text: '#ef6c00' };
      case 'Critical': return { bg: '#ffebee', text: '#c62828' };
      case 'Pending': return { bg: '#fff3e0', text: '#ef6c00' };
      case 'Fulfilled': return { bg: '#e8f5e9', text: '#2e7d32' };
      default: return { bg: '#f5f5f5', text: '#616161' };
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Building size={32} color="var(--primary)" />
            <h2 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>{hospital.name}</h2>
          </div>
          <p className="text-muted" style={{ marginLeft: '44px' }}>Manage blood inventory and requests.</p>
        </div>
        <Link to="/hospital/request" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={18} /> Request Blood
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="card-grid" style={{ padding: '0 0 32px 0', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        
        <div className="feature-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#e8f5e9', padding: '16px', borderRadius: '50%', color: '#2e7d32' }}>
            <Activity size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>System Status</p>
            <h3 style={{ fontSize: '1.4rem', color: '#2e7d32' }}>Connected</h3>
          </div>
        </div>

        <div className="feature-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#ffebee', padding: '16px', borderRadius: '50%', color: 'var(--primary)' }}>
            <AlertCircle size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Critical Shortages</p>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>3</h3>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        
        {/* Inventory Section */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '24px', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplet size={20} color="var(--primary)" /> Current Blood Inventory
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
            {inventory.map((item) => {
              const colors = getStatusColor(item.status);
              return (
                <div key={item.group} style={{ 
                  border: '1px solid #f0f0f0', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '16px', 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--dark)' }}>{item.group}</div>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{item.units} <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>units</span></div>
                  <div style={{ 
                    backgroundColor: colors.bg, 
                    color: colors.text, 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: '600',
                    width: '100%'
                  }}>
                    {item.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Requests Section */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '24px', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="var(--primary)" /> Recent Requests
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ borderBottom: '2px solid #f0f0f0' }}>
                <tr>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Request ID</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Blood Group</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Patient Name</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Reason</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading live requests...</td></tr>
                ) : liveRequests.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>No recent requests found. Make a request to see it here.</td></tr>
                ) : (
                  liveRequests.map((req) => {
                    const statusColors = getStatusColor(req.status);
                    const urgencyColors = getStatusColor('Critical');
                    
                    return (
                      <tr key={req.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px 8px', fontWeight: '500' }}>{req.id.substring(1, 8).toUpperCase()}</td>
                        <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>{new Date(req.timestamp).toLocaleTimeString()}</td>
                        <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>
                           <span style={{ color: 'var(--primary)' }}>{req.bloodGroup}</span> ({req.units} Units)
                        </td>
                        <td style={{ padding: '16px 8px', color: 'var(--text-main)' }}>
                          {req.patientName || 'Emergency Patient'}
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <span style={{ color: urgencyColors.text, backgroundColor: urgencyColors.bg, padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                            {req.reason || 'Emergency'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <span style={{ color: statusColors.text, backgroundColor: statusColors.bg, padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nearby Blood Banks Section */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '24px', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} color="var(--primary)" /> Nearby Blood Banks (Within 100km)
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {nearbyBloodBanks.map((bank) => (
              <div key={bank.id} style={{ border: '1px solid #f0f0f0', borderRadius: 'var(--radius-md)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--dark)' }}>{bank.name}</h4>
                    <span style={{ color: bank.status === 'Available' ? '#2e7d32' : '#ef6c00', backgroundColor: bank.status === 'Available' ? '#e8f5e9' : '#fff3e0', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600' }}>
                      {bank.status}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{bank.distance}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>away</div>
                  </div>
                </div>
                
                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Droplet size={14} color="var(--primary)" /> <strong>Available:</strong> {bank.bloodTypes}
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> {bank.address}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #e0e0e0', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} /> {bank.phone}
                    </span>
                    <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Connect</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HospitalDashboard;
