import React, { useState, useEffect } from 'react';
import { MdAdd, MdClose, MdUpdate } from 'react-icons/md';
import DateSelector from '../components/cards/DateSelector';
import ImageSelector from '../components/cards/ImageSelector';
import TagInput from '../components/cards/TagInput';
import axiosInstance from '../../utils/axiosinstancs';
import moment from 'moment';
import uploadImage from '../../utils/uploadImage';
import { toast } from 'react-toastify';

const Addedittravelstory = ({
  storyinfo,
  type,
  onClose,
  getAllstories,
}) => {
  const [title, setTitle] = useState("");
  const [storyimg, setStoryImg] = useState(null);
  const [story, setStory] = useState("");
  const [visitedLocation, setVisitedlocation] = useState([]);
  const [visitedDate, setVisitedDate] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (storyinfo && type === 'edit') {
      setTitle(storyinfo.title || "");
      setStory(storyinfo.story || "");
      setStoryImg(storyinfo.imageUrl || null);
      setVisitedlocation(storyinfo.visitedLocation || []);
      setVisitedDate(
        storyinfo.visitedDate ? new Date(storyinfo.visitedDate) : null
      );
    }
  }, [storyinfo, type]);

  // ✅ ADD STORY
  const addNewtravelstory = async () => {
    try {
      if (!title || !story) {
        throw new Error('Title and story are required');
      }
      if (visitedLocation.length === 0) {
        throw new Error('Please add at least one visited location');
      }

      let imageUrl = "";

      // ✅ SAFE IMAGE UPLOAD
      if (storyimg) {
        try {
          const imgUploadRes = await uploadImage(storyimg);
          imageUrl = imgUploadRes?.imageUrl || "";
        } catch (err) {
          console.log("Image upload failed, continuing without image");
        }
      }
      imageUrl = imageUrl || "https://via.placeholder.com/400";
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
      console.error("Failed to add story", error?.response || error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to add story";
      toast.error(msg);
    }
  };

  // ✅ UPDATE STORY
  const updateTravelstory = async () => {
    try {
      if (!title || !story) {
        throw new Error('Title and story are required');
      }
      if (visitedLocation.length === 0) {
        throw new Error('Please add at least one visited location');
      }

      let imageUrl = storyimg;

      if (storyimg instanceof File) {
        try {
          const imgUploadRes = await uploadImage(storyimg);
          imageUrl = imgUploadRes?.imageUrl || "";
        } catch (err) {
          console.log("Image upload failed, keeping old image");
        }
      }

      const response = await axiosInstance.put(
        `/edit-travel-story/${storyinfo._id}`,
        {
          title,
          story,
          imageUrl,
          visitedLocation,
          visitedDate: visitedDate
            ? moment(visitedDate).valueOf()
            : moment().valueOf(),
        }
      );

      if (response.data && response.data.story) {
        toast.success("Story updated successfully");
        getAllstories();
        onClose();
      }
    } catch (error) {
      console.error("Failed to update story", error?.response || error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to update story";
      toast.error(msg);
    }
  };

  const handleAddorUpdateClick = () => {
    console.log("input data:", {
      title,
      storyimg,
      story,
      visitedLocation,
      visitedDate,
    });

    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!story) {
      setError("Please enter the story");
      return;
    }

    setError("");

    if (type === "edit") {
      updateTravelstory();
    } else {
      addNewtravelstory();
    }
  };

  const handleDeletestoryimage = async () => {
    try {
      if (storyimg instanceof File) {
        setStoryImg(null);
        return;
      }

      if (storyimg && typeof storyimg === "string") {
        await axiosInstance.delete('/delettoriese-image', {
          params: { imageUrl: storyimg },
        });
        toast.success("Image deleted");
      }

      setStoryImg(null);
    } catch (error) {
      console.error("Failed to delete image", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>

        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-lg">
            <button
              className="flex items-center gap-1 text-xs font-medium bg-cyan-200 border hover:bg-cyan-400 hover:text-white px-3 py-1"
              onClick={handleAddorUpdateClick}
            >
              {type === "add" ? <MdAdd /> : <MdUpdate />}
              {type === "add" ? "ADD STORY" : "UPDATE STORY"}
            </button>

            <button onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-2 pt-4">
          <label>TITLE</label>
          <input
            type="text"
            className="text-xl border-b outline-none"
            placeholder="A DAY AT THE TAJMAHAL"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="my-3">
          <DateSelector date={visitedDate} setDate={setVisitedDate} />
        </div>

        <ImageSelector
          image={storyimg}
          setImage={setStoryImg}
          handleDeleteimage={handleDeletestoryimage}
        />

        <div className="flex flex-col gap-2 mt-4">
          <label>STORY</label>
          <textarea
            className="text-sm bg-slate-50 p-2 rounded"
            rows={8}
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
        </div>

        <div className="pt-3">
          <label>VISITED LOCATION</label>
          <TagInput tags={visitedLocation} setTags={setVisitedlocation} />
        </div>
      </div>
    </div>
  );
};

export default Addedittravelstory;