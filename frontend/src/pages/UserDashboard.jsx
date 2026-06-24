/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../utils/api';
import StarRating from '../components/StarRating';

export default function UserDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [filters, setFilters] = useState({
    name: searchParams.get('name') || '',
    address: searchParams.get('address') || ''
  });

  const sortField = searchParams.get('sortBy') || 'name';
  const sortOrder = searchParams.get('sortOrder') || 'ASC';

  useEffect(() => {
    fetchStores();
  }, [searchParams]);

  const fetchStores = async () => {
    setLoading(true);
    setError('');
    try {
      const name = searchParams.get('name') || '';
      const address = searchParams.get('address') || '';
      const sortBy = searchParams.get('sortBy') || 'name';
      const order = searchParams.get('sortOrder') || 'ASC';
      
      const query = `name=${name}&address=${address}&sortBy=${sortBy}&sortOrder=${order}`;
      const data = await api.get(`/stores?${query}`);
      setStores(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch stores.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchParams({
      name: filters.name,
      address: filters.address,
      sortBy: sortField,
      sortOrder: sortOrder
    });
  };

  const handleClear = () => {
    setFilters({ name: '', address: '' });
    setSearchParams({
      name: '',
      address: '',
      sortBy: 'name',
      sortOrder: 'ASC'
    });
  };

  const handleSort = (field) => {
    const nextOrder = sortField === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSearchParams({
      name: filters.name,
      address: filters.address,
      sortBy: field,
      sortOrder: nextOrder
    });
  };

  const handleRate = async (storeId, ratingValue) => {
    setError('');
    setSuccessMsg('');
    try {
      const data = await api.post(`/stores/${storeId}/rate`, { 
        rating: ratingValue,
      });
      setSuccessMsg(data.message);
      
      setStores((prevStores) =>
        prevStores.map((s) => {
          if (s.id === storeId) {
            return {
              ...s,
              userRating: ratingValue,
              averageRating: data.averageRating,
            };
          }
          return s;
        })
      );

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit rating.');
    }
  };

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: '24px', fontSize: '28px' }}>Registered Stores</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div className="filters-row">
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              className="form-input"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              placeholder="Filter by name..."
            />
          </div>
          <div className="form-group">
            <label>Store Address</label>
            <input
              type="text"
              className="form-input"
              value={filters.address}
              onChange={(e) => setFilters({ ...filters, address: e.target.value })}
              placeholder="Filter by address..."
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={handleSearch} style={{ height: '42px', width: 'auto' }}>
              Search Stores
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleClear}
              style={{ height: '42px' }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Store Name {sortField === 'name' && (sortOrder === 'ASC' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('address')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Address {sortField === 'address' && (sortOrder === 'ASC' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('rating')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Overall Rating {sortField === 'rating' && (sortOrder === 'ASC' ? '▲' : '▼')}
              </th>
              <th>Your Rating</th>
              <th>Submit / Modify Rating</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading stores...</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No stores found.</td></tr>
            ) : (
              stores.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: '600' }}>
                    <Link to={`/stores/${s.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                      {s.name}
                    </Link>
                  </td>
                  <td>{s.address}</td>
                  <td>
                    <span style={{ color: 'var(--star-gold)', marginRight: '4px' }}>★</span>
                    <span style={{ fontWeight: 'bold' }}>
                      {s.averageRating ? parseFloat(s.averageRating).toFixed(1) : '0.0'}
                    </span> / 5.0
                  </td>
                  <td>
                    {s.userRating ? (
                      <span style={{ padding: '3px 8px', background: '#fef3c7', color: '#d97706', borderRadius: '4px', fontSize: '14px', fontWeight: '600' }}>
                        ★ {s.userRating} Stars
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic' }}>
                        Not rated yet
                      </span>
                    )}
                  </td>
                  <td>
                    <StarRating
                      currentRating={s.userRating || 0}
                      onRate={(value) => handleRate(s.id, value)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
