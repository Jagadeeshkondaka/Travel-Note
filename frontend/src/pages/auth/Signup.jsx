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
    <div className='min-h-screen bg-cyan-50 overflow-hidden relative'>
      <div className='container mx-auto flex flex-col md:flex-row items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-10'>
        <div className='w-full md:w-2/4 lg:w-2/4 h-[250px] sm:h-[400px] md:h-[70vh] lg:h-[90vh] flex items-end bg-cover bg-center rounded-lg p-6 sm:p-10 z-50 mb-6 md:mb-0 lg:mb-0' style={{ backgroundImage: `url(${loginimgg})` }}>
        </div>
        <div className='w-full md:w-2/4 lg:w-2/4 bg-white rounded-lg md:rounded-r-lg md:rounded-l-none lg:rounded-r-lg lg:rounded-l-none relative p-6 sm:p-10 md:p-12 lg:p-16 shadow-lg shadow-cyan-200/20'>
          <form onSubmit={handleSignup}>
            <h4 className='text-xl sm:text-2xl font-semibold mb-7'>Create Account</h4>
            <input className="w-full px-4 sm:px-5 py-2 sm:py-3 text-sm bg-cyan-600/5 mb-4 outline-none rounded" type="text" placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)} />
            <input className="w-full px-4 sm:px-5 py-2 sm:py-3 text-sm bg-cyan-600/5 mb-4 outline-none rounded" type="text" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input className="w-full px-4 sm:px-5 py-2 sm:py-3 text-sm bg-cyan-600/5 mb-4 outline-none rounded" type="password" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            {error && <p className='text-sm text-red-500 mb-4'>{error}</p>}
            <button className='text-sm bg-cyan-700 w-full rounded-full px-4 sm:px-5 py-2 sm:py-3 text-white hover:bg-cyan-500 cursor-pointer' type='submit'>Create Account</button>
            <p className='text-sm text-slate-500 text-center my-4 hover:text-blue-400 cursor-pointer'>And</p>
            <button onClick={()=>{navigate('/login')}} className='text-sm bg-cyan-500 w-full rounded-full px-4 sm:px-5 py-2 sm:py-3 text-white hover:bg-cyan-700 cursor-pointer' type='button' >LOGIN</button>
          </form>
        </div>    
      </div>
    </div>
  )
}
export default Signup