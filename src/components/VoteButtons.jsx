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
  itemType = 'item'
}) => {
  const iconSizeClass = size === 'small' ? 'w-3 h-3' : 'w-4 h-4';
  const textSizeClass = 'text-xs'; // Consistent text size
  const buttonPaddingClass = size === 'small' ? 'p-0.5' : 'p-1';

  // Base classes for the button, including transitions
  const baseButtonClasses = `
    flex items-center space-x-1 
    transition-all duration-150 ease-in-out 
    transform 
    focus:outline-none 
    rounded-md 
    ${buttonPaddingClass}
  `;

  // Active state for the "jump" animation
  // You can play with these values:
  // active:scale-90 (press in)
  // active:scale-110 active:-translate-y-0.5 (jump up)
  const activeAnimationClassesUp = "active:scale-110 active:-translate-y-0.5"; // Slight press-in effect
  const activeAnimationClassesDown = "active:scale-110 active:translate-y-0.5"
  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      <button
        onClick={onUpvote}
        className={`
          ${baseButtonClasses}
          text-green-500 
          hover:text-green-600 
          ${darkMode ? 'hover:bg-green-500/10' : 'hover:bg-green-500/10'}
          ${activeAnimationClassesUp}
        `}
        aria-label={`Upvote ${itemType} ${itemId || ''}, current upvotes ${upvotes}`}
      >
        <FiArrowUp className={iconSizeClass} />
        <span className={`${textSizeClass} font-medium`}>{upvotes}</span>
      </button>
      <button
        onClick={onDownvote}
        className={`
          ${baseButtonClasses}
          text-red-500 
          hover:text-red-600 
          ${darkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-500/10'}
          ${activeAnimationClassesDown}
        `}
        aria-label={`Downvote ${itemType} ${itemId || ''}, current downvotes ${downvotes}`}
      >
        <FiArrowDown className={iconSizeClass} />
        <span className={`${textSizeClass} font-medium`}>{downvotes}</span>
      </button>
    </div>
  );
};

export default VoteButtons;