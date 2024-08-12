import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // setError("");
    // setIsLoading();
    const handleRegister = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/auth/register', { f_userName: username, f_Pwd: password });
            alert(res.data.message);
            navigate('/');
        } catch (err) {
            alert('Error registering user');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
            />
            <button onClick={handleRegister} disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
            </button>
        </div>
    );
};

export default Register;
