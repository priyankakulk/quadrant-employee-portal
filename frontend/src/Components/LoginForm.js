import React, { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

return(
    <div className="w-80 p-6 rounded-md border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-neutral-800 text-white py-2 rounded-md font-medium hover:bg-neutral-900 transition"
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
  );
}

export default LoginForm;