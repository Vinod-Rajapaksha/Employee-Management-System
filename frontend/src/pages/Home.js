import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [employees, setEmployees] = useState([]);

  // Fetch employees
  const getEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:5000/employees/${id}`);
        getEmployees(); // Refresh list
      } catch (err) {
        console.error("Error deleting employee:", err);
      }
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Employee List</h4>
        <Link to="/add" className="btn btn-success">+ Add Employee</Link>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Job Title</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={emp._id}>
              <td>{index + 1}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.jobTitle}</td>
              <td>{emp.department}</td>
              <td>
                <Link to={`/view/${emp._id}`} className="btn btn-info btn-sm me-2">View</Link>
                <Link to={`/edit/${emp._id}`} className="btn btn-primary btn-sm me-2">Edit</Link>
                <button onClick={() => deleteEmployee(emp._id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
