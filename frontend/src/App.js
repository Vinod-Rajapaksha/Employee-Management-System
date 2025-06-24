import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import ViewEmployee from './pages/ViewEmployee';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <h2 className="text-center mb-4">👨‍💼 Employee Management System</h2>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/edit/:id" element={<EditEmployee />} />
          <Route path="/view/:id" element={<ViewEmployee />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
