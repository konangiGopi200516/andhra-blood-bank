import React, { useState, useEffect } from 'react';
import { Users, Droplet, Activity, FileText, Database, CheckCircle, Truck, TrendingUp, Trash2, Pencil } from 'lucide-react';
import BloodInventory from './BloodInventory';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('adminAuth') === 'true');
  const [passwordInput, setPasswordInput] = useState('');

  const [donors, setDonors] = useState([]);

  const fetchDonors = async () => {
    try {
      const response = await fetch('https://blood-bank-3b1cc-default-rtdb.firebaseio.com/donors.json');
      const data = await response.json();
      if (data) {
        const mappedDonors = Object.keys(data).map(key => ({
          id: key,
          name: data[key].fullName || data[key].name || 'Unknown',
          bg: data[key].bloodGroup || 'Unknown',
          donations: data[key].donations || 0,
          last: data[key].lastDonation || 'Never',
          status: 'Eligible',
          ...data[key]
        }));
        setDonors(mappedDonors);
      } else {
        setDonors([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const [hospitals, setHospitals] = useState(() => {
    const saved = localStorage.getItem('admin_hospitals_v3');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Manipal Hospital Vijayawada', loc: 'Vijayawada', contact: '9848012340', status: 'Active' },
      { id: 2, name: 'Aster Ramesh Hospital', loc: 'Vijayawada', contact: '9848012341', status: 'Active' },
      { id: 3, name: 'Aster Ramesh Hospital - Best Multispeciality Hospital in Vijayawada Main Branch', loc: 'Vijayawada', contact: '9848012342', status: 'Active' },
      { id: 4, name: 'Andhra Hospitals', loc: 'Vijayawada', contact: '9848012343', status: 'Active' },
      { id: 5, name: 'Andhra Hospital Heart And Brain Institute', loc: 'Vijayawada', contact: '9848012344', status: 'Active' },
      { id: 6, name: 'Aayush Hospitals', loc: 'Vijayawada', contact: '9848012345', status: 'Active' },
      { id: 7, name: 'Kamineni Hospitals | Best Multispeciality hospital in Vijayawada', loc: 'Vijayawada', contact: '9848012346', status: 'Active' },
      { id: 8, name: 'Sentini City Hospital | Best Multi-speciality Hospital in Vijayawada', loc: 'Vijayawada', contact: '9848012347', status: 'Active' },
      { id: 9, name: 'Unity Hospitals | Multi Speciality Hospital in Vijayawada', loc: 'Vijayawada', contact: '9848012348', status: 'Active' },
      { id: 10, name: 'Help Hospitals', loc: 'Vijayawada', contact: '9848012349', status: 'Active' },
      { id: 11, name: 'Latha Super Speciality Hospital', loc: 'Vijayawada', contact: '9848012350', status: 'Active' },
      { id: 12, name: 'Vijaya Super Speciality Hospital', loc: 'Vijayawada', contact: '9848012351', status: 'Active' },
      { id: 13, name: 'Nagarjuna Hospital', loc: 'Vijayawada', contact: '9848012352', status: 'Active' },
      { id: 14, name: 'Manvi Hospitals vijayawada', loc: 'Vijayawada', contact: '9848012353', status: 'Active' },
      { id: 15, name: 'Nori Hospitals', loc: 'Vijayawada', contact: '9848012354', status: 'Active' },
      { id: 16, name: 'Apple Hospitals', loc: 'Vijayawada', contact: '9848012355', status: 'Active' },
      { id: 17, name: 'Svara Super Speciality Hospital', loc: 'Vijayawada', contact: '9848012356', status: 'Active' },
      { id: 18, name: 'Jaya Sree Liberty Hospitals', loc: 'Vijayawada', contact: '9848012357', status: 'Active' },
      { id: 19, name: 'Ankura Hospital for Women & Children - Vijayawada', loc: 'Vijayawada', contact: '9848012358', status: 'Active' },
      { id: 20, name: "Rainbow Children's Hospital", loc: 'Vijayawada', contact: '9848012359', status: 'Active' },
      { id: 21, name: 'Mother and Child Hospital', loc: 'Vijayawada', contact: '9848012360', status: 'Active' },
      { id: 22, name: 'Government General Hospital (GGH)', loc: 'Vijayawada', contact: '9848012361', status: 'Active' },
      { id: 23, name: 'New Government Hospital', loc: 'Vijayawada', contact: '9848012362', status: 'Active' },
      { id: 24, name: 'AIIMS Mangalagiri', loc: 'Mangalagiri', contact: '9848012363', status: 'Active' }
    ];
  });

  const [newDonor, setNewDonor] = useState({ name: '', bg: '', donations: 0, last: '', status: 'Eligible' });
  const [editDonorId, setEditDonorId] = useState(null);
  const [newHospital, setNewHospital] = useState({ name: '', loc: '', contact: '', status: 'Active' });
  const [editHospitalId, setEditHospitalId] = useState(null);



  useEffect(() => {
    localStorage.setItem('admin_hospitals_v3', JSON.stringify(hospitals));
  }, [hospitals]);

  const FIREBASE_URL = 'https://blood-bank-3b1cc-default-rtdb.firebaseio.com/requests.json';

  const fetchRequests = async () => {
    try {
      const response = await fetch(FIREBASE_URL);
      const data = await response.json();
      if (data) {
        const reqArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRequests(reqArray);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (req) => {
    try {
      // Update Firebase to Ready for Pickup
      await fetch(`https://blood-bank-3b1cc-default-rtdb.firebaseio.com/requests/${req.id}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'Ready for Pickup',
          packedBy: 'Admin Team',
          collectionTime: '--',
          dispatchTime: new Date().toLocaleTimeString()
        })
      });
      fetchRequests();

      // Send Email Notification via Nodemailer backend
      try {
        const response = await fetch('https://andhra-blood-bank-api.vercel.app/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: req.email || 'hospital@example.com',
            hospitalName: req.hospital,
            bloodGroup: req.bloodGroup,
            units: req.units,
            status: 'Approved'
          })
        });
        
        if (response.ok) {
          console.log("Email sent successfully!");
          alert(`Email successfully sent to ${req.hospital} (${req.email})!`);
        } else {
          console.error("Failed to send email");
          alert("Could not send email. Did you configure your Gmail credentials in the backend?");
        }
      } catch (emailErr) {
        console.error('Failed to send approval email:', emailErr);
        alert("Could not connect to the email API. Ensure your backend Vercel URL is correct and running.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReceived = async (req) => {
    try {
      await fetch(`https://blood-bank-3b1cc-default-rtdb.firebaseio.com/requests/${req.id}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'Received',
          collectionTime: new Date().toLocaleTimeString()
        })
      });
      fetchRequests();

      // Send Received Email Notification
      try {
        const response = await fetch('https://andhra-blood-bank-api.vercel.app/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: req.email || 'hospital@example.com',
            hospitalName: req.hospital,
            bloodGroup: req.bloodGroup,
            units: req.units,
            status: 'Received'
          })
        });
        
        if (response.ok) {
          alert(`Success! Delivery confirmation email sent to ${req.hospital}.`);
        }
      } catch (emailErr) {
        console.error('Failed to send received email:', emailErr);
      }

    } catch(err) {
      console.error(err);
    }
  };

  const handleRevertStatus = async (id, previousStatus) => {
    try {
      await fetch(`https://blood-bank-3b1cc-default-rtdb.firebaseio.com/requests/${id}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: previousStatus,
          collectionTime: '--'
        })
      });
      fetchRequests();
    } catch(err) {
      console.error(err);
    }
  };

  const handleAddDonor = async () => {
    if (!newDonor.name) return;
    try {
      if (editDonorId) {
        await fetch(`https://blood-bank-3b1cc-default-rtdb.firebaseio.com/donors/${editDonorId}.json`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            fullName: newDonor.name,
            bloodGroup: newDonor.bg,
            donations: newDonor.donations,
            lastDonation: newDonor.last
          })
        });
        setEditDonorId(null);
      } else {
        await fetch('https://blood-bank-3b1cc-default-rtdb.firebaseio.com/donors.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: newDonor.name,
            bloodGroup: newDonor.bg,
            donations: newDonor.donations,
            lastDonation: newDonor.last
          })
        });
      }
      setNewDonor({ name: '', bg: '', donations: 0, last: '', status: 'Eligible' });
      fetchDonors();
    } catch(e) {
      console.error(e);
    }
  };

  const handleEditDonor = (d) => {
    setNewDonor({ name: d.name, bg: d.bg, donations: d.donations, last: d.last, status: d.status });
    setEditDonorId(d.id);
  };

  const handleDeleteDonor = async (id) => {
    try {
      await fetch(`https://blood-bank-3b1cc-default-rtdb.firebaseio.com/donors/${id}.json`, {
        method: 'DELETE'
      });
      fetchDonors();
    } catch(e) {
      console.error(e);
    }
  };

  const handleAddHospital = () => {
    if (!newHospital.name) return;
    if (editHospitalId) {
      setHospitals(hospitals.map(h => h.id === editHospitalId ? { ...newHospital, id: editHospitalId } : h));
      setEditHospitalId(null);
    } else {
      setHospitals([...hospitals, { ...newHospital, id: Date.now() }]);
    }
    setNewHospital({ name: '', loc: '', contact: '', status: 'Active' });
  };

  const handleEditHospital = (h) => {
    setNewHospital({ name: h.name, loc: h.loc, contact: h.contact, status: h.status });
    setEditHospitalId(h.id);
  };

  const handleDeleteHospital = (id) => {
    setHospitals(hospitals.filter(h => h.id !== id));
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f5f7fa' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', width: '400px' }}>
          <h2 style={{ marginBottom: '20px', color: 'var(--dark)' }}>Admin Login</h2>
          <input 
            type="password" 
            placeholder="Enter Admin Password" 
            value={passwordInput} 
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ padding: '10px', width: '100%', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            onClick={() => {
              if (passwordInput === 'Gopi@7842239728') {
                setIsAuthenticated(true);
                localStorage.setItem('adminAuth', 'true');
              } else {
                alert('Incorrect Password');
              }
            }}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout animate-fade-in">
      <aside className="sidebar">
        <ul className="sidebar-menu">
          <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Overview'); }} className={`sidebar-link ${activeTab === 'Overview' ? 'active' : ''}`}><Activity size={20} /> Overview</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Donors'); }} className={`sidebar-link ${activeTab === 'Donors' ? 'active' : ''}`}><Users size={20} /> Donors</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Hospitals'); }} className={`sidebar-link ${activeTab === 'Hospitals' ? 'active' : ''}`}><Activity size={20} /> Hospitals</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Blood Inventory'); }} className={`sidebar-link ${activeTab === 'Blood Inventory' ? 'active' : ''}`}><Droplet size={20} /> Blood Inventory</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Requests'); }} className={`sidebar-link ${activeTab === 'Requests' ? 'active' : ''}`}><FileText size={20} /> Requests</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('Reports'); }} className={`sidebar-link ${activeTab === 'Reports' ? 'active' : ''}`}><Database size={20} /> Reports</a></li>
        </ul>
      </aside>
      
      <main className="dashboard-content">
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--dark)' }}>Super Admin Portal</h2>
            <p className="text-muted">Andhra Blood Connect - Central Organization Dashboard</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: '#f5f5f5', borderRadius: '20px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>
                A
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--dark)' }}>Super Admin</span>
            </div>
            <div style={{ background: 'white', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontWeight: '500' }}>
              <span style={{ color: '#2e7d32' }}>●</span> Network Online
            </div>
            <button onClick={handleAdminLogout} className="btn btn-outline" style={{ borderColor: '#c62828', color: '#c62828', padding: '8px 16px' }}>Logout Admin</button>
          </div>
        </div>
        
        {activeTab === 'Overview' && (
          <>
            {/* Network Totals */}
            <div className="card-grid" style={{ padding: '0 0 32px 0' }}>
              <div className="feature-card">
                <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '8px' }}>{donors.length}</h3>
                <p className="text-muted" style={{ fontWeight: '500' }}>Total Registered Donors</p>
              </div>
              <div className="feature-card">
                <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '8px' }}>{hospitals.length}</h3>
                <p className="text-muted" style={{ fontWeight: '500' }}>Partner Hospitals Network</p>
              </div>
              <div className="feature-card">
                <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '8px' }}>150 L</h3>
                <p className="text-muted" style={{ fontWeight: '500' }}>Centralized Blood Stock</p>
              </div>
            </div>

            {/* Regional Breakdown */}
            <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: '24px', color: 'var(--dark)' }}>Regional Hubs Overview</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <tr>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>City Hub</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Connected Hospitals</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Active Donors</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Inventory Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {city: 'Vijayawada', hospitals: 12, donors: 450, status: 'Optimal'},
                    {city: 'Guntur', hospitals: 8, donors: 320, status: 'Optimal'},
                    {city: 'Eluru', hospitals: 5, donors: 180, status: 'Low'},
                    {city: 'Tenali', hospitals: 4, donors: 150, status: 'Optimal'},
                    {city: 'Mangalagiri', hospitals: 9, donors: 352, status: 'Optimal'}
                  ].map((hub) => (
                    <tr key={hub.city} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>{hub.city} Regional Bank</td>
                      <td style={{ padding: '16px 8px' }}>{hub.hospitals} Hospitals</td>
                      <td style={{ padding: '16px 8px' }}>{hub.donors} Donors</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ 
                          color: hub.status === 'Optimal' ? '#2e7d32' : '#f57c00', 
                          backgroundColor: hub.status === 'Optimal' ? '#e8f5e9' : '#fff3e0', 
                          padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' 
                        }}>{hub.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'Requests' && (
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--dark)' }}>Pending Hospital Requests</h3>
            {loading ? <p>Loading requests...</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <tr>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Hospital</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Patient</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Blood Group</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Units</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan="6" style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>No pending requests found.</td></tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px 8px', fontWeight: 'bold' }}>{req.hospital}</td>
                        <td style={{ padding: '16px 8px' }}>{req.patientName}</td>
                        <td style={{ padding: '16px 8px', color: 'var(--primary)', fontWeight: 'bold' }}>{req.bloodGroup}</td>
                        <td style={{ padding: '16px 8px' }}>{req.units}</td>
                        <td style={{ padding: '16px 8px' }}>
                          <span style={{ 
                            color: req.status === 'Pending' ? '#ef6c00' : '#2e7d32', 
                            backgroundColor: req.status === 'Pending' ? '#fff3e0' : '#e8f5e9', 
                            padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' 
                          }}>
                            {req.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          {req.status === 'Pending' ? (
                            <button onClick={() => handleApprove(req)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                              <CheckCircle size={14} /> Approve & Pack
                            </button>
                          ) : req.status === 'Ready for Pickup' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button onClick={() => handleReceived(req)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', borderColor: '#2e7d32', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CheckCircle size={14} /> Mark as Received
                              </button>
                              <button onClick={() => handleRevertStatus(req.id, 'Pending')} style={{ background: 'none', border: 'none', color: '#757575', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>Undo</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2e7d32', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                <CheckCircle size={14} /> Completed
                              </span>
                              <button onClick={() => handleRevertStatus(req.id, 'Ready for Pickup')} style={{ background: 'none', border: 'none', color: '#757575', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>Undo</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'Donors' && (
          <div className="animate-fade-in" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--dark)' }}>Registered Donors Directory</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Name" value={newDonor.name} onChange={e => setNewDonor({...newDonor, name: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input type="text" placeholder="Blood Group" value={newDonor.bg} onChange={e => setNewDonor({...newDonor, bg: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }} />
              <input type="number" placeholder="Donations" value={newDonor.donations} onChange={e => setNewDonor({...newDonor, donations: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }} />
              <input type="date" placeholder="Last Donation" value={newDonor.last} onChange={e => setNewDonor({...newDonor, last: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <select value={newDonor.status} onChange={e => setNewDonor({...newDonor, status: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="Eligible">Eligible</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
              <button onClick={handleAddDonor} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                {editDonorId ? 'Update Donor' : 'Add Donor'}
              </button>
              {editDonorId && (
                <button onClick={() => { setEditDonorId(null); setNewDonor({ name: '', bg: '', donations: 0, last: '', status: 'Eligible' }); }} className="btn btn-outline" style={{ padding: '8px 16px' }}>Cancel</button>
              )}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <tr>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Name</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Blood Group</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Total Donations</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Last Donation</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((d) => (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '16px 8px', fontWeight: '500' }}>{d.name}</td>
                      <td style={{ padding: '16px 8px', fontWeight: 'bold', color: 'var(--primary)' }}>{d.bg}</td>
                      <td style={{ padding: '16px 8px' }}>{d.donations}</td>
                      <td style={{ padding: '16px 8px' }}>{d.last}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ 
                          color: d.status === 'Eligible' ? '#2e7d32' : '#d32f2f', 
                          backgroundColor: d.status === 'Eligible' ? '#e8f5e9' : '#ffebee', 
                          padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' 
                        }}>{d.status}</span>
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        <button onClick={() => handleEditDonor(d)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginRight: '12px' }} title="Edit">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDeleteDonor(d.id)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        )}

        {activeTab === 'Hospitals' && (
          <div className="animate-fade-in" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--dark)' }}>Partner Hospitals Network</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Hospital Name" value={newHospital.name} onChange={e => setNewHospital({...newHospital, name: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input type="text" placeholder="Location" value={newHospital.loc} onChange={e => setNewHospital({...newHospital, loc: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <input type="text" placeholder="Contact" value={newHospital.contact} onChange={e => setNewHospital({...newHospital, contact: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              <select value={newHospital.status} onChange={e => setNewHospital({...newHospital, status: e.target.value})} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button onClick={handleAddHospital} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                {editHospitalId ? 'Update Hospital' : 'Add Hospital'}
              </button>
              {editHospitalId && (
                <button onClick={() => { setEditHospitalId(null); setNewHospital({ name: '', loc: '', contact: '', status: 'Active' }); }} className="btn btn-outline" style={{ padding: '8px 16px' }}>Cancel</button>
              )}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <tr>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Hospital Name</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Location</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Contact</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((h) => (
                    <tr key={h.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '16px 8px', fontWeight: '500' }}>{h.name}</td>
                      <td style={{ padding: '16px 8px' }}>{h.loc}</td>
                      <td style={{ padding: '16px 8px' }}>{h.contact}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <span style={{ 
                          color: h.status === 'Active' ? '#2e7d32' : '#616161', 
                          backgroundColor: h.status === 'Active' ? '#e8f5e9' : '#f5f5f5', 
                          padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' 
                        }}>{h.status}</span>
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        <button onClick={() => handleEditHospital(h)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginRight: '12px' }} title="Edit">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDeleteHospital(h.id)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }} title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        )}

        {activeTab === 'Blood Inventory' && (
          <div className="animate-fade-in" style={{ margin: '-40px -24px' }}>
            <BloodInventory isAdmin={true} />
          </div>
        )}

        {activeTab === 'Reports' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
               <h3 style={{ marginBottom: '16px', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <TrendingUp color="var(--primary)" /> System Activity Report
               </h3>
               <p className="text-muted" style={{ marginBottom: '24px' }}>Real-time overview of blood collections vs. requests across the network.</p>
               <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                 <div style={{ flex: '1 1 200px', padding: '24px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                   <p className="text-muted" style={{ marginBottom: '8px' }}>Total Collections (All Time)</p>
                   <h2 style={{ color: '#2e7d32', margin: 0 }}>+{donors.reduce((sum, d) => sum + (Number(d.donations) || 0), 0)} Units</h2>
                 </div>
                 <div style={{ flex: '1 1 200px', padding: '24px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                   <p className="text-muted" style={{ marginBottom: '8px' }}>Total Requested (All Time)</p>
                   <h2 style={{ color: 'var(--primary)', margin: 0 }}>-{requests.reduce((sum, r) => sum + (Number(r.units) || 0), 0)} Units</h2>
                 </div>
                 <div style={{ flex: '1 1 200px', padding: '24px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                   <p className="text-muted" style={{ marginBottom: '8px' }}>Pending Approvals</p>
                   <h2 style={{ color: '#f57c00', margin: 0 }}>{requests.filter(r => r.status === 'Pending').length} Pending</h2>
                 </div>
               </div>
               
               <div style={{ marginTop: '32px' }}>
                 <h4 style={{ marginBottom: '16px', color: 'var(--dark)' }}>Donor Blood Group Distribution</h4>
                 <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '200px', background: '#f8f9fa', padding: '24px', borderRadius: '8px' }}>
                   {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => {
                     const count = donors.filter(d => d.bg === bg).length;
                     const maxCount = Math.max(...['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => donors.filter(d => d.bg === b).length), 1);
                     const heightPercentage = Math.max((count / maxCount) * 100, 5);
                     return (
                       <div key={bg} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%' }}>
                         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%', alignItems: 'center' }}>
                           <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '4px' }}>{count}</span>
                           <div style={{ width: '60%', backgroundColor: 'var(--primary)', borderRadius: '4px 4px 0 0', height: `${heightPercentage}%`, transition: 'height 0.5s ease', opacity: count > 0 ? 1 : 0.3, minHeight: '4px' }}></div>
                         </div>
                         <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--dark)' }}>{bg}</span>
                       </div>
                     )
                   })}
                 </div>
               </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
