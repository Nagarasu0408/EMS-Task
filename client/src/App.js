import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeForm from './components/EmployeeForm';
// import PrivateRoute from './components/PrivateRoute';

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/employees" element={<EmployeeForm />} />
      <Route path="/" element={<Login />} /> {/* Default to login */}
    </Routes>
  </Router>
);

export default App;
