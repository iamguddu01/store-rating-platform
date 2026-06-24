export default function UsersTable({ 
  users, 
  loading, 
  filters, 
  setFilters, 
  sort, 
  handleSort, 
  onViewDetails, 
  onApplyFilters 
}) {
  return (
    <div className="card" style={{ marginBottom: '3rem' }}>
      <h3 className="card-title">Registered Users</h3>
      
      <div className="filters-row">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-input"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            placeholder="Search by name..."
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            className="form-input"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            placeholder="Search by email..."
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            className="form-input"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            placeholder="Search by address..."
          />
        </div>
        <div className="form-group" style={{ minWidth: '150px' }}>
          <label>Role</label>
          <select
            className="form-input"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>
        <button className="btn btn-secondary" onClick={onApplyFilters} style={{ height: '42px' }}>
          Apply Filters
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Name {sort.field === 'name' && (sort.order === 'ASC' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('email')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Email {sort.field === 'email' && (sort.order === 'ASC' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('address')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Address {sort.field === 'address' && (sort.order === 'ASC' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('role')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Role {sort.field === 'role' && (sort.order === 'ASC' ? '▲' : '▼')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td><span className="nav-role">{u.role}</span></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => onViewDetails(u.id)}>
                      View Details
                    </button>
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
