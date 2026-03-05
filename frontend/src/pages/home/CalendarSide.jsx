import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import moment from 'moment';

const CalendarSide = ({ stories = [], onDateClick }) => {
  // build array of Date objects from visitedDate timestamps
  const storyDates = stories
    .map((s) => {
      if (s.visitedDate) {
        const d = new Date(s.visitedDate);
        return isNaN(d) ? null : d;
      }
      return null;
    })
    .filter(Boolean);

  const modifiers = {
    storyday: storyDates,
  };

  const modifiersClassNames = {
    storyday: 'bg-cyan-400 text-white rounded-full',
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <DayPicker
        mode="single"
        onSelect={(date) => {
          if (!date) return;
          // open first matching story for the clicked day
          const matched = stories.find((s) =>
            s.visitedDate &&
            moment(s.visitedDate).isSame(date, 'day')
          );
          if (matched && onDateClick) {
            onDateClick(matched);
          } else if (!matched && onDateClick) {
            // inform parent there were no stories
            onDateClick({ noStoryForDate: date });
          }
        }}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
      />
    </div>
  );
};

export default CalendarSide;
