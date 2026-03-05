import React, { useEffect, useRef, useState } from 'react'
import { FaRegFileImage } from 'react-icons/fa6';
import { MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({image,setImage,handleDeleteimage}) => {
    const inputRef =useRef(null);
    const [previewUrl,setPreviewUrl]=useState(null);
    const handleImageChange=(event)=>{
        // `files` is a FileList, not a function
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    const onChooseFile =()=>{
        inputRef.current.click();

    };
    const handleRemoveimage=()=>{
        setImage(null);
        handleDeleteimage();
    }
    useEffect(() => {
        // generate a new object URL only when the file changes, and
        // make sure to revoke the previous one to avoid memory leaks.
        let objectUrl;
        if (typeof image === 'string') {
            setPreviewUrl(image);
        } else if (image) {
            objectUrl = URL.createObjectURL(image);
            setPreviewUrl(objectUrl);
        } else {
            setPreviewUrl(null);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [image]);
  return (
    <div>
        <input
         type='file'
         accept='image/*'
         ref={inputRef}
         onChange={handleImageChange}
         className='hidden'
        />
        {!image ? ( 
         <button 
            className='w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border  border-slate-200/50' 
            onClick={()=>onChooseFile()}
         >
            <div className='w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100'>
                <FaRegFileImage className='text-xl text-cyan-500'/>
            </div>
            <p className='text-sm text-slate-500'>Browse image file to upload</p>
         </button>
        ) : (
         <div className='w-full relative'>
            <img
               src={previewUrl}
               alt='selected'
               className='w-full h-[300px] object-cover rounded-lg'
            />
            <button
                className='absolute top-2 right-2 bg-red-300 hover:bg-red-400 text-white rounded p-1'
                onClick={handleRemoveimage}
            >
                <MdDeleteOutline size={20} />
            </button>
         </div>
        )}
    </div>
  );
};

export default ImageSelector