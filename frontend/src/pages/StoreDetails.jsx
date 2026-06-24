/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import StarRating from '../components/StarRating';

export default function StoreDetails({ user }) {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchStoreDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get(`/stores/${storeId}`);
      setStore(data.store);
      setRatings(data.ratings);
    } catch (err) {
      setError(err.message || 'Failed to fetch store details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchStoreDetails();
    }
  }, [storeId]);

  const handleRate = async (ratingValue) => {
    setError('');
    setSuccessMsg('');
    try {
      const data = await api.post(`/stores/${storeId}/rate`, { 
        rating: ratingValue,
      });
      setSuccessMsg(data.message);
      
      setStore((prev) => ({
        ...prev,
        userRating: ratingValue,
        averageRating: data.averageRating,
      }));
      
      fetchStoreDetails();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit rating.');
    }
  };

  const handleBack = () => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    } else if (user?.role === 'STORE_OWNER') {
      navigate('/store-owner');
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="main-content" style={{ textAlign: 'center', paddingTop: '64px' }}>
        <h3>Loading store details...</h3>
      </div>
    );
  }

  if (error && !store) {
    return (
      <div className="main-content">
        <button className="btn btn-secondary" onClick={handleBack} style={{ marginBottom: '16px' }}>
          ← Back
        </button>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <button className="btn btn-secondary" onClick={handleBack} style={{ marginBottom: '24px' }}>
        ← Back to Dashboard
      </button>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {store && (
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
          
          <div className="card" style={{ padding: '32px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--primary)' }}>{store.name}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '18px' }}>{store.address}</p>
            
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Store Email:</span>
                <span>{store.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Overall Rating:</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  <span style={{ color: 'var(--star-gold)', marginRight: '4px' }}>★</span>
                  {store.averageRating ? parseFloat(store.averageRating).toFixed(1) : '0.0'} <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--text-muted)' }}>/ 5.0</span>
                </span>
              </div>
            </div>

            {user?.role === 'USER' && (
              <div style={{ borderTop: '1px solid var(--border)', marginTop: '24px', paddingTop: '24px', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>
                  {store.userRating ? 'Update Your Rating' : 'Rate This Store'}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <StarRating 
                    currentRating={store.userRating || 0} 
                    onRate={handleRate} 
                  />
                </div>
                {store.userRating && (
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    You rated this store <strong>{store.userRating}</strong> stars
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '24px', borderBottom: '2px solid var(--border)', paddingBottom: '8px' }}>
              User Reviews ({ratings.length})
            </h2>

            {ratings.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '32px 0px' }}>
                No ratings submitted yet for this store.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {ratings.map((r) => (
                  <div key={r.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '16px' }}>{r.user?.name || 'Anonymous'}</strong>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          style={{ 
                            color: star <= r.rating ? 'var(--star-gold)' : 'var(--border)',
                            fontSize: '18px' 
                          }}
                        >
                          ★
                        </span>
                      ))}
                      <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: 600 }}>
                        {r.rating} / 5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
