import "./Navbar.css";
import Logo from "./Images/Logo.png"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        console.log('Token retrieved:', token);
        if (!token) {
            console.error('No token found');
            navigate('/login');
        }

        try {
            await axios.post(
                'http://localhost:3000/api/auth/logout',
                {},
                {
                    headers: {
                        'x-auth-token': token,
                    }
                }
            );

            // Clear the JWT token from localStorage or cookies
            localStorage.removeItem('token');
            // Redirect to login page
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            navigate('/login');
        }
    };
    const EmployeeForm = () => {
        navigate('/employees');
        console.log("click");
    };
    return (
        <>
            <div className="Container">
                <div className="Logo">
                    <img src={Logo} alt="Logo" />
                </div>
                <div className="Navbar">
                    <a href='/dashboard' className="hover-underline-animation">Home</a>
                    < button type="button" onClick={EmployeeForm} > Create new Employee</button >
                    <p className="hover-underline-animation">EmployeeName</p>
                    <button type="button" onClick={handleLogout} >Logout</button>
                </div>
            </div >
        </>
    );
}

export default Navbar;




