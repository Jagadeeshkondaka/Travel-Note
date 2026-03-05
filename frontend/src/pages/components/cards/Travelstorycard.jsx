import React from 'react';
import moment from 'moment/moment';
import { FaHeart } from 'react-icons/fa6';
import { GrMapLocation } from 'react-icons/gr';

const Travelstorycard = ({
  imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteclick,
  onClick,
}) => {
  // fallback used in multiple places
  const placeholderImage = 'https://via.placeholder.com/400';

  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
      <img
        src={imgUrl || placeholderImage}
        alt={title}
        className="w-full h-56 object-cover rounded-lg"
        onClick={onClick}
        onError={(e) => {
          // if the url fails to load, switch to the placeholder
          e.currentTarget.src = placeholderImage;
        }}
      />
      <button
        className="w-12 h-12 flex items-center justify-center bg-slate-300 rounded-lg border border-black absolute top-4 right-4"
        onClick={(e)=>{
          e.stopPropagation();
          onFavouriteclick();
        }}
      >
        <FaHeart
          className={`text-[22px] cursor-pointer hover:text-red-500 ${
            isFavourite ? 'text-red-500' : 'text-white'
          }`}
        />
      </button>
      <div className="p-4" onClick={onClick}>
        <h6 className="text-sm font-medium ">{title}</h6>
        <span className="text-xs text-slate-500">
          {date ? moment(date).format('Do MMM YYYY') : '-'}
        </span>
        <p className="text-xs text-slate-600 mt-2">{story?.slice(0, 60)}</p>
        {Array.isArray(visitedLocation) && visitedLocation.length > 0 && (
          <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
            <GrMapLocation className="text-sm" />
            {visitedLocation.map((loc, i) =>
              i === visitedLocation.length - 1 ? loc : `${loc}, `
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Travelstorycard;