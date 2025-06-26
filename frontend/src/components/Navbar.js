import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiSun, FiMoon, FiBell, FiSettings } from 'react-icons/fi';

const Navbar = ({ toggleSidebar }) => {
  const [theme, setTheme] = useState('light');
  const [notifications] = useState(3); // Mock notification count

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="navbar-left">
        <motion.button
          onClick={toggleSidebar}
          className="menu-toggle-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiMenu size={20} />
        </motion.button>
          
        <Link to="/" className="logo">
            🏢
          <span>Employee Management System</span>
        </Link>
      </div>
      
      <div className="navbar-right">
        <motion.button
          className="menu-toggle-btn position-relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiBell size={20} />
          {notifications > 0 && (
            <span 
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: '10px' }}
            >
              {notifications}
            </span>
          )}
        </motion.button>

        <motion.button
          className="menu-toggle-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiSettings size={20} />
        </motion.button>

        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <UserProfile />
      </div>
    </motion.nav>
  );
};

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <motion.div 
      className="theme-toggle"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div 
        className="theme-toggle-handle"
        animate={{ x: theme === 'dark' ? 30 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <span className="sun"><FiSun size={14} /></span>
      <span className="moon"><FiMoon size={14} /></span>
    </motion.div>
  );
};

const UserProfile = () => {
  return (
    <motion.div 
      className="user-profile status-online"
      whileHover={{ scale: 1.05 }}
    >
      <div className="avatar-gradient">
        JD
      </div>
      <span className="fw-medium">John Doe</span>
    </motion.div>
  );
};

export default Navbar;
