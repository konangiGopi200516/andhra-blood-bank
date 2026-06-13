import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle2, ChevronRight, Droplet, MapPin, Activity } from 'lucide-react';

const HospitalRequest = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: AI Matching, 3: Dispatch Confirmed
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O-',
    units: '3',
    requiredBefore: '2 Hours',
    reason: 'Emergency Surgery',
    hospital: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);
  
  const FIREBASE_URL = 'https://blood-bank-3b1cc-default-rtdb.firebaseio.com/requests.json';

  const [requestId, setRequestId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(FIREBASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'Pending',
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequestId(data.name); // Firebase generated ID
        setStep(2); // Show Pending Screen
      }
    } catch (error) {
      console.error("Failed to submit request", error);
    }
    setLoading(false);
  };

  // Poll for admin approval
  React.useEffect(() => {
    if (step === 2 && requestId) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`https://blood-bank-3b1cc-default-rtdb.firebaseio.com/requests/${requestId}.json`);
          const reqData = await res.json();
          if (reqData && reqData.status === 'Ready for Pickup') {
            setStep(3); // Move to Pickup Screen
          }
        } catch(e) {}
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [step, requestId]);

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px', maxWidth: '1000px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
          <Link to="/hospital/dashboard" className="nav-link" style={{ padding: 0 }}>Dashboard</Link>
          <ChevronRight size={16} />
          <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Emergency Request</span>
        </div>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={36} color="#d32f2f" /> Create Blood Request
        </h2>
        <p className="text-muted" style={{ marginTop: '8px', fontSize: '1.1rem' }}>Initiate an emergency blood transfer workflow.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
        
        {/* Left Column: Form Area */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          {step === 1 && (
            <form onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>Patient Details</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Patient Name</label>
                  <input type="text" className="form-input" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} placeholder="e.g. Ravi Kumar" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Hospital</label>
                  <input type="text" className="form-input" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Hospital Email</label>
                  <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="hospital@example.com" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Blood Group</label>
                  <select className="form-input" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})}>
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option>
                    <option>AB+</option><option>AB-</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Units Required</label>
                  <input type="number" className="form-input" min="1" value={formData.units} onChange={e => setFormData({...formData, units: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Required Before</label>
                  <select className="form-input" value={formData.requiredBefore} onChange={e => setFormData({...formData, requiredBefore: e.target.value})}>
                    <option>1 Hour</option>
                    <option>2 Hours</option>
                    <option>4 Hours</option>
                    <option>12 Hours</option>
                    <option>24 Hours</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label className="form-label">Reason</label>
                <select className="form-input" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} required>
                  <option>Emergency Surgery</option>
                  <option>Accident / Trauma</option>
                  <option>Childbirth / Maternity Complications</option>
                  <option>Cancer Treatment / Chemotherapy</option>
                  <option>Organ Transplant</option>
                  <option>Severe Anemia / Blood Disorder</option>
                  <option>Routine Surgery</option>
                  <option>Other</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.2rem', backgroundColor: '#d32f2f', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Submitting...' : 'Submit Emergency Request'}
              </button>
            </form>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', animation: 'fadeIn 0.5s ease-out' }}>
              <CheckCircle2 size={80} color="#2e7d32" style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '2rem', marginBottom: '16px', color: '#2e7d32' }}>Request Sent Successfully!</h3>
              <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '32px' }}>
                Your request for {formData.units} units of {formData.bloodGroup} has been sent to the Super Admin for approval and dispatch.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                 <button className="btn btn-outline" onClick={() => setStep(1)}>New Request</button>
                 <Link to="/hospital/dashboard" className="btn btn-primary">Go to Dashboard</Link>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', animation: 'fadeIn 0.5s ease-out' }}>
              <CheckCircle2 size={80} color="#2e7d32" style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '2rem', marginBottom: '16px', color: '#2e7d32' }}>Ready for Pickup!</h3>
              <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '32px' }}>
                The Super Admin has approved and packed your request for {formData.units} units of {formData.bloodGroup}. Please send your hospital ambulance to the Central Blood Bank to collect it.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                 <button className="btn btn-outline" onClick={() => setStep(1)}>New Request</button>
                 <Link to="/hospital/dashboard" className="btn btn-primary">Track on Dashboard</Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Status / Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid #f8bbd0' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} /> Live System Status
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}><Droplet size={16} color="var(--primary)"/> {formData.bloodGroup} Inventory</span>
                <span style={{ fontWeight: 'bold', color: '#2e7d32' }}>5 Units Available</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}><MapPin size={16} color="var(--secondary)"/> Nearby Donors</span>
                <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>12 Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}><Clock size={16} color="#f57c00"/> Avg. Delivery Time</span>
                <span style={{ fontWeight: 'bold', color: '#f57c00' }}>14 Mins</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
             <h3 style={{ color: 'var(--dark)', marginBottom: '12px' }}>Workflow Automation</h3>
             <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '12px' }}>
               Upon submission, our AI instantly checks the central database. If units are available, a transfer is dispatched automatically.
             </p>
             <p className="text-muted" style={{ fontSize: '0.95rem' }}>
               If stock is low, Firebase triggers immediate geo-located alerts to eligible {formData.bloodGroup} donors within a 10km radius.
             </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default HospitalRequest;
