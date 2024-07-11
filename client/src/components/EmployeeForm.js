import "./EmployeeList.css";

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const EmployeeForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        unique_employee_id: '',
        image: '',
        name: '',
        mobile_no: '',
        designation: '',
        gender: '',
        course: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:3000/api/employee', formData);
            console.log('Employee added:', res.data);
            navigate('/dashboard');
            // Optionally, show a success message or redirect to another page
        } catch (error) {
            console.error('Error adding employee:', error);
            // Handle error: show an error message to the user
        }
    };

    return (<>
        <Navbar />
        <div className="addEmployee">
            <h2>Add Employee</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="unique_employee_id" value={formData.unique_employee_id} onChange={handleChange} placeholder="Employee ID" />
                <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                <input type="text" name="mobile_no" value={formData.mobile_no} onChange={handleChange} placeholder="Mobile Number" />
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" />
                <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
                <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Course" />
                <button type="submit">Add Employee</button>
            </form>
        </div>
    </>
    );
};

export default EmployeeForm;
