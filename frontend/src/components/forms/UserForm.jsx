import { useState } from 'react';

export default function UserForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (name.trim().length < 20 || name.trim().length > 60) {
      setError('Name must be 20-60 characters.');
      return;
    }
    if (address.trim().length > 400) {
      setError('Address must not exceed 400 characters.');
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError('Password must be between 8 and 16 characters.');
      return;
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (!hasUppercase) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!hasSpecial) {
      setError('Password must contain at least one special character.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ name, email, password, address, role });
      setSuccess('User created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setAddress('');
      setRole('USER');
    } catch (err) {
      setError(err.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">Add New User</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Johnathan Smith - Test User"
            required
            disabled={loading}
          />
          <div className="form-helper">20 to 60 characters.</div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. johnsmith@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            className="form-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 456 Elm St, San Francisco, CA"
            required
            disabled={loading}
          />
          <div className="form-helper">Max 400 characters.</div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="e.g. Password123!"
            required
            disabled={loading}
          />
          <div className="form-helper">8-16 chars, 1 uppercase, 1 special character.</div>
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            className="form-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
            <option value="USER">Normal User</option>
            <option value="ADMIN">System Administrator</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}
