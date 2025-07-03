import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiArrowUp,
  FiBriefcase,
  FiHome,
  FiCalendar,
  FiSave,
  FiArrowLeft,
} from "react-icons/fi";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    department: "Engineering",
    hireDate: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    "Engineering",
    "Marketing",
    "IT",
    "Sales",
    "HR",
    "Finance",
    "Operations",
    "Product",
    "Design",
    "Support",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
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
      toast.error("Please fix the errors in the form", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:5000/employees", formData);
      toast.success("Employee added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/");
    } catch (err) {
      console.error("Error adding employee:", err);
      toast.error("Failed to add employee. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="d-flex align-items-center mb-4"
      >
        <motion.button
          onClick={() => navigate("/")}
          className="btn-modern btn-secondary me-3"
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
        >
          <FiArrowLeft size={18} />
        </motion.button>
        <div>
          <h2 className="gradient-text mb-1">Add New Employee</h2>
          <p className="text-muted mb-0">
            Fill in the details to add a new team member
          </p>
        </div>
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
                <FiUser size={24} />
              </motion.div>
              <h4 className="fw-bold text-dark">Employee Information</h4>
              <p className="text-muted small">
                Please provide accurate information for the new employee
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
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
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
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
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
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
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
                    value={formData.jobTitle}
                    onChange={handleChange}
                    error={errors.jobTitle}
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
                    value={formData.department}
                    onChange={handleChange}
                    error={errors.department}
                  />
                </div>
                <div className="col-md-6">
                  <FormField
                    icon={<FiCalendar size={18} />}
                    label="Hire Date"
                    name="hireDate"
                    type="date"
                    aria-label="Hire date"
                    value={formData.hireDate}
                    onChange={handleChange}
                    error={errors.hireDate}
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
                  onClick={() => navigate("/")}
                  className="btn-modern btn-secondary px-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  <FiArrowLeft size={16} className="me-2" />
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  className="btn-modern btn-primary px-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={16} className="me-2" />
                      Save Employee
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Additional Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="row justify-content-center mt-4"
      >
        <div className="col-lg-8 col-xl-7">
          <div className="glass-card p-3">
            <div className="d-flex align-items-center text-muted">
              <FiUser size={16} className="me-2" />
              <small>
                <strong>Note:</strong> All fields marked with * are required.
                The employee will receive a welcome email after successful
                registration.
              </small>
            </div>
          </div>
        </div>
      </motion.div>

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

const FormField = ({
  icon,
  label,
  name,
  type = "text",
  options = null,
  value,
  onChange,
  error,
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="mb-4"
  >
    <label className="form-label d-flex align-items-center gap-2">
      <span style={{ color: "var(--primary)" }}>{icon}</span>
      <span className="fw-medium">{label}</span>
    </label>

    {options ? (
      <select
        className={`modern-form-control ${error ? "is-invalid" : ""}`}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        className={`modern-form-control ${error ? "is-invalid" : ""}`}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      />
    )}

    {error && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="invalid-feedback d-block"
        style={{ marginTop: "0.5rem" }}
      >
        <small>{error}</small>
      </motion.div>
    )}
  </motion.div>
);

export default AddEmployee;
