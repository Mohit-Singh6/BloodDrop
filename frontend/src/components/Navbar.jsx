import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const isHospital = localStorage.getItem('isHospital') === 'true';

  return (
    <nav className="glass-panel" style={{ padding: '1rem 2rem', margin: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>BloodDrop</h2>
      </Link>
      <ul style={styles.ul}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        {!token ? (
          <>
            <li><Link to="/login" style={styles.link}>Login</Link></li>
            <li><Link to="/register" style={{...styles.link, ...styles.btn}}>Register</Link></li>
          </>
        ) : (
          <>
            {role === 'donor' && (
              <>
                <li><Link to="/profile" style={styles.link}>My Profile</Link></li>
                <li><Link to="/invitations" style={styles.link}>Donation Invites</Link></li>
              </>
            )}
            {role === 'requester' && (
              <>
                {isHospital && <li><Link to="/inventory" style={styles.link}>Manage Inventory</Link></li>}
                <li><Link to="/requests" style={styles.link}>Request Blood</Link></li>
              </>
            )}
            {role === 'admin' && (
              <li><Link to="/admin" style={styles.link}>Admin Dashboard</Link></li>
            )}
            <li><button onClick={handleLogout} style={{...styles.link, ...styles.btn, border: 'none'}}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

const styles = {
  ul: {
    listStyle: 'none',
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    margin: 0,
    padding: 0
  },
  link: {
    textDecoration: 'none',
    color: 'var(--text-main)',
    fontWeight: '600',
    transition: 'color 0.3s'
  },
  btn: {
    background: 'var(--primary-color)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default Navbar;
