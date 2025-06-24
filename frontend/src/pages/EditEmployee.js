import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditEmployee() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
  });

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch employee by ID
  useEffect(() => {
    axios.get(`http://localhost:5000/employees/${id}`)
      .then(res => {
        setFormData(res.data);
      })
      .catch(err => {
        console.error('Error loading employee:', err);
        alert('Could not load employee data');
      });
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/employees/${id}`, formData);
      alert('Employee updated successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error updating employee:', err);
      alert('Update failed!');
    }
  };

  return (
    <div>
      <h4 className="mb-4">✏️ Edit Employee</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Job Title</label>
          <input type="text" className="form-control" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Department</label>
          <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Update Employee</button>
      </form>
    </div>
  );
}

export default EditEmployee;
