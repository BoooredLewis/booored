import React from 'react';
import { FiShare, FiChevronUp, FiMessageCircle } from 'react-icons/fi';
import CommentSection from './CommentSection';
import VoteButtons from './VoteButtons'; // Import the new component

const PostCard = ({
  post,
  darkMode,
  isCommentsExpanded,
  onToggleComments,
  isCollapsed,
  onToggleCollapsePost,
}) => {
  const handleShare = () => console.log('Share post ID:', post.id);
  // Dummy handlers for now, these would ideally update state in App.jsx
  const handleUpvotePost = () => console.log('Upvoted post ID:', post.id);
  const handleDownvotePost = () => console.log('Downvoted post ID:', post.id);

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${isCollapsed ? 'opacity-75' : ''} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`font-medium ${darkMode ? 'hover:text-pink-400' : 'hover:text-pink-500'} transition-colors cursor-pointer`}>
          {post.title}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            aria-label="Share post"
          >
            <FiShare className="w-5 h-5" />
          </button>
          <button
            onClick={() => onToggleCollapsePost(post.id)}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            aria-label={isCollapsed ? 'Expand post' : 'Collapse post'}
          >
            <FiChevronUp
              className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 pt-0">
          {post.imageUrl && (
            <div className="relative my-4">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-auto object-cover rounded-lg"
              />
              <span className="absolute top-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                {post.category}
              </span>
            </div>
          )}

          {post.content && (
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm my-4`}>
              {post.content}
            </p>
          )}

          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
            <span className="inline-block w-5 h-5 rounded-full bg-blue-500 mr-2"></span>
            <span className="font-medium text-gray-700 dark:text-gray-300">@{post.user}</span>
            <span className="ml-2">{post.timeAgo}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <VoteButtons
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              onUpvote={handleUpvotePost}
              onDownvote={handleDownvotePost}
              darkMode={darkMode}
              size="default" // 'default' size for posts
              itemId={post.id}
              itemType="post"
            />

            <button
              onClick={() => onToggleComments(post.id)}
              className={`flex items-center space-x-1 transition-colors ${isCommentsExpanded ? (darkMode ? 'text-blue-400' : 'text-blue-600') : (darkMode ? 'text-blue-500 hover:text-blue-400' : 'text-blue-500 hover:text-blue-600')}`}
              aria-label={isCommentsExpanded ? 'Hide comments' : `Show ${post.comments.length} comments`}
            >
              <FiMessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{post.comments.length} comments</span>
            </button>
          </div>

          {isCommentsExpanded && (
            <CommentSection
              postId={post.id}
              comments={post.comments}
              darkMode={darkMode}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;