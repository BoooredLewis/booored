import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const VoteButtons = ({
  upvotes,
  downvotes,
  onUpvote,
  onDownvote,
  darkMode,
  size = 'default',
  itemId,
  itemType = 'item',
  uiUpvoted, // New prop
  uiDownvoted // New prop
}) => {
  const iconSizeClass = size === 'small' ? 'w-3 h-3' : 'w-4 h-4';
  const textSizeClass = 'text-xs';
  const buttonPaddingClass = size === 'small' ? 'p-0.5' : 'p-1';

  const baseButtonClassesUp = `flex items-center space-x-1 transition-all duration-150 ease-in-out transform focus:outline-none rounded-md ${buttonPaddingClass} active:-translate-y-0.5`;
  const baseButtonClassesDown = `flex items-center space-x-1 transition-all duration-150 ease-in-out transform focus:outline-none rounded-md ${buttonPaddingClass} active:translate-y-0.5`;
  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      <button
        onClick={onUpvote}
        className={`
          ${baseButtonClassesUp}
          ${uiUpvoted ? 'text-green-500' : (darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-500')}
          ${darkMode && uiUpvoted ? 'hover:bg-green-500/20' : (!darkMode && uiUpvoted ? 'hover:bg-green-500/10' : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'))}
        `}
        aria-pressed={uiUpvoted}
        aria-label={`Upvote ${itemType} ${itemId || ''}, current upvotes ${upvotes}`}
      >
        <FiArrowUp className={iconSizeClass} />
        <span className={`${textSizeClass} font-medium`}>{upvotes}</span>
      </button>
      <button
        onClick={onDownvote}
        className={`
          ${baseButtonClassesDown}
          ${uiDownvoted ? 'text-red-500' : (darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500')}
          ${darkMode && uiDownvoted ? 'hover:bg-red-500/20' : (!darkMode && uiDownvoted ? 'hover:bg-red-500/10' : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'))}
        `}
        aria-pressed={uiDownvoted}
        aria-label={`Downvote ${itemType} ${itemId || ''}, current downvotes ${downvotes}`}
      >
        <FiArrowDown className={iconSizeClass} />
        <span className={`${textSizeClass} font-medium`}>{downvotes}</span>
      </button>
    </div>
  );
};

export default VoteButtons;