import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = ({ darkMode, toggleDark }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2>📝 Smart Task Manager</h2>
      <div className="navbar-right">
        {user && <span>👋 {user.name}</span>}
        <button onClick={toggleDark}>{darkMode ? '☀️ Light' : '🌙 Dark'}</button>
        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;
