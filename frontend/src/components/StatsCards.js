import React from 'react';
import { motion } from 'framer-motion';

const StatsCards = ({ employees }) => {
  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: "👥",
      color: "var(--primary)"
    },
    {
      title: "New Hires",
      value: employees.filter(e => new Date(e.hireDate) > new Date(Date.now() - 30*24*60*60*1000)).length,
      icon: "🆕",
      color: "var(--accent)"
    },
    {
      title: "Departments",
      value: new Set(employees.map(e => e.department)).size,
      icon: "🏢",
      color: "var(--secondary)"
    },
    {
      title: "Avg. Tenure",
      value: "2.5 yrs",
      icon: "⏳",
      color: "var(--warning)"
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.title}
          className="stat-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="stat-icon" style={{ backgroundColor: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-content">
            <h3>{stat.value}</h3>
            <p>{stat.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;