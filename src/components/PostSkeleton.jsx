import React from 'react';

const PostSkeleton = ({ darkMode }) => {
  return (
    <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="h-48 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
          <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
        </div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
              <div className="h-3 w-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
              <div className="h-3 w-6 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;