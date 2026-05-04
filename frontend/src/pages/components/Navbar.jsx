import React from 'react';
import Logo from '../../assets/logo.png';
import Profileinfo from './cards/Profileinfo';
import { useNavigate } from 'react-router-dom';
import { MdSearch } from 'react-icons/md';

const Navbar = ({ userinfo, searchTerm, onSearch }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className='bg-white flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-10 py-3 gap-4'>

      {/* Logo */}
      <img src={Logo} alt="logo" className='h-12 w-32' />

      {/* Search */}
      {token && (
        <div className='flex items-center gap-2'>
          <input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="border rounded px-3 py-2 w-48 text-sm outline-none focus:border-cyan-400"
          />
          <MdSearch className='text-xl text-cyan-500' />
        </div>
      )}

      {/* Auth Section */}
      {token ? (
        <Profileinfo userinfo={userinfo} onLogout={onLogout} />
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-cyan-500 text-white px-4 py-2 rounded"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="border px-4 py-2 rounded"
          >
            Signup
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;