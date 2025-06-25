import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container text-center">
        <p>© {currentYear} Employee Management System - All Rights Reserved</p>
        <div className="social-icons mt-3">
          <motion.a 
            href="#" 
            className="text-white mx-2"
            whileHover={{ y: -5 }}
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </motion.a>
          <motion.a 
            href="#" 
            className="text-white mx-2"
            whileHover={{ y: -5 }}
            aria-label="Facebook"
          >
            <i className="fab fa-facebook"></i>
          </motion.a>
          <motion.a 
            href="#" 
            className="text-white mx-2"
            whileHover={{ y: -5 }}
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </motion.a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;