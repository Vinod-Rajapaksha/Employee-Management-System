import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers,
  FiFilter,
  FiTrendingUp,
  FiDollarSign,
  FiCalendar,
  FiPieChart,
  FiBarChart2,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList
} from 'recharts';

// StatCard Component
const StatCard = ({ icon, title, value, color, trend, onClick, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.03 }}
    className="stat-card p-4"
    style={{
      background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      borderLeft: `4px solid ${color}`,
      cursor: onClick ? 'pointer' : 'default'
    }}
    onClick={onClick}
  >
    <div className="d-flex align-items-center justify-content-between">
      <div>
        <p className="text-muted mb-1 fw-medium small">{title}</p>
        {loading ? (
          <div className="placeholder-glow">
            <h3 className="mb-0 fw-bold placeholder" style={{ width: '80px', height: '32px' }}></h3>
          </div>
        ) : (
          <>
            <h3 className="mb-0 fw-bold" style={{ color }}>{value}</h3>
            {trend && (
              <small className={`d-flex align-items-center mt-1 ${trend.value > 0 ? 'text-success' : 'text-danger'}`}>
                {trend.value > 0 ? <FiTrendingUp className="me-1" /> : <FiTrendingUp className="me-1" style={{ transform: 'rotate(180deg)' }} />}
                {Math.abs(trend.value)}% {trend.label}
              </small>
            )}
          </>
        )}
      </div>
      <div
        className="p-3 rounded-circle d-flex align-items-center justify-content-center"
        style={{
          background: `${color}15`,
          color,
          width: '48px',
          height: '48px'
        }}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

// TimeRangeSelector Component
const TimeRangeSelector = ({ value, onChange }) => {
  const ranges = [
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' }
  ];

  return (
    <div className="time-range-selector">
      {ranges.map((range) => (
        <motion.button
          key={range.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`time-range-btn ${value === range.id ? 'active' : ''}`}
          onClick={() => onChange(range.id)}
        >
          {range.label}
          {value === range.id && (
            <motion.div
              className="underline"
              layoutId="underline"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

// AnalyticsTabs Component
const AnalyticsTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', icon: <FiBarChart2 />, label: 'Overview' },
    { id: 'charts', icon: <FiPieChart />, label: 'Charts' },
    { id: 'details', icon: <FiUsers />, label: 'Details' }
  ];

  return (
    <div className="analytics-tabs">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div
              className="tab-indicator"
              layoutId="tabIndicator"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

// DepartmentFilter Component
const DepartmentFilter = ({ value, options, onChange }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="department-filter">
      <motion.button
        className="filter-toggle"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <span>Department: {value === 'all' ? 'All' : value}</span>
        {expanded ? <FiChevronUp /> : <FiChevronDown />}
      </motion.button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="filter-options"
          >
            <motion.button
              key="all"
              className={`filter-option ${value === 'all' ? 'active' : ''}`}
              onClick={() => {
                onChange('all');
                setExpanded(false);
              }}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              type="button"
            >
              All Departments
            </motion.button>
            {options.map((dept) => (
              <motion.button
                key={dept}
                className={`filter-option ${value === dept ? 'active' : ''}`}
                onClick={() => {
                  onChange(dept);
                  setExpanded(false);
                }}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                type="button"
              >
                {dept}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Analytics Component
const Analytics = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    departments: 0,
    newThisMonth: 0,
    avgSalary: 0,
    salaryExpense: 0,
    activeProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [departmentData, setDepartmentData] = useState([]);
  const [hiringTrend, setHiringTrend] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allDepartments, setAllDepartments] = useState([]);
  const pageSize = 5;

  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B', '#10B981'];

  // Store all employees for filter reference
  const [allEmployees, setAllEmployees] = useState([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/employees");
      const data = res.data;
      setAllEmployees(data);

      // Get all departments from the full data (not filtered)
      const departmentsSet = new Set(data.map(emp => emp.department));
      setAllDepartments(Array.from(departmentsSet));

      // Filter by department if needed
      const filteredData =
        departmentFilter === 'all'
          ? data
          : data.filter(emp => emp.department === departmentFilter);

      // Calculate departments (use all departments, not filtered)
      // const departments = new Set(data.map((emp) => emp.department));

      // Calculate new hires this month
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const newThisMonth = filteredData.filter(
        (emp) => new Date(emp.hireDate) >= thisMonth
      ).length;

      // Calculate salary metrics
      const salaries = filteredData.map((emp) => emp.salary || 0);
      const avgSalary =
        salaries.length > 0
          ? salaries.reduce((a, b) => a + b, 0) / salaries.length
          : 0;
      const salaryExpense = salaries.reduce((a, b) => a + b, 0);

      // Calculate department distribution (from filtered data for chart)
      const deptCounts = {};
      filteredData.forEach((emp) => {
        deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
      });
      const deptChartData = Object.keys(deptCounts).map((dept) => ({
        name: dept,
        value: deptCounts[dept],
      }));

      // Calculate hiring trends (last 6 months)
      const now = new Date();
      const hiringTrendData = Array.from({ length: 6 }).map((_, i) => {
        const month = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

        const hires = filteredData.filter((emp) => {
          const hireDate = new Date(emp.hireDate);
          return hireDate >= monthStart && hireDate <= monthEnd;
        }).length;

        return {
          name: month.toLocaleString("default", { month: "short" }),
          hires,
        };
      });

      setStats({
        total: filteredData.length,
        departments: departmentsSet.size,
        newThisMonth,
        avgSalary: parseFloat(avgSalary.toFixed(2)),
        salaryExpense,
        activeProjects: filteredData.reduce(
          (sum, emp) => sum + (emp.projects?.length || 0),
          0
        ),
      });

      setEmployees(filteredData);
      setDepartmentData(deptChartData);
      setHiringTrend(hiringTrendData);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      toast.error("Failed to fetch analytics data", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    setCurrentPage(1); // reset pagination when data changes
    // eslint-disable-next-line
  }, [departmentFilter, timeRange]);

  const handleRefresh = () => {
    fetchStats();
    toast.info('Data refreshed', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    toast.info(`Showing data for ${range}`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleDepartmentFilter = (dept) => {
    setDepartmentFilter(dept);
    if (dept === 'all') {
      toast.info('Showing all departments', {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.info(`Filtering by ${dept} department`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter employees by search term
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalEntries = filteredEmployees.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const currentEmployees = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="analytics-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="analytics-header"
      >
        <div>
          <h2 className="gradient-text">Employee Analytics</h2>
          <p className="text-muted">Insights and metrics about your workforce</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FiRefreshCw className={`refresh-icon ${loading ? 'spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </motion.button>
      </motion.div>

      <div className="controls-row">
        <TimeRangeSelector
          value={timeRange}
          onChange={handleTimeRangeChange}
        />

        {!loading && (
          <DepartmentFilter
            value={departmentFilter}
            options={allDepartments}
            onChange={handleDepartmentFilter}
          />
        )}
      </div>

      <AnalyticsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {loading ? (
        <div className="loading-state">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="spinner"
          />
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="stats-grid">
              <StatCard
                icon={<FiUsers size={20} />}
                title="Total Employees"
                value={stats.total}
                color="#6366F1"
                trend={{ value: 5.2, label: 'vs last month' }}
                loading={loading}
              />
              <StatCard
                icon={<FiFilter size={20} />}
                title="Departments"
                value={stats.departments}
                color="#8B5CF6"
                loading={loading}
              />
              <StatCard
                icon={<FiTrendingUp size={20} />}
                title="New Hires"
                value={stats.newThisMonth}
                color="#EC4899"
                trend={{ value: 12.8, label: 'vs last month' }}
                loading={loading}
              />
              <StatCard
                icon={<FiDollarSign size={20} />}
                title="Avg Salary"
                value={formatCurrency(stats.avgSalary)}
                color="#10B981"
                trend={{ value: 3.5, label: 'vs last quarter' }}
                loading={loading}
              />
              <StatCard
                icon={<FiDollarSign size={20} />}
                title="Salary Expense"
                value={formatCurrency(stats.salaryExpense)}
                color="#F59E0B"
                loading={loading}
              />
              <StatCard
                icon={<FiCalendar size={20} />}
                title="Active Projects"
                value={stats.activeProjects}
                color="#F43F5E"
                trend={{ value: 8.1, label: 'vs last month' }}
                loading={loading}
              />
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="charts-container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="chart-card"
              >
                <div className="chart-header">
                  <h5>
                    <FiPieChart className="icon me-2" />
                    Department Distribution
                  </h5>
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} : ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fontSize={13} fontWeight={"bold"} fill={COLORS[index % COLORS.length]} />
                        ))}
                        <LabelList
                          dataKey="value"
                          position="inside"
                          formatter={(value) => value}
                          fill="#fff"
                        />
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} employees`, 'Count']}
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: '20px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="chart-card"
              >
                <div className="chart-header">
                  <h5>
                    <FiBarChart2 className="icon me-2" />
                    Hiring Trends (Last 6 Months)
                  </h5>
                </div>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={hiringTrend}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis
                        tick={{ fill: '#6B7280' }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: '20px'
                        }}
                      />
                      <Bar
                        dataKey="hires"
                        name="New Hires"
                        fill="#4F46E5"
                        radius={[4, 4, 0, 0]}
                      >
                        {hiringTrend.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'details' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="details-card"
            >
              <div className="details-header">
                <h5>Employee Details</h5>
                <div className="details-actions">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="search-input"
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
              <div className="table-responsive">
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Hire Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center" }}>No employees found</td>
                      </tr>
                    ) : (
                      currentEmployees.map((emp) => (
                        <motion.tr
                          key={emp.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                        >
                          <td>{emp.name}</td>
                          <td>
                            <span
                              className="dept-badge"
                              style={{
                                backgroundColor: `${COLORS[allDepartments.findIndex(d => d === emp.department) % COLORS.length]}20`,
                                color: COLORS[allDepartments.findIndex(d => d === emp.department) % COLORS.length]
                              }}
                            >
                              {emp.department}
                            </span>
                          </td>
                          <td>{emp.jobTitle}</td>
                          <td>{new Date(emp.hireDate).toLocaleDateString()}</td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">
                <div className="showing-entries">
                  {totalEntries > 0
                    ? `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, totalEntries)} of ${totalEntries} entries`
                    : 'No entries to show'}
                </div>
                <div className="pagination">
                  <button className={`prev-btn me-4${currentPage === 1 ? ' disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx + 1}
                      className={`page-btn${currentPage === idx + 1 ? ' active' : ''}`}
                      onClick={() => handlePageChange(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button className={`next-btn ms-2${currentPage === totalPages ? ' disabled' : ''}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Analytics;