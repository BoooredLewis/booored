import React from 'react';

const MobileNav = ({ darkMode, activeTab, setActiveTab, tabConfig }) => {
  return (
    <div className="md:hidden">
      <nav className={`shadow-inner ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
        <div className="container mx-auto px-4 py-2 flex space-x-4 overflow-x-auto custom-scrollbar">
          {tabConfig.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${activeTab === tab.id ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : `${darkMode ? 'border border-pink-500 text-pink-400 hover:bg-pink-900 hover:text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileNav;