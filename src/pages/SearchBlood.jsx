import React, { useState } from 'react';
import { Search, MapPin, Droplet, PhoneCall, AlertCircle, Mail, Clock, Navigation } from 'lucide-react';

// SearchBlood component with dynamic location-based mock data
const SearchBlood = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [revealedContacts, setRevealedContacts] = useState({});

  const toggleContact = (id) => {
    setRevealedContacts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setRevealedContacts({}); // Reset revealed contacts on new search
    
    // Mocking an API call delay
    setTimeout(() => {
      setIsSearching(false);
      if (bloodGroup && location) {
        // Base templates for realistic blood banks
        const templates = [
          { name: 'City Hospital Blood Bank', type: 'Hospital', distanceBase: 1.2, addressPrefix: 'Main Road' },
          { name: 'Red Cross Society', type: 'Blood Bank', distanceBase: 3.5, addressPrefix: 'Gandhi Chowk' },
          { name: 'Sanjeevani Blood Centre', type: 'Blood Bank', distanceBase: 5.8, addressPrefix: 'Highway Junction' },
          { name: 'Govt General Hospital', type: 'Hospital', distanceBase: 2.0, addressPrefix: 'Market Area' },
          { name: 'Lions Club Blood Center', type: 'Blood Bank', distanceBase: 4.1, addressPrefix: 'Auto Nagar' }
        ];

        // Pick a random number of results (2 to 5)
        const shuffled = [...templates].sort(() => 0.5 - Math.random());
        const numResults = Math.floor(Math.random() * 4) + 2; 
        
        const selected = shuffled.slice(0, numResults).map((template, index) => ({
          id: `${location}-${index}`,
          name: template.name.includes('Govt') ? `Govt Hospital ${location}` : template.name,
          type: template.type,
          location: `${location}`,
          distance: (template.distanceBase + Math.random() * 2).toFixed(1) + ' km',
          contact: `0866-${2435000 + Math.floor(Math.random() * 5000)}`,
          mobile: `9${Math.floor(100000000 + Math.random() * 899999999)}`,
          email: `contact@${template.name.split(' ')[0].toLowerCase()}${location.toLowerCase().replace(/\s/g, '')}.org`,
          address: `${template.addressPrefix}, ${location}, Andhra Pradesh`,
          hours: index % 2 === 0 ? '24/7 Available' : '9:00 AM - 8:00 PM',
          availableUnits: Math.floor(Math.random() * 15) + 1 // random units between 1 and 15
        }));
        
        // Sort by distance to make it more realistic
        selected.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        
        setResults(selected);
      } else {
        setResults([]);
      }
    }, 1000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 24px', maxWidth: '900px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '16px' }}>Find Blood Near You</h2>
        <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Instantly search our network of partner hospitals and blood banks to find available blood units in your area.</p>
      </div>

      <div className="card" style={{ padding: '32px', marginBottom: '40px', background: 'white', borderRadius: 'var(--radius-lg)' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', alignItems: 'flex-end' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontWeight: '600' }}>Blood Group</label>
            <div style={{ position: 'relative' }}>
              <Droplet size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
              <select 
                required
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                style={{ width: '100%', padding: '16px 16px 16px 48px', border: '2px solid #e0e0e0', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', backgroundColor: '#f9f9f9' }}
              >
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

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--dark)', fontWeight: '600' }}>Location / City</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <select 
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '16px 16px 16px 48px', border: '2px solid #e0e0e0', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', backgroundColor: '#f9f9f9' }}
              >
                <option value="">Select Location</option>
                <option value="Vijayawada">Vijayawada</option>
                <option value="Mangalagiri">Mangalagiri</option>
                <option value="Guntur">Guntur</option>
                <option value="Tenali">Tenali</option>
                <option value="Eluru">Eluru</option>
                <option value="Machilipatnam">Machilipatnam</option>
                <option value="Gudivada">Gudivada</option>
                <option value="Nuzvid">Nuzvid</option>
                <option value="Jaggaiahpeta">Jaggaiahpeta</option>
                <option value="Nandigama">Nandigama</option>
                <option value="Mylavaram">Mylavaram</option>
                <option value="Gannavaram">Gannavaram</option>
                <option value="Vuyyuru">Vuyyuru</option>
                <option value="Pamarru">Pamarru</option>
                <option value="Avanigadda">Avanigadda</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: '1.1rem', height: '58px' }} disabled={isSearching}>
            {isSearching ? 'Searching...' : <><Search size={20} /> Search Blood</>}
          </button>

        </form>
      </div>

      {results && (
        <div className="animate-fade-in">
          <h3 style={{ marginBottom: '24px', color: 'var(--dark)' }}>
            Search Results for {bloodGroup} in {location}
          </h3>
          
          {results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {results.map((result) => (
                <div key={result.id} className="card" style={{ display: 'flex', flexDirection: 'column', background: 'white', borderRadius: 'var(--radius-md)', borderLeft: '6px solid var(--primary)', overflow: 'hidden' }}>
                  <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.4rem', color: 'var(--dark)', marginBottom: '4px' }}>{result.name}</h4>
                      <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '500' }}>{result.type}</span>
                        • <MapPin size={14} /> {result.location} ({result.distance})
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ color: '#2e7d32', backgroundColor: '#e8f5e9', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          {result.availableUnits} Units Available
                        </span>
                      </div>
                    </div>
                    <button 
                      className="btn" 
                      onClick={() => toggleContact(result.id)}
                      style={{ backgroundColor: revealedContacts[result.id] ? '#f44336' : '#2196f3', color: 'white', padding: '12px 24px', display: 'flex', gap: '8px', transition: 'background-color 0.3s' }}
                    >
                      <PhoneCall size={18} /> {revealedContacts[result.id] ? 'Hide Contact' : 'Contact'}
                    </button>
                  </div>
                  
                  {revealedContacts[result.id] && (
                    <div className="animate-fade-in" style={{ backgroundColor: '#f9fafb', padding: '24px', borderTop: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                      <div>
                        <h5 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Numbers</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dark)', fontWeight: '500' }}>
                            <PhoneCall size={16} color="#2196f3" /> {result.contact} (Landline)
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dark)', fontWeight: '500' }}>
                            <PhoneCall size={16} color="#2196f3" /> {result.mobile} (Mobile)
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h5 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location & Hours</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--dark)', fontSize: '0.95rem' }}>
                            <Navigation size={16} color="#f44336" style={{ marginTop: '2px', flexShrink: 0 }} /> 
                            <span style={{ lineHeight: '1.4' }}>{result.address}</span>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--dark)', fontSize: '0.95rem' }}>
                            <Clock size={16} color="#ff9800" /> {result.hours}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h5 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Support</h5>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2196f3', fontSize: '0.95rem' }}>
                          <Mail size={16} /> {result.email}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
              <AlertCircle size={48} style={{ margin: '0 auto 16px', color: '#f57c00' }} />
              <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No blood units found</h4>
              <p>We couldn't find any available {bloodGroup} blood units currently in {location}. Please try a different location or check back later.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SearchBlood;
