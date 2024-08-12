import "./EmployeeList.css";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        unique_employee_id: '',
        image: '',
        name: '',
        email: '',
        mobile_no: '',
        designation: '',
        gender: '',
        course: [],
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
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData((prevState) => {
                const newCourses = checked
                    ? [...prevState.course, value]
                    : prevState.course.filter((course) => course !== value);
                return { ...prevState, course: newCourses };
            });
        } else if (type === 'file') {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSelectedImage(reader.result);
                    setFormData({ ...formData, image: reader.result });
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
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
                email: '',
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
                        <th>Email</th>
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
                            <td><img src={employee.image} alt='profile' style={{ width: '50px', height: '50px', borderRadius: '100%', border: '2px solid #9C9C9C3A' }} /></td>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.mobile_no}</td>
                            <td>{employee.designation}</td>
                            <td>{employee.gender}</td>
                            <td>{employee.course}</td>
                            <td>{employee.create_date}</td>
                            <td className="Editbtn">
                                <button className="Editbutton" onClick={() => handleEdit(employee)}>Edit</button>
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
                        <input type="file" name="image" onChange={handleChange} accept=".png, .jpg, .jpeg" />
                        {selectedImage && <img src={selectedImage} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                        <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                        <input type="text" name="mobile_no" value={formData.mobile_no} onChange={handleChange} placeholder="Mobile Number" required />
                        <select name="designation" onChange={handleChange}>
                            <option value={formData.designation}>{formData.designation}</option>
                            <option value="HR">HR</option>
                            <option value="Manager">Manager</option>
                            <option value="Fresher">Fresher</option>
                        </select>
                        {/* <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" /> */}
                        <select name="gender" onChange={handleChange}>
                            <option value={formData.gender}>{formData.gender}</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="other">Other</option>
                        </select>
                        <div>
                            <label className="container">
                                <input
                                    type="checkbox"
                                    name="course"
                                    value="MCA/"
                                    checked={formData.course.includes('MCA/')}
                                    onChange={handleChange}
                                />
                                MCA
                                <span class="checkmark"></span>
                            </label>
                            <label className="container">
                                <input
                                    type="checkbox"
                                    name="course"
                                    value="BCA/"
                                    checked={formData.course.includes('BCA/')}
                                    onChange={handleChange}
                                />
                                BCA
                                <span class="checkmark"></span>
                            </label>
                            <label className="container">
                                <input
                                    type="checkbox"
                                    name="course"
                                    value="BSC/"
                                    checked={formData.course.includes('BSC/')}
                                    onChange={handleChange}
                                />
                                BSC
                                <span class="checkmark"></span>
                            </label>
                        </div>
                        <button type="submit">Update Employee</button>
                        <button className="delete" onClick={() => setEditMode(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
