import { Link, useLocation } from 'react-router-dom';
import { Shield, Store, LayoutDashboard, KeyRound, LogOut, User } from 'lucide-react';

export default function Navigation({ user, onLogout }) {
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>Store Rating Kendra</span>
      </Link>
      <div className="nav-links">
        {user.role === 'ADMIN' && (
          <Link 
            to="/admin" 
            className="link-text"
            style={{ 
              fontWeight: location.pathname === '/admin' ? '700' : '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Shield size={16} />
            Admin Dashboard
          </Link>
        )}
        {user.role === 'USER' && (
          <Link 
            to="/dashboard" 
            className="link-text"
            style={{ 
              fontWeight: location.pathname === '/dashboard' ? '700' : '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Store size={16} />
            Stores List
          </Link>
        )}
        {user.role === 'STORE_OWNER' && (
          <Link 
            to="/store-owner" 
            className="link-text"
            style={{ 
              fontWeight: location.pathname === '/store-owner' ? '700' : '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <LayoutDashboard size={16} />
            Store Owner Dashboard
          </Link>
        )}
        <Link 
          to="/profile" 
          className="link-text"
          style={{ 
            fontWeight: location.pathname === '/profile' ? '700' : '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <KeyRound size={16} />
          Change Password
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
          <span className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} style={{ color: 'var(--text-muted)' }} />
            {user.name}
            <span className="nav-role">{user.role}</span>
          </span>
          <button 
            className="btn btn-secondary btn-logout btn-sm" 
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
