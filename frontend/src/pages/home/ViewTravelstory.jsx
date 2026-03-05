import moment from 'moment'
import React from 'react'
import { GrMapLocation } from 'react-icons/gr'
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'

const ViewTravelstory = ({storyinfo,onClose,onEditClick,onDeleteClick}) => {
  if (!storyinfo) {
    return <div className='text-center p-4'>Story not found or deleted.</div>;
  }
  return (
    <div className='relative'>
        <div className='flex items-center justify-end'>
            <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                <button className='flex items-center gap-1 text-xs font-medium bg-cyan-200 text-primary shadow-cyan-100/0 border border-cyan-100 hover:bg-cyan-400 hover:text-white  rouded px-3 py-[3px]' onClick={onEditClick}>
                    <MdUpdate className='text-lg'/>UPDATE STORY
                </button>
                <button className='flex items-center gap-1 text-xs font-medium bg-red-200 text-primary shadow-cyan-100/0 border border-cyan-100 hover:bg-red-400 hover:text-white  rouded px-3 py-[3px]' onClick={onDeleteClick}>
                    <MdDeleteOutline className='text-lg'/>DELETE STORY
                </button>  
                <button className='' onClick={onClose}>
                    <MdClose className='text-xl text-slate-400'/>
                </button>
            </div>
        </div>
        <div>
            <div className='flex-1 flex flex-col gap-2 py-4'>
                <h1 className='text-2xl text-slate-950'> {storyinfo?.title}</h1>
                <div className='flex items-center justify-between gap-3'>
                    <span className='text-xs text-slate-500'>{storyinfo?.visitedDate && moment(storyinfo.visitedDate).format('Do MMM YYYY')}</span>
                </div>
                <div className='inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1'>
                    <GrMapLocation className='text-sm'/>
                    {storyinfo?.visitedLocation && Array.isArray(storyinfo.visitedLocation) && storyinfo.visitedLocation.map((item,index)=>storyinfo.visitedLocation.length==index+1 ? `${item}`:`${item}, `)}
                </div>
            </div>    
            <img src={storyinfo?.imageUrl} alt='Selector' className='w-full h-full object-cover rounded-lg'/>
            <div className='mt-4'>
                <p className='text-sm text-slate-950 leading-6 text-justify whitespace-pre-line'>{storyinfo?.story}</p>
            </div>
        </div>
    </div>
  )
}

export default ViewTravelstory