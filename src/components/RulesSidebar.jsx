import React, { useState } from 'react';
import { FiChevronUp } from 'react-icons/fi'; // Only FiChevronUp needed here

const RulesSidebar = ({ darkMode }) => {
  const [showRules, setShowRules] = useState(true); // Local state for this component

  const rules = [
    { text: 'Be respectful to others' },
    { text: 'No spam or self-promotion' },
    { text: 'Stay on topic' },
    { text: 'Report inappropriate content' }
  ];

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} transform transition-all duration-300 hover:shadow-xl`}>
      <div
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setShowRules(!showRules)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setShowRules(!showRules)}
        aria-expanded={showRules} // For accessibility
      >
        <h3 className="font-extrabold">Basic Rules & Announcements</h3>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-300`}>
          <FiChevronUp className={`w-5 h-5 transition-transform duration-300 ${!showRules ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <div className={`${!showRules ? 'max-h-0' : 'max-h-96'} overflow-hidden transition-max-height duration-500 ease-in-out`}>
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <ul className="space-y-3">
            {rules.map((rule, idx) => (
              <li key={idx} className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 mr-3 flex-shrink-0"></div>
                <span className="text-sm">{rule.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RulesSidebar;