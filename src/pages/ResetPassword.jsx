import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Invalid password reset link. No email found.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let updatedCount = 0;

      // Check donors
      const donorsRes = await fetch('https://blood-bank-3b1cc-default-rtdb.firebaseio.com/donors.json');
      const donorsData = await donorsRes.json();
      if (donorsData && donorsData.error) {
        setError(`Database error: ${donorsData.error}. Please check Firebase rules.`);
        setLoading(false);
        return;
      } else if (donorsData) {
        for (const [key, user] of Object.entries(donorsData)) {
          if (user && user.email && user.email.trim().toLowerCase() === email.trim().toLowerCase()) {
            await fetch(`https://blood-bank-3b1cc-default-rtdb.firebaseio.com/donors/${key}.json`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: newPassword })
            });
            updatedCount++;
          }
        }
      }

      // Check hospitals
      const hospRes = await fetch('https://blood-bank-3b1cc-default-rtdb.firebaseio.com/hospitals.json');
      const hospData = await hospRes.json();
      if (hospData && !hospData.error) {
        for (const [key, user] of Object.entries(hospData)) {
          if (user && user.email && user.email.trim().toLowerCase() === email.trim().toLowerCase()) {
            await fetch(`https://blood-bank-3b1cc-default-rtdb.firebaseio.com/hospitals/${key}.json`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: newPassword })
            });
            updatedCount++;
          }
        }
      }

      if (updatedCount > 0) {
        setSuccess(true);
      } else {
        setError('We could not find an account with this email address.');
      }
    } catch (err) {
      setError('Failed to connect to the database. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '80px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '40px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', width: '100%', maxWidth: '400px' }}>
        
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle2 size={64} color="#2e7d32" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '1.8rem', color: '#2e7d32', marginBottom: '12px' }}>Updated Successfully!</h2>
            <p className="text-muted" style={{ marginBottom: '24px' }}>
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/')} style={{ width: '100%' }}>Go to Home</button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', backgroundColor: '#e3f2fd', padding: '16px', borderRadius: '50%', color: '#1976d2', marginBottom: '16px' }}>
                <Lock size={32} />
              </div>
              <h2 style={{ fontSize: '2rem', color: 'var(--dark)' }}>Reset Password</h2>
              <p className="text-muted" style={{ marginTop: '8px' }}>
                Create a new strong password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
              
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} /> New Password
                </label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} /> Confirm New Password
                </label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
