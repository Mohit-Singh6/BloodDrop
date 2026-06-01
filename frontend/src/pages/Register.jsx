import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { INDIA_STATES_CITIES, STATE_LIST } from '../data/indiaCities';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
    contactNumber: '',
    state: '',
    city: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // When state changes, reset city
    if (name === 'state') {
      setFormData({ ...formData, state: value, city: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        contactNumber: formData.contactNumber,
        state: formData.state,
        city: formData.city
      };

      const res = await api.post('/auth/register', payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('isHospital', res.data.isHospital);

      if (res.data.role === 'donor') navigate('/profile');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const availableCities = formData.state ? INDIA_STATES_CITIES[formData.state] || [] : [];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0 3rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center mb-2">Create an Account</h2>
        {error && <p className="text-danger text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat your password" required />
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label>I am registering as</label>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { value: 'donor', label: 'Donor', desc: 'I want to donate blood' },
                { value: 'requester', label: 'Patient', desc: 'I need blood for myself or family' },
                { value: 'hospital', label: 'Hospital', desc: 'We manage blood for patients' }
              ].map(opt => (
                <label key={opt.value} style={{
                  flex: 1,
                  minWidth: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.85rem 0.5rem',
                  borderRadius: '10px',
                  border: `2px solid ${formData.role === opt.value ? 'var(--primary-color)' : 'rgba(0,0,0,0.1)'}`,
                  background: formData.role === opt.value ? 'rgba(220, 38, 38, 0.06)' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}>
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={formData.role === opt.value}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>{opt.label.split(' ')[0]}</span>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: formData.role === opt.value ? 'var(--primary-color)' : 'var(--text-main)' }}>
                    {opt.label.split(' ')[1]}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.3 }}>{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hospital Warning */}
          {formData.role === 'hospital' && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              background: 'rgba(255, 165, 0, 0.08)',
              border: '1.5px solid rgba(255, 165, 0, 0.5)',
              marginBottom: '1.25rem'
            }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>⚠️</span>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#b85c00', lineHeight: 1.5, fontWeight: '500' }}>
                Hospital accounts require <strong>Admin approval</strong> before they can manage inventory or submit blood requests. You will not be able to use certain features until your account is verified.
              </p>
            </div>
          )}

          {/* Contact Number */}
          <div className="form-group">
            <label>Contact Number</label>
            <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="10-digit mobile number" required />
          </div>

          {/* State Dropdown */}
          <div className="form-group">
            <label>State</label>
            <select name="state" value={formData.state} onChange={handleChange} required>
              <option value="">— Select your state —</option>
              {STATE_LIST.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* City Dropdown — only shown when state is chosen */}
          {formData.state && (
            <div className="form-group">
              <label>City</label>
              <select name="city" value={formData.city} onChange={handleChange} required>
                <option value="">— Select your city —</option>
                {availableCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-2" style={{ fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
