import { useState } from 'react';

export default function StoreForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (name.trim().length < 20 || name.trim().length > 60) {
      setError('Store Name must be 20-60 characters.');
      return;
    }
    if (address.trim().length > 400) {
      setError('Store Address must not exceed 400 characters.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ name, email, address, ownerEmail });
      setSuccess('Store created successfully and linked to owner!');
      setName('');
      setEmail('');
      setAddress('');
      setOwnerEmail('');
    } catch (err) {
      setError(err.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="card-title">Add New Store</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Store Name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Supermarket NYC Outlet"
            required
            disabled={loading}
          />
          <div className="form-helper">20 to 60 characters.</div>
        </div>

        <div className="form-group">
          <label>Store Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. nyc@mystore.com"
            required
            disabled={loading}
          />
          <div className="form-helper">This is the contact email for the store.</div>
        </div>

        <div className="form-group">
          <label>Store Address</label>
          <input
            type="text"
            className="form-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. 789 Broadway Ave, New York, NY"
            required
            disabled={loading}
          />
          <div className="form-helper">Max 400 characters.</div>
        </div>

        <div className="form-group">
          <label>Owner Email Address</label>
          <input
            type="email"
            className="form-input"
            value={ownerEmail}
            onChange={(e) => setOwnerEmail(e.target.value)}
            placeholder="e.g. owner@mystore.com"
            required
            disabled={loading}
          />
          <div className="form-helper">The email of the existing Store Owner user account.</div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
          {loading ? 'Creating...' : 'Create Store'}
        </button>
      </form>
    </div>
  );
}
