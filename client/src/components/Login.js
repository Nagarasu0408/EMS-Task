import "./Login.css";
import React, { useState } from 'react';
import Logo from "./Images/Logo.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthContext";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', {
                f_userName: username,
                f_Pwd: password
            });

            if (res.status === 200) {
                const { token, user } = res.data;
                localStorage.setItem('token', token);
                login(true);  // Set user in context
                alert('Login successful');
                navigate('/dashboard');
                console.log(user); //demo
            } else {
                alert('Login failed');
            }
        } catch (error) {
            alert('Error logging in');
            console.error('Login Error:', error);
        }
    };

    return (
        <div>
            <p className="Heading">Welcome Our <span style={{ color: "#1871F7" }}>New</span> <span>Employee Management System</span></p>
            <div className="main">
                <img src={Logo} alt="Logo" />
                <p className="sign" align="center">Login</p>
                <input className="un" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input className="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button className="submit" onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default Login;
