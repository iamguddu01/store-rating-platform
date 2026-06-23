import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import Profile from './pages/Profile';
import StoreDetails from './pages/StoreDetails';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <h3>Loading app...</h3>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Navigation user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? (
                user.role === 'ADMIN' ? <Navigate to="/admin" replace /> :
                user.role === 'STORE_OWNER' ? <Navigate to="/store-owner" replace /> :
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register onLogin={handleLogin} />
              )
            } 
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={user} allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={user} allowedRoles={['USER']}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/store-owner" 
            element={
              <ProtectedRoute user={user} allowedRoles={['STORE_OWNER']}>
                <StoreOwnerDashboard user={user} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stores/:storeId" 
            element={
              <ProtectedRoute user={user}>
                <StoreDetails user={user} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/" 
            element={
              user ? (
                user.role === 'ADMIN' ? <Navigate to="/admin" replace /> :
                user.role === 'STORE_OWNER' ? <Navigate to="/store-owner" replace /> :
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
