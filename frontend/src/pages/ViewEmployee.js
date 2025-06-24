import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function ViewEmployee() {
  const [employee, setEmployee] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/employees/${id}`)
      .then((res) => {
        setEmployee(res.data);
      })
      .catch((err) => {
        console.error("Error loading employee:", err);
        alert("Could not load employee details.");
      });
  }, [id]);

  if (!employee) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h4 className="mb-4">👁️ View Employee</h4>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{employee.name}</h5>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Phone:</strong> {employee.phone}</p>
          <p><strong>Job Title:</strong> {employee.jobTitle}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Hire Date:</strong> {new Date(employee.hireDate).toLocaleDateString()}</p>
          <Link to="/" className="btn btn-secondary mt-3">⬅ Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default ViewEmployee;
