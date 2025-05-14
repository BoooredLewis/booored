import React from 'react';
import PostCard from './PostCard';
import PostSkeleton from './PostSkeleton';

const PostList = ({
  isLoading,
  postsToDisplay,
  darkMode,
  expandedComments,
  onToggleComments,
  collapsedPosts,
  onToggleCollapsePost,
  postsPerPage,
  totalFilteredPosts,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(postsPerPage)].map((_, index) => (
          <PostSkeleton key={`skeleton-${index}`} darkMode={darkMode} />
        ))}
      </div>
    );
  }

  if (totalFilteredPosts === 0) {
    return (
      <div className={`p-6 text-center rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <p className="text-lg font-semibold">No posts found for this category.</p>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Try a different tab or submit something new!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {postsToDisplay.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          darkMode={darkMode}
          isCommentsExpanded={expandedComments.includes(post.id)}
          onToggleComments={onToggleComments}
          isCollapsed={collapsedPosts.has(post.id)}
          onToggleCollapsePost={onToggleCollapsePost}
        />
      ))}
    </div>
  );
};

export default PostList;