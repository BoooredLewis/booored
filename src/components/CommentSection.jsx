import React from 'react';
import VoteButtons from './VoteButtons'; // Import the new component

// Individual Comment Component
const Comment = ({ comment, darkMode }) => {
    // Dummy handlers for now
    const handleUpvoteComment = () => console.log('Upvoted comment ID:', comment.id);
    const handleDownvoteComment = () => console.log('Downvoted comment ID:', comment.id);

    return (
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} relative`}> {/* Removed overflow-hidden to ensure hover bg is visible */}
            <div className="flex items-start justify-between"> {/* Use justify-between */}
                <div className="flex-1 mr-2"> {/* Added mr-2 for spacing */}
                    <span className={`font-medium mr-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>@{comment.author}</span>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{comment.text}</p>
                </div>
                <VoteButtons
                    upvotes={comment.upvotes}
                    downvotes={comment.downvotes} // Assuming comments can be downvoted, if not, remove downvote logic
                    onUpvote={handleUpvoteComment}
                    onDownvote={handleDownvoteComment}
                    darkMode={darkMode}
                    size="small" // 'small' size for comments
                    itemId={comment.id}
                    itemType="comment"
                />
            </div>
        </div>
    );
};

const CommentSection = ({ postId, comments, darkMode }) => {
  const handlePostNewComment = (e) => {
    e.preventDefault();
    const commenterId = e.target.commenterId.value;
    const newCommentText = e.target.newCommentText.value;
    if (!newCommentText.trim()) return;
    console.log(`Post new comment for post ${postId}: ID: ${commenterId || 'anon'}, Text: ${newCommentText}`);
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