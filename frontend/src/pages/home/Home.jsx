import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../utils/axiosinstancs';
import Travelstorycard from '../components/cards/Travelstorycard';
import { ToastContainer,toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import {MdAdd, MdSearch} from 'react-icons/md';
import Modal from "react-modal";
import Addedittravelstory from './Addedittravelstory';
import ViewTravelstory from './ViewTravelstory';
import CalendarSide from './CalendarSide';

const Home = () => {
  const navigate = useNavigate();
  const [userinfo, setUserinfo] = useState(null);
  const [allStories,setAllStories]=useState([]);
  // search term entered by user
  const [searchTerm, setSearchTerm] = useState('');
  // optional message to show when calendar date has no stories
  const [calendarMessage, setCalendarMessage] = useState('');

  const [openAddeditmodel,setOpenAddeditmodel]=useState({
    isShown:false,
    type:"add",
    data:null,
  });
  const[openViewmodel,setOpenViewmodel]=useState({
    isShown:false,
    data:null,
  })
  const getUserInfo = async () => {
    try{
      const response = await axiosInstance.get('/get-user');
      if(response.data && response.data.user){
        setUserinfo(response.data.user);
      }
    }
    catch(err){
      if(err.response && err.response.status === 401){
        // token expired or invalid, redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      } 
    }
  };
  const getAllstories=async()=>{
    try{
      const response = await axiosInstance.get('/get-travel-stories');
      if(response.data && response.data.stories){
        setAllStories(response.data.stories)
      }
    }catch(err){
      console.log("an unexpected error occured try again")
    }
  };
  const handleEdit=(data)=>{
    setOpenAddeditmodel({isShown:true,type:"edit",data:data});
  }

 
  const handleViewstory=(data)=>{
    if (data && data.noStoryForDate) {
      setCalendarMessage(
        `No stories available on ${moment(data.noStoryForDate).format('Do MMM YYYY')}`
      );
      return;
    }
   
    setCalendarMessage('');
    setOpenViewmodel({isShown:true,data});
  };

  const updateIsfavourite = async (story) => {
    try {
      const response = await axiosInstance.put(
        `/isfavourite/${story._id}`,
        { isFavourite: !story.isFavourite }
      );
      if (response.data && response.data.story) {
      
        setAllStories((prev) =>
          prev.map((s) =>
            s._id === story._id ? response.data.story : s
          )
        );
      }
    } catch (err) {
      console.error('Failed to update favourite status', err);
      toast.error('Could not update favourite status');
    }
  };

  const handleDeleteStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete(`/delete-travel-story/${storyId}`);
      if (response.data) {
        toast.success("Story deleted successfully");
        getAllstories();
        setOpenViewmodel({ isShown: false, data: null });
      }
    } catch (error) {
      console.error("Failed to delete story", error);
      toast.error("Failed to delete story");
    }
  };


  useEffect(() => {
    getAllstories();
    getUserInfo();
  }, []);

 
  const filteredStories = allStories.filter((item) => {
    const t = searchTerm.toLowerCase();
    
    const title = item.title ? String(item.title).toLowerCase() : "";
    const storyText = item.story ? String(item.story).toLowerCase() : "";
    const location = item.visitedLocation ? String(item.visitedLocation).toLowerCase() : "";
    return (
      title.includes(t) ||
      storyText.includes(t) ||
      location.includes(t)
    );
  });

  return (
    <>
      <Navbar userinfo={userinfo} searchTerm={searchTerm} onSearch={setSearchTerm} />

        <div className='container mx-auto px-4 py-8'>
            <div className='flex flex-col lg:flex-row gap-7'>

    
              <div className='flex-1'>

                {calendarMessage && (
                    <div className='text-center text-sm text-red-500 mb-4'>
                      {calendarMessage}
                    </div>
                )}

                {filteredStories.length > 0 ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
                    {filteredStories.map((item) => {
                      return (
                      <Travelstorycard
                        key={item._id}
                        imgUrl={item.imageUrl}
                        title={item.title}
                        story={item.story}
                        date={item.visitedDate}
                        visitedLocation={item.visitedLocation}
                        isFavourite={item.isFavourite}
                        onClick={() => handleViewstory(item)}
                        onFavouriteclick={() => updateIsfavourite(item)}
                      />
                      );
                    })}
                  </div>
                ) : (
                  <div className='text-center text-gray-500 py-8'>
                    {searchTerm
                      ? 'No stories found matching your search'
                      : 'No stories yet – add one using the + button'}
                  </div>
                )}
              </div>

              {/* Calendar Sidebar */}
              <div className='w-full lg:w-[320px]'>
                  <CalendarSide stories={allStories} onDateClick={handleViewstory} />
              </div>

            </div>
        </div>

        <ToastContainer />

        {/* Add/Edit Modal */}
        <Modal
          isOpen={openAddeditmodel.isShown}
          onRequestClose={() => {}}
          style={{
            overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            zIndex: 999,
            },
          }}
          appElement={document.getElementById('root')}
          className='w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[40%] h-[85vh] bg-white rounded-lg mx-auto mt-10 p-5 overflow-y-scroll scrollbar z-50'
        >
          <Addedittravelstory
            type={openAddeditmodel.type}
            storyinfo={openAddeditmodel.data}
            onClose={() => {
              setOpenAddeditmodel({ isShown: false, type: "add", data: null });
            }}
            getAllstories={getAllstories}
          />
        </Modal>

        {/* View Story Modal */}
        <Modal
          isOpen={openViewmodel.isShown}
           onRequestClose={() => {}}
          style={{
           overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
          zIndex: 999,
            },
          }}
          appElement={document.getElementById('root')}
          className='w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[40%] h-[85vh] bg-white rounded-lg mx-auto mt-10 p-5 overflow-y-scroll scrollbar z-50'
        >
        <ViewTravelstory
          storyinfo={openViewmodel.data || null}
          onClose={() => {
          setOpenViewmodel((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
           setOpenViewmodel((prevState) => ({ ...prevState, isShown: false }));
          handleEdit(openViewmodel.data || null);
            }}
          onDeleteClick={() => {
          if (window.confirm("Are you sure you want to delete this story?")) {
            handleDeleteStory(openViewmodel.data);
          }
        }}
      />
      </Modal>

      {/* Floating Add Button */}
      <button
        className='w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-cyan-400 fixed right-6 bottom-6 sm:right-10 sm:bottom-10 shadow-lg'
        onClick={() => {
           setOpenAddeditmodel({ isShown: true, type: "add", data: null });
        }}
      >
      <MdAdd className='text-[28px] sm:text-[32px] text-white' />
    </button>
  </>
  )
}

export default Home