import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  FiUser,
  FiMail,
  FiArrowUp,
  FiPhone,
  FiBriefcase,
  FiHome,
  FiCalendar,
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiClock,
  FiAward,
} from "react-icons/fi";
import { useLocation } from "react-router-dom";

function ViewEmployee() {
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    if (
      location.state &&
      location.state.toast &&
      !window.sessionStorage.getItem("toastShown-" + location.key)
    ) {
      const { type, message } = location.state.toast;
      toast[type](message);
      window.sessionStorage.setItem("toastShown-" + location.key, "1");
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [navigate, location.pathname, location.state, location.key]);

  useEffect(() => {
    const fetchEmployee = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/employees/${id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error("Error loading employee:", err);
        toast.error("Could not load employee details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone. Do you really want to delete this employee ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#fff",
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        await axios.delete(`http://localhost:5000/employees/${id}`);
        toast.success("Employee deleted successfully!");

        Swal.fire({
          title: "Deleted!",
          text: "The employee has been removed.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/");
      } catch (err) {
        console.error("Error deleting employee:", err);
        toast.error("Failed to delete employee. Please try again.");
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-muted">Loading employee details...</h5>
            <p className="text-muted small">
              Please wait while we fetch the information
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container-fluid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-5"
        >
          <div className="mb-4" style={{ fontSize: "4rem" }}>
            😕
          </div>
          <h3 className="text-danger mb-3">Employee Not Found</h3>
          <p className="text-muted mb-4">
            The employee you're looking for doesn't exist or may have been
            removed.
          </p>
          <Link to="/" className="btn-modern btn-primary">
            <FiArrowLeft size={16} className="me-2" />
            Back to Employee List
          </Link>
        </motion.div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateEmploymentDuration = (hireDate) => {
    const hire = new Date(hireDate);
    const now = new Date();
    const diffTime = Math.abs(now - hire);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ${
        months > 0 ? `${months} month${months > 1 ? "s" : ""}` : ""
      }`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }
  };

  const InfoCard = ({ icon, label, value, color = "var(--primary)" }) => (
    <motion.div whileHover={{ scale: 1.02 }} className="glass-card p-4 h-100">
      <div className="d-flex align-items-center mb-2">
        <div
          className="p-2 rounded-circle me-3"
          style={{ background: `${color}20`, color }}
        >
          {icon}
        </div>
        <span className="text-muted small fw-medium">{label}</span>
      </div>
      <p className="mb-0 fw-bold text-dark">{value}</p>
    </motion.div>
  );

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="d-flex justify-content-between align-items-center mb-4"
      >
        <div className="d-flex align-items-center">
          <motion.button
            onClick={() => navigate("/")}
            className="btn-modern btn-secondary me-3"
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft size={18} />
          </motion.button>
          <div>
            <h2 className="gradient-text mb-1">Employee Profile</h2>
            <p className="text-muted mb-0">
              View and manage employee information
            </p>
          </div>
        </div>

        <div className="d-flex gap-2">
          <Link to={`/edit/${employee._id}`} className="btn-modern btn-primary">
            <FiEdit size={16} className="me-2" />
            Edit Profile
          </Link>
          <motion.button
            onClick={handleDelete}
            className="btn-modern btn-danger"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 size={16} className="me-2" />
                Delete
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <div className="row">
        {/* Profile Card */}
        <div className="col-lg-4 mb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 text-center h-100"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="avatar-gradient mb-4 mx-auto status-online"
              style={{ width: "120px", height: "120px", fontSize: "48px" }}
            >
              {employee.name.charAt(0).toUpperCase()}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="fw-bold mb-2 text-dark">{employee.name}</h3>
              <h5 className="text-primary mb-3">{employee.jobTitle}</h5>
              <span className="badge bg-primary px-3 py-2 rounded-pill">
                <FiHome size={14} className="me-1" />
                {employee.department}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 pt-4 border-top"
            >
              <div className="d-flex justify-content-center align-items-center text-muted">
                <FiClock size={16} className="me-2" />
                <small>
                  <strong>Employment Duration:</strong>
                  <br />
                  {calculateEmploymentDuration(employee.hireDate)}
                </small>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Details Section */}
        <div className="col-lg-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <InfoCard
                  icon={<FiMail size={18} />}
                  label="Email Address"
                  value={employee.email}
                  color="#667eea"
                />
              </div>
              <div className="col-md-6">
                <InfoCard
                  icon={<FiPhone size={18} />}
                  label="Phone Number"
                  value={employee.phone}
                  color="#4facfe"
                />
              </div>
              <div className="col-md-6">
                <InfoCard
                  icon={<FiBriefcase size={18} />}
                  label="Job Title"
                  value={employee.jobTitle}
                  color="#f093fb"
                />
              </div>
              <div className="col-md-6">
                <InfoCard
                  icon={<FiCalendar size={18} />}
                  label="Hire Date"
                  value={formatDate(employee.hireDate)}
                  color="#00f5a0"
                />
              </div>
            </div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-4"
            >
              <h5 className="fw-bold mb-4 d-flex align-items-center text-dark">
                <FiAward size={20} className="me-2 text-primary" />
                Employment Summary
              </h5>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <div
                    className="text-center p-3 rounded"
                    style={{ background: "var(--gray-50)" }}
                  >
                    <div className="fw-bold text-primary fs-4">
                      {Math.floor(
                        (new Date() - new Date(employee.hireDate)) /
                          (1000 * 60 * 60 * 24 * 365)
                      )}
                    </div>
                    <small className="text-muted">Years of Service</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div
                    className="text-center p-3 rounded"
                    style={{ background: "var(--gray-50)" }}
                  >
                    <div className="fw-bold text-success fs-4">Active</div>
                    <small className="text-muted">Employment Status</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div
                    className="text-center p-3 rounded"
                    style={{ background: "var(--gray-50)" }}
                  >
                    <div className="fw-bold text-info fs-4">
                      {employee.department}
                    </div>
                    <small className="text-muted">Current Department</small>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card p-4 mt-4"
      >
        <h6 className="fw-bold mb-3 text-dark">Quick Actions</h6>
        <div className="d-flex flex-wrap gap-2">
          <Link
            to={`/edit/${employee._id}`}
            className="btn-modern btn-primary btn-sm"
          >
            <FiEdit size={14} className="me-1" />
            Edit Information
          </Link>
          <button
            className="btn-modern btn-secondary btn-sm"
            onClick={() => window.print()}
          >
            <FiUser size={14} className="me-1" />
            Print Profile
          </button>
          <a
            href={`mailto:${employee.email}`}
            className="btn-modern btn-secondary btn-sm"
          >
            <FiMail size={14} className="me-1" />
            Send Email
          </a>
          <a
            href={`tel:${employee.phone}`}
            className="btn-modern btn-secondary btn-sm"
          >
            <FiPhone size={14} className="me-1" />
            Call Employee
          </a>
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

export default ViewEmployee;
