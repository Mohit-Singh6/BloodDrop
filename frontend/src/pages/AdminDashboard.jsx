import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [tab, setTab] = useState('users'); // 'users' or 'requests'
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);

      const requestsRes = await api.get('/admin/requests');
      setRequests(requestsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/users/${id}/approve`);
      setMessage('Hospital approved successfully!');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user account?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setMessage('User removed successfully.');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to remove this blood request?')) return;
    try {
      await api.delete(`/admin/requests/${id}`);
      setMessage('Emergency request deleted successfully.');
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel">
        <h2 style={{ marginBottom: '1rem' }}>Administrative Dashboard</h2>
        
        {message && <p className="text-success" style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{message}</p>}

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem' }}>
          <button 
            onClick={() => setTab('users')} 
            className="btn-primary" 
            style={{ background: tab === 'users' ? 'var(--primary-color)' : 'var(--text-muted)' }}
          >
            Manage Users ({users.length})
          </button>
          <button 
            onClick={() => setTab('requests')} 
            className="btn-primary" 
            style={{ background: tab === 'requests' ? 'var(--primary-color)' : 'var(--text-muted)' }}
          >
            Monitor Requests ({requests.length})
          </button>
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem' }}>Details</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{u.name}</td>
                    <td style={{ padding: '0.75rem' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>
                      {u.role} {u.isHospital && '(Hospital)'}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
                      <div> {u.contactNumber}</div>
                      <div> {u.city}{u.state ? `, ${u.state}` : ''}</div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {u.isHospital ? (
                        <span style={{ color: u.isApproved ? 'green' : 'orange', fontWeight: 'bold' }}>
                          {u.isApproved ? 'Approved' : 'Pending Approval'}
                        </span>
                      ) : (
                        <span style={{ color: 'green' }}>Active</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {u.isHospital && !u.isApproved && (
                          <button 
                            className="btn-primary" 
                            style={{ background: '#00b894', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            onClick={() => handleApprove(u._id)}
                          >
                            Approve
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button 
                            className="btn-primary" 
                            style={{ background: '#ff7675', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Requests Tab */}
        {tab === 'requests' && (
          <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
                  <th style={{ padding: '0.75rem' }}>ID</th>
                  <th style={{ padding: '0.75rem' }}>Requester</th>
                  <th style={{ padding: '0.75rem' }}>Blood Group</th>
                  <th style={{ padding: '0.75rem' }}>City</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{r.requestId}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <div>{r.requester?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.requester?.email}</div>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>{r.bloodGroup}</td>
                    <td style={{ padding: '0.75rem' }}>{r.city}</td>
                    <td style={{ padding: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{r.status}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button 
                        className="btn-primary" 
                        style={{ background: '#ff7675', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        onClick={() => handleDeleteRequest(r._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
