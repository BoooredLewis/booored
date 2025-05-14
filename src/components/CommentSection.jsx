import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

// Individual Comment Component (can be in its own file if it grows)
const Comment = ({ comment, darkMode }) => {
    const handleUpvoteComment = () => console.log('Upvoted comment ID:', comment.id);
    const handleDownvoteComment = () => console.log('Downvoted comment ID:', comment.id);

    return (
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} relative overflow-hidden`}>
            <div className="flex items-start">
                <div className="flex-1">
                    <span className={`font-medium mr-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>@{comment.author}</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{comment.text}</p>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                    <button
                        onClick={handleUpvoteComment}
                        className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                        aria-label={`Upvote comment, current upvotes ${comment.upvotes}`}
                    >
                        <FiArrowUp className="w-3 h-3 text-green-500" />
                    </button>
                    <span className="text-xs">{comment.upvotes}</span>
                    <button
                        onClick={handleDownvoteComment}
                        className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                        aria-label={`Downvote comment`}
                    >
                        <FiArrowDown className="w-3 h-3 text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};


const CommentSection = ({ postId, comments, darkMode /* onPostComment */ }) => {
  // const [newCommentText, setNewCommentText] = useState('');
  // const [commenterId, setCommenterId] = useState('');

  const handlePostNewComment = (e) => {
    e.preventDefault();
    // Basic new comment logic - would call a prop function from App.jsx
    const commenterId = e.target.commenterId.value;
    const newCommentText = e.target.newCommentText.value;
    if (!newCommentText.trim()) return;
    console.log(`Post new comment for post ${postId}: ID: ${commenterId}, Text: ${newCommentText}`);
    // onPostComment(postId, { author: commenterId || 'anon', text: newCommentText });
    e.target.reset();
  };

  return (
    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} darkMode={darkMode} />
          ))}
        </div>
      ) : (
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm py-2 text-center`}>
          No comments yet. Be the first!
        </p>
      )}

      {/* New Comment Form */}
      <form onSubmit={handlePostNewComment} className="mt-3 space-y-2">
        <input
          type="text"
          name="commenterId"
          placeholder="Enter your ID (e.g., user99)"
          className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20 transition-colors`}
        />
        <textarea
          name="newCommentText"
          placeholder="Add a comment..."
          className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20 transition-colors`}
          rows={2}
        ></textarea>
        <div className="flex justify-end">
          <button type="submit" className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs hover:opacity-90 transition-all active:scale-95">
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;