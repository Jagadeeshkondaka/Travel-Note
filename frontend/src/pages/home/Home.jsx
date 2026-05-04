import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstancs';
import Travelstorycard from '../components/cards/Travelstorycard';
import { ToastContainer, toast } from 'react-toastify';
import { MdAdd } from 'react-icons/md';
import Modal from "react-modal";
import Addedittravelstory from './Addedittravelstory';
import ViewTravelstory from './ViewTravelstory';
import CalendarSide from './CalendarSide';
import moment from 'moment';

const Home = () => {
  const navigate = useNavigate();

  const [userinfo, setUserinfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ NEW

  const [openAddeditmodel, setOpenAddeditmodel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewmodel, setOpenViewmodel] = useState({
    isShown: false,
    data: null,
  });

  // ✅ GET USER
  const getUserInfo = async () => {
    try {
      const res = await axiosInstance.get('/get-user');
      setUserinfo(res.data.user);
    } catch (err) {
      console.error("USER ERROR:", err.response || err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  // ✅ GET STORIES
  const getAllstories = async () => {
    try {
      const res = await axiosInstance.get('/get-travel-stories');
      setAllStories(res.data.stories || []);
    } catch (err) {
      console.error("STORY ERROR:", err.response || err);
      toast.error("Backend not responding");
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await Promise.all([
        getUserInfo(),
        getAllstories()
      ]);

      setLoading(false); // ✅ stop loading
    };

    init();
  }, []);

  // ✅ LOADING UI (DOES NOT BLOCK APP)
  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  return (
    <>
      <Navbar userinfo={userinfo} />

      <div className="container mx-auto p-6">
        {allStories.length === 0 ? (
          <p className="text-center text-gray-500">
            No stories yet
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {allStories.map((item) => (
              <Travelstorycard
                key={item._id}
                imgUrl={item.imageUrl}
                title={item.title}
                story={item.story}
                date={item.visitedDate}
                visitedLocation={item.visitedLocation}
                isFavourite={item.isFavourite}
              />
            ))}
          </div>
        )}
      </div>

      <ToastContainer />

      {/* ADD BUTTON */}
      <button
        className="fixed bottom-10 right-10 w-16 h-16 bg-cyan-400 rounded-full"
        onClick={() =>
          setOpenAddeditmodel({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-white text-3xl mx-auto" />
      </button>
    </>
  );
};

export default Home;