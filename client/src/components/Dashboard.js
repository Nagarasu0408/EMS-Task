import "./Dashboard.css";
import React from 'react';
import EmployeeList from './EmployeeList';
import Navbar from './Navbar';

const Dashboard = () => {
    return (
        <div className='Main'>
            <Navbar />
            <EmployeeList />
        </div>
    );
};

export default Dashboard;

