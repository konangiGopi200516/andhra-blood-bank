import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Droplet, CheckCircle2 } from 'lucide-react';

const DonorAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bloodGroup: '',
    address: '',
    password: ''
  });

  const navigate = useNavigate();
  
  const FIREBASE_URL = 'https://blood-bank-3b1cc-default-rtdb.firebaseio.com/donors.json';

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

      if (data && data.error) {
        setError(`Database error: ${data.error}. Please check Firebase rules or data access.`);
      } else if (data) {
        // Find if donor exists with matching email and password, ignoring whitespace/case
        const donors = Object.values(data);
        const userExists = donors.find(d => 
          d && d.email &&
          d.email.trim().toLowerCase() === formData.email.trim().toLowerCase() && 
          d.password === formData.password
        );

        if (userExists) {
          // Store basic info in local storage (mock session)
          localStorage.setItem('donorUser', JSON.stringify(userExists));
          navigate('/donor/dashboard');
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
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          bloodGroup: formData.bloodGroup,
          address: formData.address,
          password: formData.password,
          status: 'Eligible',
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
        const donors = Object.values(data);
        userExists = donors.find(d => d.email?.trim().toLowerCase() === formData.email.trim().toLowerCase());
      }

      if (userExists) {
        const emailResponse = await fetch('https://andhra-blood-bank-api.vercel.app/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: formData.email,
            hospitalName: userExists.fullName || 'Donor',
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
          <div style={{ display: 'inline-flex', backgroundColor: '#ffebee', padding: '16px', borderRadius: '50%', color: '#c62828', marginBottom: '16px' }}>
            <Droplet size={32} />
          </div>
          <h2 style={{ fontSize: '2rem', color: 'var(--dark)' }}>{resetSent ? 'Check Your Email' : (isForgot ? 'Reset Password' : (isLogin ? 'Donor Login' : 'Become a Donor'))}</h2>
          <p className="text-muted" style={{ marginTop: '8px' }}>
            {resetSent ? `A password reset link has been successfully sent to ${formData.email}.` : (isForgot ? 'Enter your email to receive a password reset link.' : (isLogin ? 'Welcome back! Login to manage your donations.' : 'Join the community and help save lives.'))}
          </p>
        </div>

        {submitted && !isLogin ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <CheckCircle2 size={64} color="#2e7d32" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.5rem', color: '#2e7d32', marginBottom: '12px' }}>Registration Successful!</h3>
            <p className="text-muted" style={{ marginBottom: '24px' }}>
              Your donor profile has been created successfully. You can now login to schedule your first donation.
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
              <input type="email" name="email" className="form-input" placeholder="donor@example.com" value={formData.email} onChange={handleInputChange} required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Processing...' : 'Send Reset Link'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button type="button" onClick={() => { setIsForgot(false); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '500' }}>Back to Login</button>
            </div>
          </form>
          )
        ) : (
          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
            
            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} /> Full Name
                  </label>
                  <input type="text" name="fullName" className="form-input" placeholder="e.g. John Doe" value={formData.fullName} onChange={handleInputChange} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} /> Phone Number
                    </label>
                    <input type="tel" name="phone" className="form-input" placeholder="+91" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Droplet size={16} /> Blood Group
                    </label>
                    <select name="bloodGroup" className="form-input" value={formData.bloodGroup} onChange={handleInputChange} required>
                      <option value="">Select Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> Email Address
              </label>
              <input type="email" name="email" className="form-input" placeholder="donor@example.com" value={formData.email} onChange={handleInputChange} required />
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
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} /> Residential Address
                  </label>
                  <textarea name="address" className="form-input" placeholder="City, State" rows="2" value={formData.address} onChange={handleInputChange} required style={{ resize: 'none' }}></textarea>
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
              {loading ? 'Processing...' : (isLogin ? 'Login to Dashboard' : 'Register as Donor')}
            </button>
            
            {isLogin && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button type="button" onClick={() => { setIsForgot(true); setResetSent(false); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}>Forgot Password?</button>
              </div>
            )}
          </form>
        )}

        {!isForgot && (
          <div style={{ textAlign: 'center', marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>
              {isLogin ? "New to Andhra Blood Connect?" : "Already registered?"}
            </p>
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setSubmitted(false); setError(''); }} 
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' }}
            >
              {isLogin ? 'Create an Account' : 'Login to your account'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DonorAuth;
