import React from 'react';

const Footer = ({ darkMode }) => {
  const footerLinks = ['About', 'Privacy', 'Terms', 'Contact'];
  return (
    <footer className={`mt-12 py-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              booo.red
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>
              Community-curated content for the internet generation
            </p>
          </div>

          <div className="flex space-x-6">
            {footerLinks.map(link => (
              <a key={link} href="#" className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-pink-500 transition-colors`}>
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>© {new Date().getFullYear()} booo.red. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;