import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {getInitials(user?.username)}
          </div>
          <h1 className="auth-title">Profile</h1>
        </div>
        
        <div className="profile-info">
          <div className="form-group">
            <label>Username</label>
            <div className="profile-value">{user?.username || 'N/A'}</div>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <div className="profile-value">{user?.email || 'N/A'}</div>
          </div>
          
          <div className="form-group">
            <label>Member Since</label>
            <div className="profile-value">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <Link to="/" className="auth-button">
            Back to Todos
          </Link>
          <button 
            onClick={handleLogout}
            className="auth-button logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;