import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEye, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  const getEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to load employees", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone. Do you really want to delete this employee?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#fff',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/employees/${id}`);
        toast.success("Employee deleted successfully", {
          position: "top-right",
          autoClose: 3000,
        });

        getEmployees();

        Swal.fire({
          title: 'Deleted!',
          text: 'Employee has been removed.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Error deleting employee:", err);
        toast.error("Failed to delete employee");
      }
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  // Filter employees based on search term and department
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      filterDepartment === 'all' || 
      emp.department?.toLowerCase() === filterDepartment.toLowerCase();
    
    return matchesSearch && matchesDepartment;
  });

  const departments = ['all', ...new Set(employees.map(emp => emp.department).filter(Boolean))];

  return (
    <div className="container-fluid">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="d-flex justify-content-between align-items-center mb-4"
      >
        <div>
          <h2 className="gradient-text mb-2">All Employees</h2>
          <p className="text-muted">View and manage all employees</p>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 mb-4"
      >
        <div className="row">
          <div className="col-md-8 mb-3">
            <div className="input-group input-group-nowrap">
              <span className="input-group-text">
                <FiSearch size={18} />
              </span>
              <input
                type="text"
                className="modern-form-control"
                placeholder="Search employees by name, email, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search employees"
              />
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <select
              className="modern-form-control"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              aria-label="Filter by department"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "🏢 All Departments" : `🏢 ${dept}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Employee Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card"
      >
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-5"
          >
            <div className="mb-3" style={{ fontSize: "4rem" }}>
              👥
            </div>
            <h4 className="text-muted">No employees found</h4>
            <p className="text-muted">
              {employees.length === 0 
                ? "No employees have been added yet" 
                : "Try adjusting your search criteria"
              }
            </p>
          </motion.div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee</th>
                  <th>Contact</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, index) => (
                  <motion.tr
                    key={emp._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="fw-bold text-primary">{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="avatar-gradient me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "16px",
                          }}
                        >
                          {emp.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <Link
                            to={`/view/${emp._id}`}
                            className="text-decoration-none fw-bold"
                            style={{ color: "var(--text-color)" }}
                          >
                            {emp.name || 'Unknown'}
                          </Link>
                          <div className="text-muted small">{emp.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-muted small">📧 {emp.email || 'N/A'}</div>
                      <div className="text-muted small">📱 {emp.phone || 'N/A'}</div>
                    </td>
                    <td>
                      <div className="fw-medium">{emp.jobTitle || 'N/A'}</div>
                    </td>
                    <td>
                      <span className="badge bg-info">{emp.department || 'N/A'}</span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/view/${emp._id}`}
                          className="btn-modern btn-primary btn-sm"
                          title="View Details"
                        >
                          <FiEye size={14} />
                        </Link>
                        <Link
                          to={`/edit/${emp._id}`}
                          className="btn-modern btn-secondary btn-sm"
                          title="Edit Employee"
                        >
                          <FiEdit size={14} />
                        </Link>
                        <button
                          onClick={() => deleteEmployee(emp._id)}
                          className="btn-modern btn-danger btn-sm"
                          title="Delete Employee"
                          aria-label={`Delete ${emp.name || 'employee'}`}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Employee;