/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Modal from '../components/Modal';
import UserForm from '../components/forms/UserForm';
import StoreForm from '../components/forms/StoreForm';
import UsersTable from '../components/tables/UsersTable';
import StoresTable from '../components/tables/StoresTable';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0, 
    totalRatings: 0 
  });

  const [users, setUsers] = useState([]);
  const [userFilters, setUserFilters] = useState({ 
    name: '', 
    email: '', 
    address: '', 
    role: '' 
  });
  const [userSort, setUserSort] = useState({ field: 'name', order: 'ASC' });

  const [stores, setStores] = useState([]);
  const [storeFilters, setStoreFilters] = useState({ 
    name: '', 
    email: '', 
    address: '' 
  });
  const [storeSort, setStoreSort] = useState({ field: 'name', order: 'ASC' });

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [userSort, userFilters.role]);

  useEffect(() => {
    fetchStores();
  }, [storeSort]);

  const fetchStats = async () => {
    try {
      const data = await api.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { name, email, address, role } = userFilters;
      const { field, order } = userSort;
      const query = `name=${name}&email=${email}&address=${address}&role=${role}&sortBy=${field}&sortOrder=${order}`;
      const data = await api.get(`/admin/users?${query}`);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStores = async () => {
    setLoadingStores(true);
    try {
      const { name, email, address } = storeFilters;
      const { field, order } = storeSort;
      const query = `name=${name}&email=${email}&address=${address}&sortBy=${field}&sortOrder=${order}`;
      const data = await api.get(`/admin/stores?${query}`);
      setStores(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStores(false);
    }
  };

  const handleUserSort = (field) => {
    setUserSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleStoreSort = (field) => {
    setStoreSort((prev) => ({
      field,
      order: prev.field === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handleAddUser = async (userForm) => {
    await api.post('/admin/users', userForm);
    fetchStats();
    fetchUsers();
  };

  const handleAddStore = async (storeForm) => {
    await api.post('/admin/stores', storeForm);
    fetchStats();
    fetchStores();
  };

  const handleViewUser = async (userId) => {
    setModalLoading(true);
    setModalError('');
    setSelectedUser(null);
    try {
      const data = await api.get(`/admin/users/${userId}`);
      setSelectedUser(data);
    } catch (err) {
      setModalError(err.message || 'Could not fetch user details.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="main-content">
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>System Administrator Dashboard</h1>

      <div className="dashboard-grid">
        <div className="stats-card">
          <span className="stats-label">Total Users</span>
          <span className="stats-value">{stats.totalUsers}</span>
        </div>
        <div className="stats-card">
          <span className="stats-label">Total Registered Stores</span>
          <span className="stats-value">{stats.totalStores}</span>
        </div>
        <div className="stats-card">
          <span className="stats-label">Total Ratings Submitted</span>
          <span className="stats-value">{stats.totalRatings}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <UserForm onSubmit={handleAddUser} />
        <StoreForm onSubmit={handleAddStore} />
      </div>

      <UsersTable 
        users={users}
        loading={loadingUsers}
        filters={userFilters}
        setFilters={setUserFilters}
        sort={userSort}
        handleSort={handleUserSort}
        onViewDetails={handleViewUser}
        onApplyFilters={fetchUsers}
      />

      <StoresTable 
        stores={stores}
        loading={loadingStores}
        filters={storeFilters}
        setFilters={setStoreFilters}
        sort={storeSort}
        handleSort={handleStoreSort}
        onViewOwnerDetails={handleViewUser}
        onApplyFilters={fetchStores}
      />

      {selectedUser && (
        <Modal 
          title="User Details" 
          onClose={() => setSelectedUser(null)}
        >
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{selectedUser.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Email</div>
            <div className="detail-value">{selectedUser.email}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Address</div>
            <div className="detail-value">{selectedUser.address}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Role</div>
            <div className="detail-value">
              <span className="nav-role">{selectedUser.role}</span>
            </div>
          </div>
          
          {selectedUser.role === 'STORE_OWNER' && selectedUser.stores && selectedUser.stores.length > 0 && (
            <>
              <div style={{ margin: '1.5rem 0 0.5rem 0', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '0.25rem' }}>
                Associated Stores Details ({selectedUser.stores.length})
              </div>
              {selectedUser.stores.map((store) => (
                <div key={store.id} style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed #eee' }}>
                  <div className="detail-row" style={{ borderBottom: 'none', paddingBottom: '0.25rem' }}>
                    <div className="detail-label">Store Name</div>
                    <div className="detail-value" style={{ fontWeight: '600' }}>{store.name}</div>
                  </div>
                  <div className="detail-row" style={{ borderBottom: 'none', paddingBottom: '0.25rem' }}>
                    <div className="detail-label">Store Email</div>
                    <div className="detail-value">{store.email}</div>
                  </div>
                  <div className="detail-row" style={{ borderBottom: 'none', paddingBottom: '0.25rem' }}>
                    <div className="detail-label">Store Address</div>
                    <div className="detail-value">{store.address}</div>
                  </div>
                  <div className="detail-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <div className="detail-label">Overall Rating</div>
                    <div className="detail-value" style={{ fontWeight: 'bold', color: 'var(--star-gold)' }}>
                      ★ {store.averageRating} / 5.0
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {selectedUser.role === 'STORE_OWNER' && (!selectedUser.stores || selectedUser.stores.length === 0) && (
            <div style={{ margin: '1.5rem 0 0 0', fontStyle: 'italic', color: 'var(--text-muted)' }}>
              No stores associated with this owner account.
            </div>
          )}
        </Modal>
      )}

      {modalLoading && (
        <div className="overlay">
          <div className="modal" style={{ maxWidth: '300px', textAlign: 'center' }}>
            <p>Loading details...</p>
          </div>
        </div>
      )}

      {modalError && (
        <div className="overlay">
          <div className="modal" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="alert alert-danger">{modalError}</div>
            <button className="btn btn-secondary" onClick={() => setModalError('')}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
