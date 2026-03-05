import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import loginimg from '../../assets/Login2.png'
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstancs';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handlelogin = async (e) => {
    e.preventDefault();
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
      const response = await axiosInstance.post('/login', { email:email,password:password });
      // backend returns an "accessToken" field, not "token"
      const accessToken = response.data?.accessToken;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        navigate('/dashboard');
      } else {
        // guard: if login succeeded but payload changed
        setError('Login failed: Invalid response from server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };
  return (
    <div className='h-screen bg-cyan-50 overflow-hidden  relative'>
      <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
        <div className= 'w-2/4 h-[90vh] flex items-end bg-cover bg-center rounded-lg p-10 z-50' style={{ backgroundImage: `url(${loginimg})` }}>
        </div>
        <div className='w-2/4 h-[70vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
          <form onSubmit={handlelogin}>
            <h4 className='text-2xl font-semibold mb-7'>Login</h4>
            <input className="w-full px-5 py-3 text-sm  bg-cyan-600/5 mb-4 outline-none" type="text" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className="w-full px-5 py-3 text-sm  bg-cyan-600/5 mb-4 outline-none" type="password" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            {error && <p className='text-sm text-red-500 mb-4'>{error}</p>}
            <button className='text-sm bg-cyan-700 w-full rounded-full px-5 py-3 text-white hover:bg-cyan-500 cursor-pointer' type='submit'>LOGIN</button>
            <p className='text-sm text-slate-500  text-center my-4 hover:text-blue-400 cursor-pointer'>Don't have an account?</p>
            <button onClick={()=>{navigate('/signup')}} className='text-sm bg-cyan-500 w-full rounded-full px-5 py-3 text-white hover:bg-cyan-700 cursor-pointer' type='submit' >CREATE ACCOUNT</button>
          </form>
        </div>    
      </div>
    </div>
  )
}
export default Login