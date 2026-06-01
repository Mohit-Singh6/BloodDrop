import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Profile = () => {
  const [profile, setProfile] = useState({
    bloodGroup: 'A+',
    healthDeclaration: '',
    lastDonationDate: '',
    isAvailable: true
  });
  const [status, setStatus] = useState(null); // isEligible from server
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/donor/profile');
        if (res.data) {
          setProfile({
            bloodGroup: res.data.bloodGroup || 'A+',
            healthDeclaration: res.data.healthDeclaration || '',
            lastDonationDate: res.data.lastDonationDate ? res.data.lastDonationDate.split('T')[0] : '',
            isAvailable: res.data.isAvailable !== undefined ? res.data.isAvailable : true
          });
          setStatus(res.data.isEligible);
        }
      } catch (error) {
        console.log("No profile yet or error", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProfile({ ...profile, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/donor/profile', {
        ...profile,
        lastDonationDate: profile.lastDonationDate || null
      });
      setStatus(res.data.isEligible);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 className="mb-2">Donor Health Profile</h2>
        
        {status !== null && (
          <div style={{
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            background: status ? 'rgba(0, 184, 148, 0.1)' : 'rgba(255, 118, 117, 0.1)',
            color: status ? '#00b894' : '#d63031',
            fontWeight: 'bold',
            border: `1px solid ${status ? '#00b894' : '#d63031'}`
          }}>
            Eligibility Status: {status ? 'ELIGIBLE' : 'INELIGIBLE (Minimum 90 day gap not met)'}
          </div>
        )}

        {message && <p className="text-success text-center mb-2">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Blood Group</label>
            <select name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} required>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Health Declaration (List any conditions)</label>
            <textarea name="healthDeclaration" value={profile.healthDeclaration} onChange={handleChange} required rows="3" placeholder="I declare that I am healthy and fit to donate..."></textarea>
          </div>
          
          <div className="form-group">
            <label>Last Donation Date</label>
            <input type="date" name="lastDonationDate" value={profile.lastDonationDate} onChange={handleChange} />
          </div>
          
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="isAvailable" checked={profile.isAvailable} onChange={handleChange} id="avail" style={{ width: 'auto' }} />
            <label htmlFor="avail" style={{ margin: 0 }}>I am currently available to be contacted for donation</label>
          </div>
          
          <button type="submit" className="btn-primary mt-2">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
