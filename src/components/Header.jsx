import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const Header = ({ darkMode, setDarkMode, activeTab, setActiveTab, onShowSubmitModal, tabConfig }) => {
  return (
    <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            booo.red
          </h1>
          <nav className="hidden md:flex space-x-6">
            {tabConfig.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 transition-colors ${activeTab === tab.id ? 'text-pink-500 border-b-2 border-pink-500' : `${darkMode ? 'text-gray-300' : 'text-gray-600'} hover:text-pink-500`} hover:scale-105 active:scale-95`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
          </button>
          <button className={`px-4 py-1 rounded-full border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 ${darkMode ? 'text-pink-400 border-pink-400 hover:text-white' : ''}`}>
            Login
          </button>
          <button className="px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition-all transform hover:scale-105 active:scale-95">
            Register
          </button>
          <button
            onClick={onShowSubmitModal}
            className="hidden md:block px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-md"
          >
            Submit
          </button>
          <button className="md:hidden p-2" aria-label="Open menu"> {/* This could trigger a mobile menu drawer later */}
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;