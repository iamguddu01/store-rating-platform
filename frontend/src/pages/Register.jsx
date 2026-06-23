import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = [];
    
    if (formData.name.trim().length < 20 || formData.name.trim().length > 60) {
      errors.push('Name must be between 20 and 60 characters in length.');
    }

    if (formData.address.trim().length === 0) {
      errors.push('Address is required.');
    } else if (formData.address.length > 400) {
      errors.push('Address must not exceed 400 characters.');
    }

    const password = formData.password;
    if (password.length < 8 || password.length > 16) {
      errors.push('Password must be between 8 and 16 characters in length.');
    } else {
      const hasUppercase = /[A-Z]/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      if (!hasUppercase) {
        errors.push('Password must contain at least one uppercase letter.');
      }
      if (!hasSpecial) {
        errors.push('Password must contain at least one special character.');
      }
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address.');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const errors = validate();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors([]);
    setLoading(true);

    try {
      const data = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        password: formData.password,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onLogin(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '540px' }}>
        <div className="auth-header">
          <h2>Create User Account</h2>
          <p>Join the Store Rating Platform</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {validationErrors.length > 0 && (
          <div className="alert alert-danger">
            <ul style={{ paddingLeft: '1rem', margin: 0 }}>
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Johnathan Doe - Account Tester"
              required
              disabled={loading}
            />
            <div className="form-helper">Requires between 20 and 60 characters.</div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. johndoe@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, New York, NY 10001"
              required
              disabled={loading}
            />
            <div className="form-helper">Maximum 400 characters.</div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <div className="form-helper">8-16 characters, must include 1 uppercase and 1 special character.</div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" className="link-text">Sign In Here</Link>
        </div>
      </div>
    </div>
  );
}
