// src/components/Navbar.js
import "./Navbar.css";
import Logo from "./Images/Logo.png";
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        // sessionStorage.clear(); // Clear session storage
        // localStorage.clear(); // Clear local storage
        navigate('/login', { replace: true }); // Redirect to login on logout and disable back navigation
    };

    const EmployeeForm = () => {
        navigate('/employees');
    };

    return (
        <>
            <div className="Container">
                <div className="Logo">
                    <img src={Logo} alt="Logo" />
                </div>
                <div className="Navbar">
                    <button className="hover-underline-animation"><span className="ic--sharp-dashboard"></span>Home</button>
                    <button type="button" onClick={EmployeeForm}><span className="carbon--new-tab"></span>Create new Employee</button>
                    {/* <p className="hover-underline-animation">EmployeeName</p> */}
                    <div className="Logout">
                        <button type="button" onClick={handleLogout}><span className="mi--log-out"></span>Logout</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
