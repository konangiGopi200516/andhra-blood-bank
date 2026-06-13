import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, ShieldCheck, Mail, Phone, MapPin, Lock, FileText, CheckCircle2 } from 'lucide-react';

const HospitalAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    hospitalName: '',
    email: '',
    phone: '',
    license: '',
    address: '',
    password: ''
  });

  const navigate = useNavigate();
  
  const FIREBASE_URL = 'https://blood-bank-3b1cc-default-rtdb.firebaseio.com/hospitals.json';

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(FIREBASE_URL);
      const data = await response.json();

      if (data) {
        // Find if hospital exists with matching email and password, ignoring whitespace/case
        const hospitals = Object.values(data);
        const userExists = hospitals.find(h => 
          h.email?.trim().toLowerCase() === formData.email.trim().toLowerCase() && 
          h.password === formData.password
        );

        if (userExists) {
          // Store basic info in local storage (mock session)
          localStorage.setItem('hospitalUser', JSON.stringify(userExists));
          navigate('/hospital/dashboard');
        } else {
          setError('Invalid email or password');
        }
      } else {
         setError('No accounts found. Please register first.');
      }
    } catch (err) {
      setError('Failed to connect to database.');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(FIREBASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hospitalName: formData.hospitalName,
          email: formData.email,
          phone: formData.phone,
          license: formData.license,
          address: formData.address,
          password: formData.password,
          status: 'Pending',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError('Failed to register. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to database.');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError('Please enter your email address to reset your password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(FIREBASE_URL);
      const data = await response.json();
      
      let userExists = null;
      if (data) {
        const hospitals = Object.values(data);
        userExists = hospitals.find(h => h.email?.trim().toLowerCase() === formData.email.trim().toLowerCase());
      }

      if (userExists) {
        const emailResponse = await fetch('https://andhra-blood-bank.vercel.app/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email,
            hospitalName: userExists.hospitalName || 'Hospital Admin',
            status: 'ResetPassword'
          })
        });

        if (emailResponse.ok) {
          setResetSent(true);
        } else {
          setError('Failed to send reset email. Please try again.');
        }
      } else {
        setError('No account found with that email address.');
      }
    } catch (err) {
      setError('Failed to connect to database.');
    }
    setLoading(false);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '80px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
      
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '40px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', width: '100%', maxWidth: '500px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', backgroundColor: '#e3f2fd', padding: '16px', borderRadius: '50%', color: '#1976d2', marginBottom: '16px' }}>
            <Building size={32} />
          </div>
          <h2 style={{ fontSize: '2rem', color: 'var(--dark)' }}>{resetSent ? 'Check Your Email' : (isForgot ? 'Reset Password' : (isLogin ? 'Hospital Portal Login' : 'Register Hospital'))}</h2>
          <p className="text-muted" style={{ marginTop: '8px' }}>
            {resetSent ? `A password reset link has been successfully sent to ${formData.email}.` : (isForgot ? 'Enter your email to receive a password reset link.' : (isLogin ? 'Access the central blood inventory and emergency requests.' : 'Join the network to access real-time blood inventory.'))}
          </p>
        </div>

        {submitted && !isLogin ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <CheckCircle2 size={64} color="#2e7d32" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.5rem', color: '#2e7d32', marginBottom: '12px' }}>Registration Submitted</h3>
            <p className="text-muted" style={{ marginBottom: '24px' }}>
              Your hospital registration is currently pending admin approval. We will verify your License Number and notify you once your account is activated.
            </p>
            <button className="btn btn-outline" onClick={() => { setIsLogin(true); setSubmitted(false); }} style={{ width: '100%' }}>Back to Login</button>
          </div>
        ) : isForgot ? (
          resetSent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ display: 'inline-flex', backgroundColor: '#e8f5e9', padding: '16px', borderRadius: '50%', color: '#2e7d32', marginBottom: '24px' }}>
                <CheckCircle2 size={48} />
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--dark)', marginBottom: '32px' }}>
                Please check your inbox (and spam folder) for the reset instructions.
              </p>
              <button className="btn btn-primary" onClick={() => { setIsForgot(false); setResetSent(false); }} style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}>
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword}>
            {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> Registered Email
              </label>
              <input type="email" name="email" className="form-input" placeholder="hospital@example.com" value={formData.email} onChange={handleInputChange} required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Processing...' : 'Send Reset Link'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button type="button" onClick={() => { setIsForgot(false); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', fontWeight: '500' }}>Back to Login</button>
            </div>
          </form>
          )
        ) : (
          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
            
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building size={16} /> Hospital Name
                </label>
                <select name="hospitalName" className="form-input" value={formData.hospitalName} onChange={handleInputChange} required style={{ backgroundColor: 'white', padding: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' }}>
                  <option value="" disabled>Select a verified hospital...</option>
                  <optgroup label="Major Multi-Speciality Hospitals">
                    <option value="Manipal Hospital Vijayawada">Manipal Hospital Vijayawada</option>
                    <option value="Aster Ramesh Hospital">Aster Ramesh Hospital</option>
                    <option value="Aster Ramesh Hospital - Best Multispeciality Hospital in Vijayawada Main Branch">Aster Ramesh Hospital - Best Multispeciality Hospital in Vijayawada Main Branch</option>
                    <option value="Andhra Hospitals">Andhra Hospitals</option>
                    <option value="Andhra Hospital Heart And Brain Institute">Andhra Hospital Heart And Brain Institute</option>
                    <option value="Aayush Hospitals">Aayush Hospitals</option>
                    <option value="Kamineni Hospitals | Best Multispeciality hospital in Vijayawada">Kamineni Hospitals | Best Multispeciality hospital in Vijayawada</option>
                    <option value="Sentini City Hospital | Best Multi-speciality Hospital in Vijayawada">Sentini City Hospital | Best Multi-speciality Hospital in Vijayawada</option>
                    <option value="Unity Hospitals | Multi Speciality Hospital in Vijayawada">Unity Hospitals | Multi Speciality Hospital in Vijayawada</option>
                    <option value="Help Hospitals">Help Hospitals</option>
                    <option value="Latha Super Speciality Hospital">Latha Super Speciality Hospital</option>
                    <option value="Vijaya Super Speciality Hospital">Vijaya Super Speciality Hospital</option>
                    <option value="Nagarjuna Hospital">Nagarjuna Hospital</option>
                    <option value="Manvi Hospitals vijayawada">Manvi Hospitals vijayawada</option>
                    <option value="Nori Hospitals">Nori Hospitals</option>
                    <option value="Apple Hospitals">Apple Hospitals</option>
                    <option value="Svara Super Speciality Hospital">Svara Super Speciality Hospital</option>
                    <option value="Jaya Sree Liberty Hospitals">Jaya Sree Liberty Hospitals</option>
                  </optgroup>
                  <optgroup label="Women & Children Hospitals">
                    <option value="Ankura Hospital for Women & Children - Vijayawada">Ankura Hospital for Women & Children - Vijayawada</option>
                    <option value="Rainbow Children's Hospital">Rainbow Children's Hospital</option>
                    <option value="Mother and Child Hospital">Mother and Child Hospital</option>
                  </optgroup>
                  <optgroup label="Government Hospitals">
                    <option value="Government General Hospital (GGH)">Government General Hospital (GGH)</option>
                    <option value="New Government Hospital">New Government Hospital</option>
                    <option value="AIIMS Mangalagiri">AIIMS Mangalagiri</option>
                  </optgroup>
                </select>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>Only approved hospitals within 100km of Vijayawada can register.</small>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> Email Address
              </label>
              <input type="email" name="email" className="form-input" placeholder="hospital@example.com" value={formData.email} onChange={handleInputChange} required />
            </div>

            {isLogin ? (
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} /> Password
                </label>
                <input type="password" name="password" className="form-input" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required />
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} /> Phone Number
                    </label>
                    <input type="tel" name="phone" className="form-input" placeholder="+91" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} /> License Number
                    </label>
                    <input type="text" name="license" className="form-input" placeholder="REG-12345" value={formData.license} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} /> Hospital Address
                  </label>
                  <textarea name="address" className="form-input" placeholder="Full street address..." rows="2" value={formData.address} onChange={handleInputChange} required style={{ resize: 'none' }}></textarea>
                </div>
                <div className="form-group" style={{ marginBottom: '32px' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={16} /> Create Password
                  </label>
                  <input type="password" name="password" className="form-input" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Processing...' : (isLogin ? 'Login to Portal' : 'Submit Registration')}
            </button>
            
            {isLogin && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button type="button" onClick={() => { setIsForgot(true); setResetSent(false); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>Forgot Password?</button>
              </div>
            )}
          </form>
        )}

        {!isForgot && (
          <div style={{ textAlign: 'center', marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>
              {isLogin ? "Don't have an account?" : "Already registered?"}
            </p>
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setSubmitted(false); setError(''); }} 
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' }}
            >
              {isLogin ? 'Register your Hospital' : 'Login to existing account'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default HospitalAuth;
