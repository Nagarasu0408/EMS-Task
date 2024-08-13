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

    // const handleEdit = (employee) => {
    //     setFormData({
    //         ...employee,
    //         course: Array.isArray(employee.course) ? employee.course : [],
    //     });
    //     setSelectedImage(`http://localhost:3000/uploads/${employee.image}`); // Set existing image for preview
    //     setEditMode(true);
    //     setEditId(employee._id);
    // };

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
                    setFormData({ ...formData, image: file }); // Store the file object
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleEdit = (employee) => {
        setFormData({
            ...employee,
            course: Array.isArray(employee.course) ? employee.course : [],
        });
        setSelectedImage(`http://localhost:3000/uploads/${employee.image}`); // Set existing image for preview
        setEditMode(true);
        setEditId(employee._id);
        console.log('Editing employee:', employee);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('unique_employee_id', formData.unique_employee_id);
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('mobile_no', formData.mobile_no);
        data.append('designation', formData.designation);
        data.append('gender', formData.gender);
        data.append('course', formData.course.join(',')); // Join courses as a string

        // Only append the image if it's a new one
        if (formData.image && formData.image !== selectedImage) {
            data.append('image', formData.image); // Append the file object
        }

        // Debugging: Log FormData content
        for (let pair of data.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/employee/${editId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
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
                    course: [],
                });
                setSelectedImage(null);
            } else {
                console.error('Error updating employee:', response.data);
            }
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
                        <th>Mobile No</th>
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
                            <td><img src={`http://localhost:3000/uploads/${employee.image}`} alt='profile' style={{ width: '50px', height: '50px', borderRadius: '100%', border: '2px solid #9C9C9C3A' }} /></td>
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
                                    value="MCA"
                                    checked={formData.course.includes('MCA')}
                                    onChange={handleChange}
                                />
                                MCA
                                <span className="checkmark"></span>
                            </label>
                            <label className="container">
                                <input
                                    type="checkbox"
                                    name="course"
                                    value="BCA"
                                    checked={formData.course.includes('BCA')}
                                    onChange={handleChange}
                                />
                                BCA
                                <span className="checkmark"></span>
                            </label>
                            <label className="container">
                                <input
                                    type="checkbox"
                                    name="course"
                                    value="BSC"
                                    checked={formData.course.includes('BSC')}
                                    onChange={handleChange}
                                />
                                BSC
                                <span className="checkmark"></span>
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
