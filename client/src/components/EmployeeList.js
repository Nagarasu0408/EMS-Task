import "./EmployeeList.css";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        unique_employee_id: '',
        image: '',
        name: '',
        mobile_no: '',
        designation: '',
        gender: '',
        course: '',
    });
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/employee');
            setEmployees(res.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/employee/${id}`);
            fetchEmployees(); // Refresh employee list after deletion
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleEdit = (employee) => {
        setFormData(employee); // Populate form data with employee details
        setEditMode(true);
        setEditId(employee._id);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/employee/${editId}`, formData);
            fetchEmployees(); // Refresh employee list after update
            setEditMode(false);
            setEditId(null);
            setFormData({
                unique_employee_id: '',
                image: '',
                name: '',
                mobile_no: '',
                designation: '',
                gender: '',
                course: '',
            });
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (key) => {
        setSortBy(key);
        const sortedEmployees = [...employees].sort((a, b) => {
            if (key === 'name' || key === 'email' || key === 'unique_employee_id') {
                return a[key].localeCompare(b[key]);
            } else if (key === 'create_date') {
                return new Date(a[key]) - new Date(b[key]);
            }
            return 0;
        });
        setEmployees(sortedEmployees);
    };
    console.log(sortBy);

    const filteredEmployees = employees.filter((employee) =>
        Object.values(employee).some(
            (value) =>
                typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div>
            <h2>Employee List</h2>
            <div className="Filter">
                <div>
                    <input
                        type="text"
                        placeholder="Search by name, email, ID, etc."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className="Fbtn">
                    <button onClick={() => handleSort('unique_employee_id')}>Sort by ID</button>
                    <button onClick={() => handleSort('name')}>Sort by Name</button>
                    {/* <button onClick={() => handleSort('email')}>Sort by Email</button> */}
                    <button onClick={() => handleSort('create_date')}>Sort by Date</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Designation</th>
                        <th>Gender</th>
                        <th>Qualification</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((employee) => (
                        <tr key={employee._id}>
                            <td>{employee.unique_employee_id}</td>
                            <td><img src={employee.image} alt='profile' style={{ height: '50px', borderRadius: '50px' }} /></td>
                            <td>{employee.name}</td>
                            <td>{employee.mobile_no}</td>
                            <td>{employee.designation}</td>
                            <td>{employee.gender}</td>
                            <td>{employee.course}</td>
                            <td>{employee.create_date}</td>
                            <td className="Editbtn">
                                <button onClick={() => handleEdit(employee)}>Edit</button>
                                <button className="delete" onClick={() => handleDelete(employee._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editMode && (
                <div className="Edit">
                    <h2>Edit Employee</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="unique_employee_id" value={formData.unique_employee_id} onChange={handleChange} placeholder="Employee ID" required />
                        <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required />
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                        <input type="text" name="mobile_no" value={formData.mobile_no} onChange={handleChange} placeholder="Mobile Number" required />
                        <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" required />
                        <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" required />
                        <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Course" required />
                        <button type="submit">Update Employee</button>
                        <button className="delete" onClick={() => setEditMode(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
