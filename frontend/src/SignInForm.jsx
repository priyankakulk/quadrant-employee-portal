import React, { useState } from "react";
import './index.css';
import LoginForm from './Components/LoginForm.js';
import logo from './Images/quadrant-logo-1.png';


function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // Example validation logic
    //fetch(`http://localhost:8000/api/employees?username=${username}&password=${password}`)
      //.then((res) => res.json())
      //.then((data) => {
        //console.log("Fetched employees:", data);
        //save ID and role
        //use role to display correct page
      //})
      //.catch((error) => {
        //console.error("Error fetching employees:", error);
      //});
  };

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
