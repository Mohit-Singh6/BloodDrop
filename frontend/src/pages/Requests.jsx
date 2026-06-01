import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { INDIA_STATES_CITIES, STATE_LIST } from '../data/indiaCities';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    bloodGroup: 'A+',
    unitsRequired: 1,
    state: '',
    city: '',
    urgencyLevel: 'Medium'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setFormData({ ...formData, state: value, city: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/requests', formData);
      setMessage('Emergency request created and matching donors notified!');
      setFormData({ bloodGroup: 'A+', unitsRequired: 1, state: '', city: '', urgencyLevel: 'Medium' });
      fetchRequests();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const handleFulfill = async (id) => {
    try {
      await api.put(`/requests/${id}/fulfill`);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const openMatchedDonors = (reqObj) => {
    setSelectedRequest(reqObj);
    setShowModal(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Create Request Form */}
        <div className="glass-panel" style={{ flex: 1, minWidth: '320px' }}>
          <h2>Request Emergency Blood</h2>
          {message && <p className="text-success mb-2" style={{ fontWeight: 'bold' }}>{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Blood Group Needed</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
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
              <label>Units Required</label>
              <input type="number" name="unitsRequired" value={formData.unitsRequired} onChange={handleChange} min="1" required />
            </div>
            <div className="form-group">
              <label>State</label>
              <select name="state" value={formData.state} onChange={handleChange} required>
                <option value="">— Select State —</option>
                {STATE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {formData.state && (
              <div className="form-group">
                <label>City</label>
                <select name="city" value={formData.city} onChange={handleChange} required>
                  <option value="">— Select City —</option>
                  {(INDIA_STATES_CITIES[formData.state] || []).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Urgency Level</label>
              <select name="urgencyLevel" value={formData.urgencyLevel} onChange={handleChange} required>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating...' : 'Submit Emergency Request'}
            </button>
          </form>
        </div>

        {/* Request History */}
        <div className="glass-panel" style={{ flex: 2, minWidth: '320px' }}>
          <h2>Your Emergency Requests</h2>
          {requests.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No requests submitted yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {requests.map((req) => (
                <div key={req._id} style={{
                  padding: '1.2rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h4 style={{ color: 'var(--primary-color)' }}>ID: {req.requestId}</h4>
                    <p><strong>Blood Group:</strong> {req.bloodGroup} | <strong>Units:</strong> {req.unitsRequired}</p>
                    <p><strong>Location:</strong> {req.city}{req.state ? `, ${req.state}` : ''} | <strong>Urgency:</strong> <span style={{
                      color: req.urgencyLevel === 'High' ? 'red' : req.urgencyLevel === 'Medium' ? 'orange' : 'green',
                      fontWeight: 'bold'
                    }}>{req.urgencyLevel}</span></p>
                    <p><strong>Status:</strong> <span style={{
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      color: req.status === 'Completed' ? 'green' : 'blue'
                    }}>{req.status}</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button className="btn-primary" style={{ background: 'var(--text-main)', fontSize: '0.85rem', padding: '0.5rem 1rem' }} onClick={() => openMatchedDonors(req)}>
                      View Matches ({req.matchedDonors?.length || 0})
                    </button>
                    {req.status !== 'Completed' && (
                      <button className="btn-primary" style={{ background: '#00b894', fontSize: '0.85rem', padding: '0.5rem 1rem' }} onClick={() => handleFulfill(req._id)}>
                        Mark Fulfilled
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Matched Donors Modal */}
      {showModal && selectedRequest && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Matches for {selectedRequest.requestId}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            
            {selectedRequest.matchedDonors.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No eligible local donors matched for this blood group.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedRequest.matchedDonors.map((match, i) => {
                  const hasConsented = match.status === 'Accepted';
                  return (
                    <div key={i} style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.02)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h5>Donor Match #{i + 1}</h5>
                        <p><strong>Response Status:</strong> <span style={{
                          color: match.status === 'Accepted' ? 'green' : match.status === 'Ignored' ? 'red' : 'blue',
                          fontWeight: 'bold'
                        }}>{match.status}</span></p>
                        
                        {/* FR-25 & FR-26: Contact details visible ONLY after donor consent (Accepted) */}
                        {hasConsented ? (
                          <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0, 184, 148, 0.1)', borderRadius: '4px', borderLeft: '3px solid #00b894' }}>
                            <p style={{ margin: 0 }}><strong>Name:</strong> {match.donor.name}</p>
                            <p style={{ margin: 0 }}><strong>Phone:</strong> {match.donor.contactNumber}</p>
                            <p style={{ margin: 0 }}><strong>Email:</strong> {match.donor.email}</p>
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.5rem' }}>
                            🔒 Contact details hidden until donor consents (accepts invitation).
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <button className="btn-primary mt-2" style={{ width: '100%', background: 'var(--text-main)' }} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
