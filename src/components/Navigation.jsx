import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation = ({ 
  filter, 
  setFilter, 
  clearCompleted, 
  completedCount, 
  totalCount 
}) => {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleClearCompleted = () => {
    if (completedCount > 0) {
      clearCompleted();
    }
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-left">
          <Link to="/" className="nav-title-link">
            <h1 className="nav-title">My Tasks</h1>
          </Link>
        </div>
        
        <div className="nav-center">
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => handleFilterChange('all')}
              aria-label={`Show all todos (${totalCount || 0})`}
            >
              All ({totalCount || 0})
            </button>
            <button
              className={filter === 'active' ? 'active' : ''}
              onClick={() => handleFilterChange('active')}
              aria-label={`Show active todos (${(totalCount || 0) - (completedCount || 0)})`}
            >
              Active ({(totalCount || 0) - (completedCount || 0)})
            </button>
            <button
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => handleFilterChange('completed')}
              aria-label={`Show completed todos (${completedCount || 0})`}
            >
              Completed ({completedCount || 0})
            </button>
          </div>
        </div>

        <div className="nav-right">
          {(completedCount || 0) > 0 && (
            <button 
              className="clear-completed-btn"
              onClick={handleClearCompleted}
              aria-label={`Clear ${completedCount} completed todos`}
            >
              Clear Completed
            </button>
          )}
          
          <div className="profile-section" ref={dropdownRef}>
            <button 
              className="profile-button"
              onClick={toggleProfileDropdown}
              aria-label="User menu"
              aria-expanded={showProfileDropdown}
              aria-haspopup="true"
            >
              <div className="profile-avatar">
                {getInitials(user?.username)}
              </div>
              <span className="profile-username">{user?.username || 'User'}</span>
              <svg 
                className={`dropdown-arrow ${showProfileDropdown ? 'open' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12"
                aria-hidden="true"
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </button>
            
            {showProfileDropdown && (
              <div className="profile-dropdown" role="menu" aria-label="User menu">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {getInitials(user?.username)}
                  </div>
                  <div className="dropdown-user-info">
                    <div className="dropdown-username">{user?.username || 'User'}</div>
                    <div className="dropdown-email">{user?.email || 'user@example.com'}</div>
                  </div>
                </div>
                <Link 
                  to="/profile" 
                  className="dropdown-link"
                  onClick={() => setShowProfileDropdown(false)}
                  role="menuitem"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                  View Profile
                </Link>
                <div className="dropdown-divider"></div>
                <button 
                  className="logout-button"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M6 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6zM5 3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V3z"/>
                    <path d="M11.5 8a.5.5 0 0 1-.5.5H8a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5z"/>
                    <path d="M10.146 7.146a.5.5 0 0 1 .708.708L9.707 8.5l1.147 1.146a.5.5 0 0 1-.708.708L8.793 8.5l1.353-1.354z"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;