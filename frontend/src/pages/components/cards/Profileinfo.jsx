import React from 'react'
import { getinitials } from '../../../utils/helper'

const Profileinfo = ({userinfo ,onLogout}) => {
  return (
    userinfo &&(
      <div className='flex items-center gap-3'>
        <div className='w-12 h-12 flex justify-center items-center rounded-full text-slate-950 font-medium bg-slate-100'>
          {getinitials(userinfo ? userinfo.fullname : "")}
        </div>
        <div>
          <p className='text-sm font-medium'>{userinfo?.fullname || ""}</p>
          <button className='text-sm text-slate-700 underline'onClick={onLogout}>Logout</button>
        </div>
      </div>
    )
  )
};

export default Profileinfo