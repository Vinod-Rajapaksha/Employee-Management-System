import React from 'react';
import { Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const DepartmentChart = ({ employees }) => {
  const departments = [...new Set(employees.map(e => e.department))];
  
  const data = {
    labels: departments,
    datasets: [{
      data: departments.map(dept => 
        employees.filter(e => e.department === dept).length
      ),
      backgroundColor: [
        '#6c5ce7', '#a29bfe', '#fd79a8', '#00cec9', 
        '#00b894', '#fdcb6e', '#e17055', '#d63031'
      ],
      borderWidth: 0,
      hoverOffset: 20
    }]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
    maintainAspectRatio: false
  };

  return (
    <motion.div 
      className="chart-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <h3>Department Distribution</h3>
      <div className="chart-container">
        <Pie data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default DepartmentChart;