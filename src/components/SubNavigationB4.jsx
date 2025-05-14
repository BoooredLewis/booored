import React from 'react';

const SubNavigationB4 = ({ darkMode, subTab, setSubTab, subTabConfig }) => {
  return (
    <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex space-x-4 pb-2 overflow-x-auto custom-scrollbar">
          {subTabConfig.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`whitespace-nowrap py-3 px-2 transition-colors text-sm ${subTab === tab.id ? 'text-pink-500 border-b-2 border-pink-500 font-semibold' : `${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-pink-500`}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubNavigationB4;