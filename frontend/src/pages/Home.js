import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiArrowUp,
  FiEye,
  FiEdit,
  FiTrash2,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

function Home() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    departments: 0,
    newThisMonth: 0,
  });
  const location = useLocation();
  const [showGoTop, setShowGoTop] = useState(false);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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
    const handleScroll = () => {
      setShowGoTop(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/employees");
      setEmployees(res.data);

      // Calculate stats
      const departments = new Set(res.data.map((emp) => emp.department));
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const newThisMonth = res.data.filter(
        (emp) => new Date(emp.hireDate) >= thisMonth
      ).length;

      setStats({
        total: res.data.length,
        departments: departments.size,
        newThisMonth,
      });
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
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
      try {
        await axios.delete(`http://localhost:5000/employees/${id}`);
        toast.success("Employee deleted successfully");
        getEmployees();
        Swal.fire({
          title: "Deleted!",
          text: "Employee has been removed.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
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

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" ||
      emp.department.toLowerCase() === filterDepartment.toLowerCase();
    return matchesSearch && matchesDepartment;
  });

  // Pagination logic
  const totalEntries = filteredEmployees.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Page controls
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll to table top on page change
    const table = document.getElementById("employee-table");
    if (table) table.scrollIntoView({ behavior: "smooth" });
  };

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDepartment, employees]);

  const departments = [
    "all",
    ...Array.from(new Set(employees.map((emp) => emp.department))),
  ];

  const StatCard = ({ icon, title, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 card-hover"
      style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)` }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <p className="text-muted mb-1 fw-medium">{title}</p>
          <h3 className="mb-0 fw-bold" style={{ color }}>
            {value}
          </h3>
        </div>
        <div
          className="p-3 rounded-circle"
          style={{ background: `${color}20`, color }}
        >
          {icon}
        </div>
      </div>
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
        <div>
          <h2 className="gradient-text mb-2">Employee Management</h2>
          <p className="text-muted">Manage your team efficiently</p>
        </div>
        <Link to="/add" className="btn-modern btn-primary">
          <FiPlus size={18} />
          Add Employee
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <StatCard
            icon={<FiUsers size={24} />}
            title="Total Employees"
            value={stats.total}
            color="#667eea"
          />
        </div>
        <div className="col-md-4 mb-3">
          <StatCard
            icon={<FiFilter size={24} />}
            title="Departments"
            value={stats.departments}
            color="#f093fb"
          />
        </div>
        <div className="col-md-4 mb-3">
          <StatCard
            icon={<FiTrendingUp size={24} />}
            title="New This Month"
            value={stats.newThisMonth}
            color="#4facfe"
          />
        </div>
      </div>

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
        id="employee-table"
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
        ) : totalEntries === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-5"
          >
            <div className="mb-3" style={{ fontSize: "4rem" }}>
              👥
            </div>
            <h4 className="text-muted">No employees found</h4>
            <p className="text-muted">Try adjusting your search criteria</p>
          </motion.div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="modern-table rounded-0">
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
                  {currentEmployees.map((emp, index) => (
                    <motion.tr
                      key={emp._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="fw-bold text-primary">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
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
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <Link
                              to={`/view/${emp._id}`}
                              className="text-decoration-none fw-bold"
                              style={{ color: "var(--text-color)" }}
                            >
                              {emp.name}
                            </Link>
                            <div className="text-muted small">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-muted small">📧 {emp.email}</div>
                        <div className="text-muted small">📱 {emp.phone}</div>
                      </td>
                      <td>
                        <div className="fw-medium">{emp.jobTitle}</div>
                      </td>
                      <td>
                        <span className="badge bg-info">{emp.department}</span>
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
                            aria-label={`Delete ${emp.name}`}
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
            {/* Pagination Controls */}
            <div className="d-flex flex-wrap justify-content-between align-items-center px-3 py-3">
              <div className="text-muted small mb-2">
                {totalEntries > 0
                  ? `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(
                      currentPage * pageSize,
                      totalEntries
                    )} of ${totalEntries} entries`
                  : "No entries to show"}
              </div>
              <div className="pagination">
                <button
                  className={`prev-btn me-4${
                    currentPage === 1 ? " disabled" : ""
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx + 1}
                    className={`page-btn${
                      currentPage === idx + 1 ? " active" : ""
                    }`}
                    onClick={() => handlePageChange(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  className={`next-btn ms-2${
                    currentPage === totalPages ? " disabled" : ""
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      <button
        className={`fab ${showGoTop ? "" : "fab-hidden"}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Go to top"
      >
        <FiArrowUp size={24} />
      </button>
    </div>
  );
}

export default Home;
