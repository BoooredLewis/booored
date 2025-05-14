import React, { useState, useEffect, useRef } from 'react';
import {
  FiHeart,     // For Favorite
  FiMessageCircle,
  FiShare,
  FiFlag,      // For Report
  FiSlash,     // For Block
  FiMaximize2, // For expand icon on folded card
  FiMinimize2  // For collapse icon on expanded card (alternative to chevron)
} from 'react-icons/fi';
import CommentSection from './CommentSection';
import VoteButtons from './VoteButtons'; // Using our existing vote buttons

const PostCard = ({
  post, // Expects: id, title?, content, imageSrcList, user, timeAgo, upvotes, downvotes, comments, category
  darkMode,
  // Props from App.jsx for actual state management (to be added/used later)
  // onUpvotePost,
  // onDownvotePost,
  // onToggleFavoritePost,
  // onReportPost,
  // onBlockUser,
  // onPostComment,
  // onToggleCommentsSection, // Prop to manage comment section visibility from App
  // isCommentsSectionExpanded, // Prop from App
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // Card expanded by default for now, can be changed
  const [isFavorited, setIsFavorited] = useState(false); // Local state for favorite
  const [showComments, setShowComments] = useState(false); // Local state for comments visibility

  // Local UI state for votes, to provide immediate feedback.
  // These should ideally be synced with parent state if counts come from parent.
  const [uiUpvoted, setUiUpvoted] = useState(false);
  const [uiDownvoted, setUiDownvoted] = useState(false);

  const cardRef = useRef(null);

  const actionButtonBaseClasses = "flex items-center space-x-1.5 p-1.5 rounded-md transition-all duration-150 ease-in-out transform focus:outline-none active:-translate-y-0.5";
  const iconOnlyButtonClasses = `p-1.5 rounded-full transition-all duration-150 ease-in-out transform focus:outline-none active:-translate-y-0.5 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`;


  const toggleCardExpansion = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) { // If collapsing, also hide comments
        setShowComments(false);
    }
  };

  // --- Action Handlers (will call props passed from App.jsx eventually) ---
  const handleUpvote = (e) => {
    e.stopPropagation();
    // onUpvotePost(post.id); // Call parent handler
    setUiUpvoted(prev => !prev);
    if (uiDownvoted) setUiDownvoted(false);
    console.log('Upvoted post:', post.id);
  };

  const handleDownvote = (e) => {
    e.stopPropagation();
    // onDownvotePost(post.id); // Call parent handler
    setUiDownvoted(prev => !prev);
    if (uiUpvoted) setUiUpvoted(false);
    console.log('Downvoted post:', post.id);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    // onToggleFavoritePost(post.id, !isFavorited); // Call parent handler
    setIsFavorited(!isFavorited);
    console.log('Toggled favorite for post:', post.id);
  };

  const handleToggleComments = (e) => {
    e.stopPropagation();
    if (!isExpanded) setIsExpanded(true); // Expand card if comments are toggled
    setShowComments(!showComments);
    // onToggleCommentsSection(post.id); // Use this if comment state managed by App
    console.log('Toggled comments for post:', post.id);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    console.log('Share post:', post.id);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    // onReportPost(post.id);
    console.log('Report post:', post.id);
  };

  const handleBlock = (e) => {
    e.stopPropagation();
    // onBlockUser(post.user);
    console.log('Block user:', post.user);
  };


  // --- Image Gallery Rendering ---
  const renderImageGallery = () => {
    if (!post.imageSrcList || post.imageSrcList.length === 0) return null;

    const count = post.imageSrcList.length;
    let gridClasses = "grid gap-1"; // Use gap-1 for very thin lines

    if (count === 1) gridClasses += " grid-cols-1";
    else if (count === 2) gridClasses += " grid-cols-2";
    else gridClasses += " grid-cols-2 sm:grid-cols-3"; // 2 cols on small, 3 on sm+

    // Max height for the gallery container to prevent overly tall galleries
    const galleryMaxHeight = count > 1 ? 'max-h-[400px] sm:max-h-[500px]' : 'max-h-[600px]';


    return (
      <div className={`mb-3 overflow-hidden rounded-md ${galleryMaxHeight} ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className={gridClasses}>
          {post.imageSrcList.slice(0, count > 4 ? 3 : count).map((src, idx) => ( // Show max 3-4 images initially if many
            <div
              key={idx}
              className={`relative w-full 
                ${count === 1 ? 'aspect-[16/9]' : ''} 
                ${count === 2 ? 'aspect-square' : ''} 
                ${count >= 3 && (idx === 0 && count % 3 === 1) ? 'sm:col-span-3 aspect-[16/9]' : ''} // If 4 images, first is full width on 3-col
                ${count >= 3 && (idx === 0 && count % 3 === 2) ? 'sm:col-span-1 aspect-square' : ''} 
                ${count >= 3 ? 'aspect-square' : ''} 
                group cursor-zoom-in`} // Added group for potential overlay
                onClick={(e) => {e.stopPropagation(); console.log("View image:", src)}} // Placeholder for image viewer
            >
              <img
                src={src}
                alt={`${post.title || 'Post Image'} ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {count > 4 && idx === (count > 4 ? 2 : count -1 ) && ( // Logic for +more images overlay
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold">
                   +{post.imageSrcList.length - (count > 4 ? 3 : count)}
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };


  // --- Folded Card View ---
  if (!isExpanded) {
    return (
      <div
        className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 cursor-pointer mb-4 p-3 flex justify-between items-center ${darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"}`}
        onClick={toggleCardExpansion}
        ref={cardRef}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleCardExpansion()}
        aria-expanded="false"
        aria-label={`Expand post by @${post.user}${post.title ? `: ${post.title}` : ''}`}
      >
        <div className="flex items-center space-x-2">
            <span className={`inline-block w-5 h-5 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></span> {/* Simple avatar placeholder */}
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Post by @{post.user} {post.title && `- "${post.title.substring(0,30)}${post.title.length > 30 ? '...' : ''}"`}
            </span>
        </div>
        <FiMaximize2 className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    );
  }

  // --- Expanded Card View ---
  return (
    <div
      className={`rounded-lg shadow-md overflow-hidden transition-all duration-300 mb-4 ${darkMode ? "bg-gray-850" : "bg-white"} hover:shadow-lg`} // Darker bg for expanded card
      ref={cardRef}
      // onClick={toggleCardExpansion} // Clicking body of expanded card might not be desired to collapse it, only header action
    >
      {/* Header: User Info, Time, Actions (Report, Block, Collapse) */}
      <div className={`p-3 flex justify-between items-start border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></span> {/* Avatar placeholder */}
          <div>
            <span className={`block text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>@{post.user}</span>
            <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{post.timeAgo}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={handleReport} title="Report Post" className={iconOnlyButtonClasses} aria-label="Report this post">
            <FiFlag className="w-4 h-4" />
          </button>
          <button onClick={handleBlock} title={`Block @${post.user}`} className={iconOnlyButtonClasses} aria-label={`Block user @${post.user}`}>
            <FiSlash className="w-4 h-4" />
          </button>
          <button onClick={toggleCardExpansion} title="Collapse Post" className={iconOnlyButtonClasses} aria-label="Collapse this post">
            <FiMinimize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body: Title, Image Gallery, Content */}
      <div className="p-3">
        {post.title && (
          <h2 className={`text-lg sm:text-xl font-semibold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{post.title}</h2>
        )}

        {renderImageGallery()}

        {post.content && (
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{post.content}</p>
        )}
      </div>

      {/* Footer: Actions (Votes, Favorite, Comment, Share) */}
      <div className={`mt-2 px-3 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-600'} flex flex-wrap justify-between items-center gap-2`}>
        <div className="flex items-center space-x-3">
          <VoteButtons
            upvotes={post.upvotes} // These would be actual counts from parent
            downvotes={post.downvotes} // These would be actual counts from parent
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
            darkMode={darkMode}
            uiUpvoted={uiUpvoted} // Pass UI state for immediate feedback
            uiDownvoted={uiDownvoted} // Pass UI state for immediate feedback
            itemId={post.id}
            itemType="post"
          />
          <button
            onClick={handleToggleFavorite}
            className={`${actionButtonBaseClasses} ${isFavorited ? (darkMode ? 'text-yellow-400' : 'text-yellow-500') : (darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-500 hover:text-yellow-500')}`}
            aria-pressed={isFavorited}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <FiHeart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            <span className="text-xs hidden sm:inline">Favorite</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleComments}
            className={`${actionButtonBaseClasses} ${showComments ? (darkMode ? 'text-blue-400 bg-blue-500/10' : 'text-blue-500 bg-blue-100') : (darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500')}`}
            aria-expanded={showComments}
            title={showComments ? "Hide comments" : "Show comments"}
          >
            <FiMessageCircle className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Comment ({post.comments?.length || 0})</span>
          </button>
          <button
            onClick={handleShare}
            className={`${actionButtonBaseClasses} ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            title="Share post"
          >
            <FiShare className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Comment Section */}
      {isExpanded && showComments && (
        <div className={`px-3 pb-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-600'}`}>
          <CommentSection
            postId={post.id}
            comments={post.comments}
            darkMode={darkMode}
            // onPostComment={onPostComment} // To be passed from App
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;