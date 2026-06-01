import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Inventory = () => {
  const isHospital = localStorage.getItem('isHospital') === 'true';
  const [inventoryList, setInventoryList] = useState([]);
  const [formData, setFormData] = useState({ bloodGroup: 'A+', units: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventoryList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/inventory', formData);
      setMessage('Inventory updated successfully!');
      fetchInventory();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update inventory');
    } finally {
      setLoading(false);
    }
  };

  // Filter inventory list by city or hospital name
  const filteredInventory = inventoryList.filter(item => 
    item.hospital?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.hospital?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Hospital specific update panel */}
        {isHospital && (
          <div className="glass-panel" style={{ flex: 1, minWidth: '300px' }}>
            <h2>Manage Hospital Inventory</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Update available blood stock units for your hospital.
            </p>
            {message && <p className="text-success mb-2" style={{ fontWeight: 'bold' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Blood Group</label>
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
                <label>Units Available</label>
                <input type="number" name="units" value={formData.units} onChange={handleChange} min="0" required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Updating...' : 'Update Stock'}
              </button>
            </form>
          </div>
        )}

        {/* Global Inventory Search */}
        <div className="glass-panel" style={{ flex: 2, minWidth: '320px' }}>
          <h2>Hospital Blood Availability</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Search available stock levels at approved hospitals.
          </p>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <input 
              type="text" 
              placeholder="Search by city, hospital name, or blood group..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>

          <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
                  <th style={{ padding: '0.75rem' }}>Hospital</th>
                  <th style={{ padding: '0.75rem' }}>City</th>
                  <th style={{ padding: '0.75rem' }}>Blood Group</th>
                  <th style={{ padding: '0.75rem' }}>Units</th>
                  <th style={{ padding: '0.75rem' }}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No matching blood inventory entries found.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{item.hospital?.name}</td>
                      <td style={{ padding: '0.75rem' }}>{item.hospital?.city}{item.hospital?.state ? `, ${item.hospital.state}` : ''}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>{item.bloodGroup}</td>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>{item.units} units</td>
                      <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>
                        <div>{item.hospital?.contactNumber}</div>
                        <div>{item.hospital?.email}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
