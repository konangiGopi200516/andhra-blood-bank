import React, { useState } from 'react';
import { Calendar, Droplet, Clock, Award, Activity, X } from 'lucide-react';

const DonorDashboard = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  
  // Read donor from local storage
  const storedDonor = JSON.parse(localStorage.getItem('donorUser') || 'null');

  // Generate unique mock history based on the user's email so it varies per user
  const generateInitialHistory = () => {
    if (!storedDonor?.email) return [];
    
    let hash = 0;
    for (let i = 0; i < storedDonor.email.length; i++) {
      hash += storedDonor.email.charCodeAt(i);
    }
    const numDonations = hash % 6; // random number from 0 to 5
    
    const locations = [
      "Vijayawada Main Blood Bank", 
      "Indian Red Cross Society, Vijayawada", 
      "Government General Hospital, Guntur", 
      "AIIMS Blood Bank, Mangalagiri"
    ];
    
    const history = [];
    let currentYear = new Date().getFullYear() - 1;
    
    for (let i = 0; i < numDonations; i++) {
      history.push({
        id: i + 1,
        date: `${currentYear - i}-0${((hash + i) % 8) + 1}-15`,
        location: locations[(hash + i) % locations.length],
        amount: "450ml",
        status: "Completed"
      });
    }
    return history;
  };

  const [donationHistory, setDonationHistory] = useState(generateInitialHistory);

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const details = {
      date: formData.get('date'),
      time: formData.get('time'),
      location: e.target.location.options[e.target.location.selectedIndex].text
    };
    setAppointmentDetails(details);
    setIsScheduled(true);
    
    // Save to history as Upcoming
    setDonationHistory(prev => [
      {
        id: Date.now(),
        date: `${details.date} at ${details.time}`,
        location: details.location,
        amount: "Pending",
        status: "Upcoming"
      },
      ...prev
    ]);
  };

  const handleViewSchedule = (record) => {
    const parts = record.date.split(' at ');
    setAppointmentDetails({
      date: parts[0],
      time: parts[1] || '',
      location: record.location
    });
    setIsScheduled(true);
    setShowScheduleModal(true);
  };

  const handleMarkAsDonated = (id) => {
    setDonationHistory(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, status: 'Completed', amount: '450ml' };
      }
      return d;
    }));
  };

  const completedDonationsCount = donationHistory.filter(d => d.status === 'Completed').length;
  const lastCompletedDonation = donationHistory.find(d => d.status === 'Completed');

  const donor = {
    name: storedDonor?.fullName || "John Doe",
    bloodGroup: storedDonor?.bloodGroup || "O+",
    lastDonation: lastCompletedDonation ? lastCompletedDonation.date : "Never",
    totalDonations: completedDonationsCount,
    status: storedDonor?.status || "Eligible"
  };



  return (
    <div className="container animate-fade-in" style={{ padding: '40px 24px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Welcome back, {donor.name}</h2>
          <p className="text-muted">Manage your donations and track your impact.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
          <Calendar size={18} /> Schedule Donation
        </button>
      </div>

      {/* Stats Cards */}
      <div className="card-grid" style={{ padding: '0 0 32px 0', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        
        <div className="feature-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#ffebee', padding: '16px', borderRadius: '50%', color: 'var(--primary)' }}>
            <Droplet size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Blood Group</p>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--dark)' }}>{donor.bloodGroup}</h3>
          </div>
        </div>

        <div className="feature-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '50%', color: '#1976d2' }}>
            <Award size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Total Donations</p>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--dark)' }}>{donor.totalDonations}</h3>
          </div>
        </div>

        <div className="feature-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#e8f5e9', padding: '16px', borderRadius: '50%', color: '#2e7d32' }}>
            <Activity size={32} />
          </div>
          <div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Status</p>
            <h3 style={{ fontSize: '1.4rem', color: '#2e7d32' }}>{donor.status}</h3>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        
        {/* Donation History */}
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '24px', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="var(--primary)" /> Donation History
          </h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ borderBottom: '2px solid #f0f0f0' }}>
              <tr>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Location</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Amount</th>
                <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {donationHistory.map((record) => (
                <tr key={record.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '16px 8px', fontWeight: '500' }}>{record.date}</td>
                  <td style={{ padding: '16px 8px', color: 'var(--text-muted)' }}>{record.location}</td>
                  <td style={{ padding: '16px 8px' }}>{record.amount}</td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        color: record.status === 'Completed' ? '#2e7d32' : '#f57c00', 
                        backgroundColor: record.status === 'Completed' ? '#e8f5e9' : '#fff3e0', 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem', 
                        fontWeight: '600' 
                      }}>
                        {record.status}
                      </span>
                      {record.status === 'Upcoming' && (
                        <button 
                          className="btn" 
                          style={{ padding: '4px 12px', fontSize: '0.8rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
                          onClick={() => handleViewSchedule(record)}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Eligibility Info / Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Upcoming Schedule Card */}
          {(() => {
            const upcomingDonation = donationHistory.find(record => record.status === 'Upcoming');
            return (
              <div style={{ background: upcomingDonation ? '#e8f5e9' : 'white', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)', border: `1px solid ${upcomingDonation ? '#c8e6c9' : 'var(--border)'}` }}>
                <h3 style={{ color: upcomingDonation ? '#2e7d32' : 'var(--dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} /> My Schedule
                </h3>
                {upcomingDonation ? (
                  <>
                    <p style={{ margin: '0 0 12px 0', color: 'var(--dark)', fontSize: '0.95rem', display: 'flex', gap: '8px' }}>
                      <Calendar size={16} color="#2e7d32" /> <strong>Date:</strong> {upcomingDonation.date.split(' at ')[0]}
                    </p>
                    <p style={{ margin: '0 0 12px 0', color: 'var(--dark)', fontSize: '0.95rem', display: 'flex', gap: '8px' }}>
                      <Clock size={16} color="#2e7d32" /> <strong>Time:</strong> {upcomingDonation.date.split(' at ')[1]}
                    </p>
                    <p style={{ margin: '0 0 16px 0', color: 'var(--dark)', fontSize: '0.95rem', display: 'flex', gap: '8px' }}>
                      <Droplet size={16} color="#2e7d32" /> <strong>Location:</strong> {upcomingDonation.location}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn" 
                        style={{ flex: 1, padding: '10px', fontSize: '0.9rem', backgroundColor: '#2e7d32', color: 'white', border: 'none' }}
                        onClick={() => handleViewSchedule(upcomingDonation)}
                      >
                        Details
                      </button>
                      <button 
                        className="btn" 
                        style={{ flex: 1, padding: '10px', fontSize: '0.9rem', backgroundColor: '#1976d2', color: 'white', border: 'none' }}
                        onClick={() => handleMarkAsDonated(upcomingDonation.id)}
                      >
                        Mark Donated
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>You have no scheduled slots.</p>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '8px 16px', fontSize: '0.9rem', width: '100%' }}
                      onClick={() => setShowScheduleModal(true)}
                    >
                      Schedule Now
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid #f8bbd0' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '12px' }}>Next Eligible Date</h3>
            <p style={{ color: 'var(--text-main)', marginBottom: '16px' }}>
              Based on your last donation on <strong>{donor.lastDonation}</strong>, you are currently eligible to donate blood safely.
            </p>
            <div style={{ background: 'white', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: '700', color: 'var(--dark)', fontSize: '1.2rem' }}>
              Ready to Donate!
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
             <h3 style={{ color: 'var(--dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Activity size={20} color="var(--primary)" /> Network Statistics
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="text-muted" style={{ fontSize: '0.9rem' }}>Registered Donors</span>
                 <strong style={{ color: 'var(--dark)' }}>12,450</strong>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="text-muted" style={{ fontSize: '0.9rem' }}>Hospitals Connected</span>
                 <strong style={{ color: 'var(--dark)' }}>42</strong>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="text-muted" style={{ fontSize: '0.9rem' }}>Blood Units Available</span>
                 <strong style={{ color: 'var(--dark)' }}>1,250</strong>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="text-muted" style={{ fontSize: '0.9rem' }}>Requests Fulfilled</span>
                 <strong style={{ color: '#2e7d32' }}>98%</strong>
               </div>
             </div>
          </div>
        </div>

      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '32px', background: 'white', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--dark)' }}>Schedule a Donation</h3>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            {isScheduled && appointmentDetails ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ background: '#e8f5e9', color: '#2e7d32', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Calendar size={32} />
                </div>
                <h4 style={{ color: '#2e7d32', marginBottom: '16px', fontSize: '1.4rem' }}>Donation Scheduled!</h4>
                
                <div style={{ background: '#f5f5f5', padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '24px', border: '1px solid #e0e0e0' }}>
                  <h5 style={{ marginTop: 0, marginBottom: '16px', color: 'var(--dark)', fontSize: '1.1rem' }}>Appointment Details:</h5>
                  <p style={{ margin: '0 0 12px 0', color: 'var(--dark)', fontSize: '1.05rem', display: 'flex', gap: '8px' }}>
                    <Calendar size={18} color="var(--primary)" /> <strong>Date:</strong> {appointmentDetails.date}
                  </p>
                  <p style={{ margin: '0 0 12px 0', color: 'var(--dark)', fontSize: '1.05rem', display: 'flex', gap: '8px' }}>
                    <Clock size={18} color="var(--primary)" /> <strong>Time:</strong> {appointmentDetails.time}
                  </p>
                  <p style={{ margin: '0', color: 'var(--dark)', fontSize: '1.05rem', display: 'flex', gap: '8px' }}>
                    <Droplet size={18} color="var(--primary)" /> <strong>Location:</strong> {appointmentDetails.location}
                  </p>
                </div>
                
                <p className="text-muted" style={{ marginBottom: '24px' }}>Please arrive 10 minutes early and bring your valid ID.</p>
                
                <button 
                  onClick={() => { setShowScheduleModal(false); setIsScheduled(false); setAppointmentDetails(null); }} 
                  className="btn btn-primary" 
                  style={{ padding: '12px 32px' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontWeight: '500' }}>Select Date</label>
                  <input name="date" type="date" required style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontWeight: '500' }}>Select Time</label>
                  <input name="time" type="time" required style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontWeight: '500' }}>Location</label>
                  <select name="location" required style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                    <option value="">Select a location near you</option>
                    <option value="vijayawada-main">Vijayawada Main Blood Bank (Near MG Road)</option>
                    <option value="vijayawada-redcross">Indian Red Cross Society, Vijayawada</option>
                    <option value="guntur-gg">Government General Hospital (GGH), Guntur</option>
                    <option value="guntur-sanjeevani">Sanjeevani Blood Centre, Guntur</option>
                    <option value="mangalagiri-aiims">AIIMS Blood Bank, Mangalagiri</option>
                    <option value="amaravati-health">Amaravati Community Health Center</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '16px', width: '100%', padding: '14px', fontSize: '1rem' }}>
                  Confirm Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default DonorDashboard;
