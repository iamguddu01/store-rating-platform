export default function StoresTable({
  stores,
  loading,
  filters,
  setFilters,
  sort,
  handleSort,
  onViewOwnerDetails,
  onApplyFilters
}) {
  return (
    <div className="card">
      <h3 className="card-title">Registered Stores</h3>

      <div className="filters-row">
        <div className="form-group">
          <label>Store Name</label>
          <input
            type="text"
            className="form-input"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            placeholder="Search by store name..."
          />
        </div>
        <div className="form-group">
          <label>Store Email</label>
          <input
            type="text"
            className="form-input"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            placeholder="Search by store email..."
          />
        </div>
        <div className="form-group">
          <label>Store Address</label>
          <input
            type="text"
            className="form-input"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            placeholder="Search by address..."
          />
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
                Store Name {sort.field === 'name' && (sort.order === 'ASC' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('email')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Email {sort.field === 'email' && (sort.order === 'ASC' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('address')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Address {sort.field === 'address' && (sort.order === 'ASC' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('rating')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                Overall Rating {sort.field === 'rating' && (sort.order === 'ASC' ? '▲' : '▼')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading stores...</td></tr>
            ) : stores.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No stores registered.</td></tr>
            ) : (
              stores.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>
                    <span style={{ fontWeight: 'bold' }}>
                      {s.averageRating ? parseFloat(s.averageRating).toFixed(1) : '0.0'}
                    </span> / 5.0
                  </td>
                  <td>
                    {s.owner ? (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onViewOwnerDetails(s.owner.id)}
                      >
                        View Owner Details
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No Owner</span>
                    )}
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
