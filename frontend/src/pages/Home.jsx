import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <div className="glass-panel text-center" style={{ maxWidth: '600px', width: '100%' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
          Save a Life Today.
        </h1>
        
        {!token ? (
          <>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Welcome to BloodDrop. We connect eligible blood donors with emergency requesters efficiently and securely. Join our network and make a difference.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Become a Donor / Requester</Link>
              <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', background: 'var(--text-main)' }}>Sign In</Link>
            </div>
          </>
        ) : role === 'donor' ? (
          <>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Welcome back! Thank you for being a part of our life-saving community. Keep your health profile updated to stay eligible for emergency invitations.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/profile" className="btn-primary" style={{ textDecoration: 'none' }}>Update My Health Profile</Link>
              <Link to="/invitations" className="btn-primary" style={{ textDecoration: 'none', background: 'var(--text-main)' }}>View Donation Invites</Link>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Welcome back! If you or a hospital require blood urgently, submit a new emergency request below. We will instantly notify compatible, nearby donors.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/requests" className="btn-primary" style={{ textDecoration: 'none' }}>Request Blood Now</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
