import React, { useState } from 'react';
import { FiChevronUp } from 'react-icons/fi';

const AnnouncementsCard = ({ darkMode, announcements = [] }) => { // Default to empty array
  const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default

  if (!announcements || announcements.length === 0) {
    return null; // Disappear if no announcements
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} transform transition-all duration-300 hover:shadow-xl mb-6`}>
      <div
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <h3 className="font-extrabold">Announcements</h3>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-300`}>
          <FiChevronUp className={`w-5 h-5 transition-transform duration-300 ${!isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <div className={`${!isExpanded ? 'max-h-0' : 'max-h-96'} overflow-hidden transition-max-height duration-500 ease-in-out`}>
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <ul className="space-y-3">
            {announcements.map((announcement, idx) => (
              <li key={idx} className="flex items-start"> {/* Use items-start for potentially multi-line text */}
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 mr-3 mt-1.5 flex-shrink-0"></div> {/* Different color for announcements */}
                <span className="text-sm">{announcement.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsCard;