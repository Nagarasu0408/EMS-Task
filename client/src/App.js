import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './components/AuthContext';
import EmployeeForm from './components/EmployeeForm';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><EmployeeForm /></PrivateRoute>} />
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
