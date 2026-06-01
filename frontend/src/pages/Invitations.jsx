import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [message, setMessage] = useState('');

  const fetchInvitations = async () => {
    try {
      const res = await api.get('/requests');
      setInvitations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleRespond = async (id, status) => {
    try {
      await api.put(`/requests/${id}/respond`, { status });
      setMessage(`Successfully marked invitation as ${status}!`);
      fetchInvitations();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px' }}>
        <h2>Emergency Donation Invites</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Below are emergency blood requests matching your blood group and location.
        </p>

        {message && <p className="text-success text-center mb-2" style={{ fontWeight: 'bold' }}>{message}</p>}

        {invitations.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
            No invitations matching your profile at the moment. Thank you for staying available!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {invitations.map((inv) => {
              const isAccepted = inv.myStatus === 'Accepted';
              return (
                <div key={inv._id} style={{
                  padding: '1.5rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.6)',
                  border: `1px solid ${isAccepted ? '#00b894' : 'rgba(0,0,0,0.05)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h4 style={{ color: 'var(--primary-color)' }}>ID: {inv.requestId}</h4>
                    <p><strong>Urgency:</strong> <span style={{
                      color: inv.urgencyLevel === 'High' ? 'red' : 'orange',
                      fontWeight: 'bold'
                    }}>{inv.urgencyLevel}</span></p>
                    <p><strong>Required Units:</strong> {inv.unitsRequired} | <strong>Blood Group:</strong> {inv.bloodGroup}</p>
                    <p><strong>Location:</strong> {inv.city}{inv.state ? `, ${inv.state}` : ''}</p>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Your Status:</strong> <span style={{
                        color: inv.myStatus === 'Accepted' ? 'green' : inv.myStatus === 'Ignored' ? 'red' : 'blue',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>{inv.myStatus}</span>
                    </p>

                    {/* FR-26: Share requester details only after donor consent (Accepted) */}
                    {isAccepted && inv.requester && (
                      <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0, 184, 148, 0.1)', borderRadius: '8px', borderLeft: '4px solid #00b894' }}>
                        <h5 style={{ color: '#00b894', marginBottom: '0.25rem' }}>Requester Contact Details</h5>
                        <p style={{ margin: 0 }}><strong>Name:</strong> {inv.requester.name}</p>
                        <p style={{ margin: 0 }}><strong>Phone:</strong> {inv.requester.contactNumber}</p>
                        <p style={{ margin: 0 }}><strong>Email:</strong> {inv.requester.email}</p>
                      </div>
                    )}
                  </div>
                  
                  {inv.myStatus === 'Notified' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-primary" style={{ background: '#00b894' }} onClick={() => handleRespond(inv._id, 'Accepted')}>
                        Accept
                      </button>
                      <button className="btn-primary" style={{ background: 'var(--text-muted)' }} onClick={() => handleRespond(inv._id, 'Ignored')}>
                        Ignore
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitations;
