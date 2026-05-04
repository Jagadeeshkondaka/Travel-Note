import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstancs';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name) {
      setError('Please enter your name');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log("Sending signup request...");

      const response = await axiosInstance.post('/create-account', {
        fullname: name,
        email,
        password,
      });

      console.log("Signup response:", response.data);

      const accessToken = response.data?.accessToken;

      if (accessToken) {
        localStorage.setItem('token', accessToken);
        navigate('/dashboard');
      } else {
        setError('Signup failed: Invalid response from server.');
      }

    } catch (err) {
      console.error("SIGNUP ERROR:", err.response?.data || err);

      if (err.code === "ECONNABORTED") {
        setError("Server is taking too long. Please try again.");
      } else {
        setError(
          err.response?.data?.message ||
          "Server not responding. Try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyan-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <form onSubmit={handleSignup}>
          <h2 className="text-2xl font-semibold text-center mb-6">
            Create Account
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 mb-4 border rounded-lg outline-none focus:border-cyan-400"
          />

          <input
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mb-4 border rounded-lg outline-none focus:border-cyan-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-4 border rounded-lg outline-none focus:border-cyan-400"
          />

          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-cyan-600 hover:bg-cyan-500"
            }`}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate('/login')}
              className="text-cyan-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>

      </div>
    </div>
  );
};

export default Signup;