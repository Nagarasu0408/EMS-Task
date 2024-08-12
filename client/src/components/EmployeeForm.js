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
        email: '',
        mobile_no: '',
        designation: '',
        gender: '',
        course: [],
    });
    const [selectedImage, setSelectedImage] = useState(null);

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

        // If you need to upload the image separately, you might need additional code here
        try {
            const res = await axios.post('http://localhost:3000/api/employee', formData);
            console.log('Employee added:', res.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="addEmployee">
                <h2>Add Employee</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="unique_employee_id" value={formData.unique_employee_id} onChange={handleChange} placeholder="Employee ID" />
                    <input type="file" name="image" onChange={handleChange} accept=".png, .jpg, .jpeg" />
                    {selectedImage && <img src={selectedImage} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'fit' }} />}
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                    <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                    <input type="text" name="mobile_no" value={formData.mobile_no} onChange={handleChange} placeholder="Mobile Number" />
                    <select name="designation" onChange={handleChange}>
                        <option value="">Designation</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Fresher">Fresher</option>
                    </select>
                    <select name="gender" onChange={handleChange}>
                        <option value="">Gender</option>
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
                            <span className="checkmark"></span>
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
                            <span className="checkmark"></span>
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
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <button type="submit">Add Employee</button>
                </form>
            </div>
        </>
    );
};

export default EmployeeForm;