import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiArrowUp, FiPhone, FiBriefcase, FiHome, FiCalendar, FiSave, FiArrowLeft, FiX } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

function EditEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: 'Engineering',
    hireDate: '',
  });

  const [originalData, setOriginalData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [showGoTop, setShowGoTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowGoTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const departments = [
    'Engineering',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'Product',
    'Design',
    'Support'
  ];

  useEffect(() => {
    const fetchEmployee = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/employees/${id}`);
        const employeeData = {
          ...res.data,
          hireDate: res.data.hireDate ? res.data.hireDate.split('T')[0] : '',
        };
        setFormData(employeeData);
        setOriginalData(employeeData);
      } catch (err) {
        console.error('Error loading employee:', err);
        toast.error('Could not load employee data', {
          position: "top-right",
          autoClose: 3000,
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployee();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(`http://localhost:5000/employees/${id}`, formData);
      toast.success('Employee updated successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
      navigate(`/view/${id}`);
    } catch (err) {
      console.error('Error updating employee:', err);
      toast.error('Failed to update employee. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(originalData);
    setErrors({});
    toast.info('Form reset to original values', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-muted">Loading employee data...</h5>
            <p className="text-muted small">Please wait while we fetch the information</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const FormField = ({ icon, label, name, type = "text", options = null, ...props }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <label className="form-label d-flex align-items-center gap-2">
        <span style={{ color: 'var(--primary)' }}>{icon}</span>
        <span className="fw-medium">{label}</span>
        {originalData[name] !== formData[name] && (
          <span className="badge bg-warning text-dark ms-2" style={{ fontSize: '10px' }}>
            Modified
          </span>
        )}
      </label>
      {options ? (
        <select
          className={`modern-form-control ${errors[name] ? 'is-invalid' : ''} ${
            originalData[name] !== formData[name] ? 'border-warning' : ''
          }`}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          {...props}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className={`modern-form-control ${errors[name] ? 'is-invalid' : ''} ${
            originalData[name] !== formData[name] ? 'border-warning' : ''
          }`}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          {...props}
        />
      )}
      {errors[name] && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="invalid-feedback d-block"
          style={{ marginTop: '0.5rem' }}
        >
          <small>{errors[name]}</small>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="d-flex align-items-center justify-content-between mb-4"
      >
        <div className="d-flex align-items-center">
          <motion.button
            onClick={() => navigate(`/view/${id}`)}
            className="btn-modern btn-secondary me-3"
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
          >
            <FiArrowLeft size={18} />
          </motion.button>
          <div>
            <h2 className="gradient-text mb-1">Edit Employee</h2>
            <p className="text-muted mb-0">Update employee information</p>
          </div>
        </div>

        {hasChanges() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="alert alert-warning py-2 px-3 mb-0"
            style={{ fontSize: "14px" }}
          >
            <strong>Unsaved Changes</strong> - Don't forget to save your
            changes!
          </motion.div>
        )}
      </motion.div>

      {/* Form Section */}
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-card p-4 p-md-5"
          >
            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="avatar-gradient mx-auto mb-3"
                style={{ width: "60px", height: "60px", fontSize: "24px" }}
              >
                {formData.name ? (
                  formData.name.charAt(0).toUpperCase()
                ) : (
                  <FiUser size={24} />
                )}
              </motion.div>
              <h4 className="fw-bold text-dark">Update Employee Information</h4>
              <p className="text-muted small">
                Make changes to the employee details below
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <FormField
                    icon={<FiUser size={18} />}
                    label="Full Name"
                    name="name"
                    placeholder="Enter full name"
                    aria-label="Full name"
                    autoComplete="name"
                  />
                </div>
                <div className="col-md-6">
                  <FormField
                    icon={<FiMail size={18} />}
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    aria-label="Email"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <FormField
                    icon={<FiPhone size={18} />}
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    aria-label="Phone number"
                    autoComplete="tel"
                  />
                </div>
                <div className="col-md-6">
                  <FormField
                    icon={<FiBriefcase size={18} />}
                    label="Job Title"
                    name="jobTitle"
                    placeholder="Enter job title"
                    aria-label="Job title"
                    autoComplete="organization-title"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <FormField
                    icon={<FiHome size={18} />}
                    label="Department"
                    name="department"
                    options={departments}
                    aria-label="Department"
                  />
                </div>
                <div className="col-md-6">
                  <FormField
                    icon={<FiCalendar size={18} />}
                    label="Hire Date"
                    name="hireDate"
                    type="date"
                    aria-label="Hire date"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div
                className="d-flex gap-3 justify-content-end mt-5 pt-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  type="button"
                  onClick={() => navigate(`/view/${id}`)}
                  className="btn-modern btn-secondary px-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  <FiX size={16} className="me-2" />
                  Cancel
                </motion.button>

                {hasChanges() && (
                  <motion.button
                    type="button"
                    onClick={handleReset}
                    className="btn-modern btn-secondary px-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <FiArrowLeft size={16} className="me-2" />
                    Reset
                  </motion.button>
                )}

                <motion.button
                  type="submit"
                  className="btn-modern btn-primary px-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting || !hasChanges()}
                >
                  {isSubmitting ? (
                    <>
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        style={{ width: "16px", height: "16px" }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave size={16} className="me-2" />
                      Update Employee
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Changes Summary */}
      {hasChanges() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="row justify-content-center mt-4"
        >
          <div className="col-lg-8 col-xl-7">
            <div className="glass-card p-3">
              <h6 className="fw-bold mb-2 text-warning">
                <FiUser size={16} className="me-2" />
                Pending Changes
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {Object.keys(formData).map((key) => {
                  if (originalData[key] !== formData[key]) {
                    return (
                      <span key={key} className="badge bg-warning text-dark">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <button
        className={`fab ${showGoTop ? "" : "fab-hidden"}`}
        onClick={scrollToTop}
        aria-label="Go to top"
      >
        <FiArrowUp size={24} />
      </button>
    </div>
  );
}

export default EditEmployee;
