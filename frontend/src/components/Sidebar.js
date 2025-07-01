import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiCalendar,
  FiPieChart,
  FiLogOut
} from 'react-icons/fi';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const navItems = [
    { path: "/", icon: <FiHome size={20} />, label: "Dashboard" },
    { path: "/employees", icon: <FiUsers size={20} />, label: "Employees" },
    { path: "/analytics", icon: <FiPieChart size={20} />, label: "Analytics" },
    { path: "/schedule", icon: <FiCalendar size={20} />, label: "Schedule" },
    { path: "/settings", icon: <FiSettings size={20} />, label: "Settings" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="sidebar-overlay"
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="sidebar glass-card"
          >
            <div className="sidebar-header">
              <h3>Employee Management System</h3>
            </div>

            <nav className="sidebar-nav">
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.1,
                    },
                  },
                }}
              >
                {navItems.map((item) => (
                  <motion.li
                    key={item.path}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      className={`nav-link ${
                        location.pathname === item.path ? "active" : ""
                      }`}
                      onClick={closeSidebar}
                    >
                      <span className="nav-icon ms-2">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <div className="sidebar-footer">
              <motion.button whileHover={{ x: 5 }} className="logout-btn">
                <FiLogOut size={18} />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;