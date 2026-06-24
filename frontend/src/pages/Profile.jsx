import { useState } from 'react';
import { api } from '../utils/api';

export default function Profile() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = [];

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

    if (password !== confirmPassword) {
      errors.push('Passwords do not match.');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const errors = validate();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setLoading(true);

    try {
      const data = await api.put('/auth/password', { password });
      setSuccess(data.message || 'Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ maxWidth: '600px' }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Account Settings</h1>
      
      <div className="card">
        <h3 className="card-title">Update Your Password</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
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
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={loading}
            />
            <div className="form-helper">8-16 characters, must include 1 uppercase and 1 special character.</div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
