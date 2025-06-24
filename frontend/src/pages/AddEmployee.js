import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
  });

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/employees', formData);
      alert('Employee added successfully!');
      navigate('/'); // Redirect to Home page
    } catch (err) {
      console.error('Error adding employee:', err);
      alert('Failed to add employee');
    }
  };

  return (
    <div>
      <h4 className="mb-4">➕ Add New Employee</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" className="form-control" name="name" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="email" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input type="text" className="form-control" name="phone" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Job Title</label>
          <input type="text" className="form-control" name="jobTitle" required onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Department</label>
          <input type="text" className="form-control" name="department" onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Add Employee</button>
      </form>
    </div>
  );
}

export default AddEmployee;
