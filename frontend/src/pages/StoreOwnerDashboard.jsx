/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function StoreOwnerDashboard({ user }) {
  const storesList = user?.stores || [];
  const [selectedStoreId, setSelectedStoreId] = useState(storesList[0]?.id || null);
  const [averageRating, setAverageRating] = useState('0.0');
  const [ratings, setRatings] = useState([]);
  const [sort, setSort] = useState({ field: 'createdAt', order: 'DESC' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (storesList.length > 0 && !selectedStoreId) {
      setSelectedStoreId(storesList[0].id);
    }
  }, [storesList]);

  useEffect(() => {
    if (selectedStoreId) {
      fetchDashboardData();
    }
  }, [sort, selectedStoreId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const query = `storeId=${selectedStoreId}&sortBy=${sort.field}&sortOrder=${sort.order}`;
      const data = await api.get(`/store-owner/dashboard?${query}`);
      setAverageRating(data.averageRating);
      setRatings(data.ratings);
    } catch (err) {
      setError(err.message || 'Failed to fetch store dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '28px', margin: 0 }}>Store Owner Dashboard</h1>
          {storesList.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Select Store:</span>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="form-input"
                style={{ width: '260px', padding: '8px' }}
              >
                {storesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {storesList.length === 1 && (
            <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--primary)' }}>
              ({storesList[0].name})
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {selectedStoreId && (
            <Link 
              to={`/stores/${selectedStoreId}`} 
              className="btn btn-primary" 
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              View Public Page
            </Link>
          )}
          <button 
            className="btn btn-secondary" 
            onClick={() => { if (selectedStoreId) fetchDashboardData(); }}
            disabled={loading}
            style={{ padding: '8px 16px' }}
          >
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!selectedStoreId ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          <h3>No stores associated with this owner account.</h3>
        </div>
      ) : (
        <>
          <div className="stats-card" style={{ marginBottom: '40px', alignItems: 'center', padding: '40px' }}>
            <span className="stats-label" style={{ fontSize: '16px', letterSpacing: '0.05em' }}>
              Overall Rating
            </span>
            <span className="stats-value" style={{ fontSize: '72px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--star-gold)' }}>
              ★ {averageRating ? parseFloat(averageRating).toFixed(1) : '0.0'}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
              Based on {ratings.length} total rating submissions
            </span>
          </div>

          <div className="card">
            <h3 className="card-title">User Feedback & Ratings</h3>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                      User Name {sort.field === 'name' && (sort.order === 'ASC' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('email')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                      User Email {sort.field === 'email' && (sort.order === 'ASC' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('address')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                      User Address {sort.field === 'address' && (sort.order === 'ASC' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('rating')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                      Rating Submitted {sort.field === 'rating' && (sort.order === 'ASC' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                      Date Submitted {sort.field === 'createdAt' && (sort.order === 'ASC' ? '▲' : '▼')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading ratings...</td></tr>
                  ) : ratings.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>No users have submitted ratings for this store yet.</td></tr>
                  ) : (
                    ratings.map((r) => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: '600' }}>{r.user?.name || 'Unknown User'}</td>
                        <td>{r.user?.email || 'N/A'}</td>
                        <td>{r.user?.address || 'N/A'}</td>
                        <td>
                          <span style={{ color: 'var(--star-gold)', fontWeight: 'bold' }}>
                            {'★'.repeat(r.rating)}
                          </span>
                          <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>
                            {'☆'.repeat(5 - r.rating)}
                          </span>
                        </td>
                        <td>{new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
