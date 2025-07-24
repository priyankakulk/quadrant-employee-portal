import React, { useState } from "react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
    fetch(`http://localhost:8000/api/employees?username=${username}&password=${password}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched employees:", data);
        //save ID and role
        //use role to display correct page
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  };

return(
<div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md border border-gray-200">
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        placeholder="Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input
        type="password"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    <button
      type="submit"
      className="w-full bg-neutral-800 text-white py-2 rounded-lg font-semibold hover:bg-neutral-900 transition"
    >
      Sign In
    </button>

    <div className="text-sm text-center">
      <a href="#" className="text-black underline">
        Forgot password?
      </a>
    </div>
  </form>
</div>
)
}


export default LoginForm;