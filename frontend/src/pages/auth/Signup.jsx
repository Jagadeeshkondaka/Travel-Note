import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import loginimgg from '../../assets/register.png'
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstancs';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSignup = async (e) => {
    e.preventDefault();
    if(!name){
      setError('Please enter your name');
      return;
    }
    if(!validateEmail(email)){
      setError('Please enter a valid email address');
      return;
    }
    if(!password){
      setError('Please enter your password');
      return;
    } 
    setError('');
    try {
      const response = await axiosInstance.post('/create-account', { fullname:name, email:email,password:password });
      
      const accessToken = response.data?.accessToken;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        navigate('/dashboard');
      } else {
        
        setError('Signup failed: Invalid response from server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };
  return (
    <div className="min-h-screen bg-cyan-50 relative">
  <div className="container mx-auto flex flex-col md:flex-row items-center justify-center min-h-screen px-4 sm:px-6 lg:px-10 py-10 gap-6">

    {/* Image Section */}
    <div
      className="w-full md:w-1/2 h-60 sm:h-80 md:h-[75vh] lg:h-[85vh] bg-cover bg-center rounded-lg md:rounded-l-lg md:rounded-r-none"
      style={{ backgroundImage: `url(${loginimgg})` }}
    ></div>

    {/* Form Section */}
    <div className="w-full md:w-1/2 bg-white rounded-lg md:rounded-l-none md:rounded-r-lg p-6 sm:p-10 md:p-12 lg:p-16 shadow-lg shadow-cyan-200/20">

      <form onSubmit={handleSignup}>
        <h4 className="text-xl sm:text-2xl font-semibold mb-6 text-center md:text-left">
          Create Account
        </h4>

        <input
          className="w-full px-4 sm:px-5 py-2 sm:py-3 text-sm bg-cyan-600/5 mb-4 outline-none rounded"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="w-full px-4 sm:px-5 py-2 sm:py-3 text-sm bg-cyan-600/5 mb-4 outline-none rounded"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          className="w-full px-4 sm:px-5 py-2 sm:py-3 text-sm bg-cyan-600/5 mb-4 outline-none rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button
          className="text-sm bg-cyan-700 w-full rounded-full px-4 sm:px-5 py-2 sm:py-3 text-white hover:bg-cyan-500 cursor-pointer"
          type="submit"
        >
          Create Account
        </button>

        <p className="text-sm text-slate-500 text-center my-4">
          Already have an account?
        </p>

        <button
          onClick={()=>navigate('/login')}
          type="button"
          className="text-sm bg-cyan-500 w-full rounded-full px-4 sm:px-5 py-2 sm:py-3 text-white hover:bg-cyan-700 cursor-pointer"
        >
          LOGIN
        </button>
      </form>

    </div>

  </div>
</div>
  )
}
export default Signup