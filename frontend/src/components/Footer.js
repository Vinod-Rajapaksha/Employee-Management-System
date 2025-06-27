import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-2 mt-5">
      <div className="text-center mt-3">
        <p>© {currentYear} Employee Management System - All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;