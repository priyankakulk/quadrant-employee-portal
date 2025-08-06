import React, { useState } from "react";
import './index.css';
import LoginForm from './Components/LoginForm.js';
import logo from './Images/quadrant-logo-1.png';
import { useNavigate } from 'react-router-dom';

function SignInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both email and password.");
      return;
    }
  //Example validation logic
  fetch(`https://gateway-backend-api.azurewebsites.net/api/employees?username=${username}&password=${password}`)
  .then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  })
  .then((user) => {
    console.log("Fetched employee:", user);

    if (user && user.id) {
      const { id, role, first_name, last_name, email } = user;

      // Save user data
      localStorage.setItem('userId', id);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', `${first_name} ${last_name}`);
      localStorage.setItem('userEmail', email);

      //Redirect to the appropriate panel
      switch (role.toLowerCase()) {
        case 'admin':
          //window.location.href = '/admin-panel';
          break;
        case 'manager':
          //window.location.href = '/manager-panel';
          break;
        case 'employee':
          navigate('/portal');
          break;
        default:
          alert('Unknown role. Please contact support.');
      }
    } else {
      alert("Invalid username or password");
    }
  })
  .catch((error) => {
    console.error("Error fetching employee:", error);
    alert("Login failed. Please try again later.");
  });
}

return(
   <div className="flex flex-col items-center gap-6 pt-40">
      <div className="flex flex-col items-center gap-6">
        <img src={logo} alt="Quadrant Logo" className="w-128 h-auto mb-6" />
      <LoginForm />
      </div>
   </div>
)
}

export default SignInForm;
