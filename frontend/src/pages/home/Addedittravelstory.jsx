import React, { useState, useEffect } from 'react'
import { MdAdd, MdClose, MdUpdate } from 'react-icons/md'
import DateSelector from '../components/cards/DateSelector'
import ImageSelector from '../components/cards/ImageSelector'
import TagInput from '../components/cards/TagInput'
import axios from 'axios'
import axiosInstance from '../../utils/axiosinstancs';
import moment from 'moment'
import uploadImage from '../../utils/uploadImage'
import { toast } from 'react-toastify'

const Addedittravelstory = ({
    storyinfo,
    type,
    onClose,
    getAllstories,
}) => {
    const [title,setTitle]=useState("");
    const [storyimg,setStoryImg]=useState(null);
    const [story,setStory]=useState("");
    const [visitedLocation,setVisitedlocation]=useState([]);
    const [visitedDate,setVisitedDate]=useState(null);
    const [error,setError]=useState("");

    // populate form fields when editing an existing story
    useEffect(() => {
        if (storyinfo && type === 'edit') {
            setTitle(storyinfo.title || "");
            setStory(storyinfo.story || "");
            setStoryImg(storyinfo.imageUrl || null);
            setVisitedlocation(storyinfo.visitedLocation || []);
            // visitedDate is stored as timestamp, so parse it back to Date
            setVisitedDate(storyinfo.visitedDate ? new Date(storyinfo.visitedDate) : null);
        }
    }, [storyinfo, type]);

    const addNewtravelstory = async () => {
        try {
            // validate required fields client-side so we don't send doomed request
            if (!title || !story) {
                throw new Error('Title and story are required');
            }
            if (visitedLocation.length === 0) {
                throw new Error('Please add at least one visited location');
            }

            let imageUrl = "";
            if (storyimg) {
                const imgUploadRes = await uploadImage(storyimg);
                imageUrl = imgUploadRes.imageUrl || "";
            }

            // the backend treats empty string as missing, so send a placeholder
            if (!imageUrl) {
                imageUrl = 'http://localhost:8000/assets/ts.jpeg';
            }

            const response = await axiosInstance.post('/add-travel-story', {
                title,
                story,
                imageUrl,
                visitedLocation,
                visitedDate: visitedDate
                    ? moment(visitedDate).valueOf()
                    : moment().valueOf(),
            });

            if (response.data && response.data.story) {
                toast.success("Story added successfully");
                getAllstories();
                onClose();
            }
        } catch (error) {
            console.error('Failed to add story', error);
            const msg =
                error?.response?.data?.message || error.message ||
                'Failed to add story';
            toast.error(msg);
        }
    }
    const updateTravelstory = async () => {
        try {
            if (!title || !story) {
                throw new Error('Title and story are required');
            }
            if (visitedLocation.length === 0) {
                throw new Error('Please add at least one visited location');
            }

            let imageUrl = storyimg;
            // if storyimg is a File object (newly uploaded), upload it; otherwise use the URL string
            if (storyimg instanceof File) {
                const imgUploadRes = await uploadImage(storyimg);
                imageUrl = imgUploadRes.imageUrl || "";
            }

            if (!imageUrl) {
                imageUrl = 'http://localhost:8000/assets/ts.jpeg';
            }

            const response = await axiosInstance.put(`/edit-travel-story/${storyinfo._id}`, {
                title,
                story,
                imageUrl,
                visitedLocation,
                visitedDate: visitedDate
                    ? moment(visitedDate).valueOf()
                    : moment().valueOf(),
            });

            if (response.data && response.data.story) {
                toast.success("Story updated successfully");
                getAllstories();
                onClose();
            }
        } catch (error) {
            console.error('Failed to update story', error);
            const msg =
                error?.response?.data?.message || error.message ||
                'Failed to update story';
            toast.error(msg);
        }
    }
    

    const handleAddorUpdateClick=()=>{
        console.log('input data:',{title,storyimg,story,visitedLocation,visitedDate})
        if(!title){
            setError("please enter the title")
            return;
        }  
        if(!story){
            setError("please enter the story")
            return;
        } 
        setError('');
        if(type==='edit'){
            updateTravelstory();
        }else{
            addNewtravelstory();
        }
    }
    const handleDeletestoryimage = async () => {
        try {
            
            if (storyimg instanceof File) {
                setStoryImg(null);
                return;
            }

            // otherwise it's a URL string; delete it from the backend
            if (storyimg && typeof storyimg === 'string') {
                await axiosInstance.delete('/delettoriese-image', {
                    params: { imageUrl: storyimg }
                });
                toast.success("Image deleted");
            }

            setStoryImg(null);
        } catch (error) {
            console.error('Failed to delete image', error);
            toast.error('Failed to delete image');
        }
    };
  return (
    <div>
        <div className='flex items-center justify-between'>
            <h5 className='text-xl font-medium text-slate-700'>
                {type==='add'?'add Story':'update Story'}
            </h5>
            <div>
                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    {type ==='add'? (
                        <button className='flex items-center gap-1 text-xs font-medium bg-cyan-200 text-primary shadow-cyan-100/0 border border-cyan-100 hover:bg-cyan-400 hover:text-white  rouded px-3 py-[3px]' onClick={handleAddorUpdateClick}>
                            <MdAdd className='text-lg'/>ADD STORY
                        </button> 
                    ):(
                        <>
                            <button className='flex items-center gap-1 text-xs font-medium bg-cyan-200 text-primary shadow-cyan-100/0 border border-cyan-100 hover:bg-cyan-400 hover:text-white  rouded px-3 py-[3px]' onClick={handleAddorUpdateClick}>
                                <MdUpdate className='text-lg'/>UPDATE STORY
                            </button>  
                        </>
                    )}
                    <button className='' onClick={onClose}>
                        <MdClose className='text-xl text-slate-400'/>
                    </button>
                </div>
                {error && (
                    <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
                )}
            </div>
        </div>
        <div>
            <div className='flex-1 flex flex-col gap-2 pt-4'>
                <label className='input-label'>TITLE</label>
                <input type='text' className='text-2xl text-slate-950 outline-none border-b'
                 placeholder='A DAY AT THE TAJMAHAL'
                 value={title}
                 onChange={({target})=>setTitle(target.value)}
                />
            </div>
            <div className='my-3'>
                <DateSelector date={visitedDate} setDate={setVisitedDate}/>
            </div>
            <ImageSelector image={storyimg} setImage={setStoryImg} handleDeleteimage={handleDeletestoryimage}/>
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>STORY</label>
                <textarea
                 type='text'
                 className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                 placeholder='your story'
                 rows={10}
                 value={story}
                 onChange={({target})=>setStory(target.value)}
                />
            </div>
            <div className='pt-3'>
                <label>VISITED LOCATION</label>
                <TagInput tags={visitedLocation} setTags={setVisitedlocation}/>
            </div>
        </div>
    </div>
  )
}

export default Addedittravelstory