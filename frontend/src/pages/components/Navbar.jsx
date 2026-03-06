import React, { useState } from 'react'
import Logo from '../../assets/logo.png'
import Profileinfo from './cards/Profileinfo'
import { useNavigate } from 'react-router'
import { MdSearch } from 'react-icons/md'

const Navbar = ({ userinfo, searchTerm, onSearch }) => {
  const isToken = localStorage.getItem('token');
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className='bg-white flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 lg:px-10 py-3 gap-4 sm:gap-2'>
      <div className='flex-shrink-0'>
        <img src={Logo} alt="logo" className='h-12 sm:h-16 lg:h-19 w-24 sm:w-32 lg:w-40' />
      </div>
      {isToken && (
        <div className='flex-1 flex justify-center'>
          <div className='flex items-center gap-2'>
            <input
              type="text"
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="border rounded px-3 py-2 w-48 lg:w-64 text-sm outline-none focus:border-cyan-400"
            />
            <button className='p-2 text-cyan-500 hover:bg-cyan-50 rounded flex-shrink-0'>
              <MdSearch className='text-lg sm:text-xl' />
            </button>
          </div>
        </div>
      )}
      {isToken && <div className='flex-shrink-0'><Profileinfo userinfo={userinfo} onLogout={onLogout} /></div>}
    </div>
  );
}

export default Navbar