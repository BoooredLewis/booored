import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FiShare, FiChevronUp, FiMoon, FiSun, FiArrowUp, FiArrowDown, FiMessageCircle } from 'react-icons/fi';

// --- CONSTANTS ---
const TAB_IDS = {
  B1: 'b1',
  B2: 'b2',
  B3: 'b3',
  B4: 'b4',
};

const SUB_TAB_IDS_B4 = {
  C1: 'c1', // Recent (within 4 hours)
  C2: 'c2', // Images
  C3: 'c3', // Text
  C4: 'c4', // Top Voted
  C5: 'c5', // (Placeholder)
  C6: 'c6', // (Placeholder)
};

const POST_CATEGORIES = {
  THOUGHTS: 'thoughts',
  PICS: 'pics',
  MOMENTS: 'moments',
};

const TAB_CONFIG = [
  { id: TAB_IDS.B1, label: 'B1', title: 'Bored Thoughts', category: POST_CATEGORIES.THOUGHTS },
  { id: TAB_IDS.B2, label: 'B2', title: 'Bored Pics', category: POST_CATEGORIES.PICS },
  { id: TAB_IDS.B3, label: 'B3', title: 'Bored Moments', category: POST_CATEGORIES.MOMENTS },
  { id: TAB_IDS.B4, label: 'B4', title: 'Most Bored', category: null }, // Category determined by sub-tab or general
];

const SUB_TAB_CONFIG_B4 = [
  { id: SUB_TAB_IDS_B4.C1, label: 'C1' },
  { id: SUB_TAB_IDS_B4.C2, label: 'C2' },
  { id: SUB_TAB_IDS_B4.C3, label: 'C3' },
  { id: SUB_TAB_IDS_B4.C4, label: 'C4' },
  { id: SUB_TAB_IDS_B4.C5, label: 'C5' },
  { id: SUB_TAB_IDS_B4.C6, label: 'C6' },
];

const POSTS_PER_PAGE = 3; // Define how many posts per page

// Expanded Mock data to better demonstrate pagination
const MOCK_INITIAL_POSTS = [
  { id: 1, title: "The paradox of modern communication", content: "We're more connected than ever yet lonelier than before. Social media promised to bring us together but created digital silos where we only hear our own echo.", category: POST_CATEGORIES.THOUGHTS, upvotes: 245, downvotes: 15, comments: [{ id: 1, author: "user123", text: "Great insight!", upvotes: 12, downvotes: 3 }], user: "philosophy_guy", timeAgo: "2 hours ago" },
  { id: 2, title: "This is a funny image post", imageUrl: "https://picsum.photos/id/1/800/600", category: POST_CATEGORIES.PICS, upvotes: 150, downvotes: 8, comments: [{ id: 3, author: "funnyguy", text: "LOL!", upvotes: 24, downvotes: 2 }], user: "user123", timeAgo: "3 hours ago" },
  { id: 3, title: "Deep Dive into Quantum Entanglement", content: "Exploring the spooky action at a distance. It's fascinating how particles can be linked.", category: POST_CATEGORIES.THOUGHTS, upvotes: 180, downvotes: 5, comments: [], user: "scienceNerd", timeAgo: "1 day ago" },
  { id: 4, title: "My Cat Being Derpy", imageUrl: "https://picsum.photos/id/103/800/600", category: POST_CATEGORIES.PICS, upvotes: 300, downvotes: 3, comments: [], user: "catLoverX", timeAgo: "5 hours ago" },
  { id: 5, title: "A Haiku for Spring", content: "Green shoots emerge now,\nWarm sun kisses sleepy earth,\nLife begins anew.", category: POST_CATEGORIES.MOMENTS, upvotes: 90, downvotes: 2, comments: [], user: "poet99", timeAgo: "6 hours ago" },
  { id: 6, title: "Thoughts on AI Ethics in 2024", content: "As AI becomes more advanced, the ethical considerations become paramount. We need to discuss bias, accountability, and the future of work.", category: POST_CATEGORIES.THOUGHTS, upvotes: 220, downvotes: 12, comments: [], user: "ethicsGuru", timeAgo: "8 hours ago" },
  { id: 7, title: "Beautiful Sunset Today", imageUrl: "https://picsum.photos/id/200/800/600", category: POST_CATEGORIES.PICS, upvotes: 175, downvotes: 7, comments: [], user: "skywatcher", timeAgo: "1 hour ago" },
  { id: 8, title: "Just hit a new PR at the gym!", content: "Feeling strong and accomplished. Consistency pays off! Deadlifted 2x my bodyweight.", category: POST_CATEGORIES.MOMENTS, upvotes: 120, downvotes: 1, comments: [], user: "fitLife", timeAgo: "30 minutes ago" },
  { id: 9, title: "Is free will an illusion?", content: "Philosophical musings on determinism and choice. What if our decisions are predetermined?", category: POST_CATEGORIES.THOUGHTS, upvotes: 150, downvotes: 20, comments: [], user: "deepThinker", timeAgo: "10 hours ago" },
  { id: 10, title: "Abandoned Places Photography", imageUrl: "https://picsum.photos/id/301/800/600", category: POST_CATEGORIES.PICS, upvotes: 250, downvotes: 6, comments: [], user: "urbanExplorer", timeAgo: "2 days ago" }
];


const App = () => {
  // --- STATE ---
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TAB_IDS.B1);
  const [subTab, setSubTab] = useState(SUB_TAB_IDS_B4.C1);
  const [darkMode, setDarkMode] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedComments, setExpandedComments] = useState([]);
  const [showRules, setShowRules] = useState(true);
  const [collapsedPosts, setCollapsedPosts] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1); // For pagination

  // --- EFFECTS ---
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setPosts(MOCK_INITIAL_POSTS);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // --- DERIVED STATE & HELPER FUNCTIONS ---
  const getActiveTabConfig = useCallback(() => TAB_CONFIG.find(tab => tab.id === activeTab) || TAB_CONFIG[0], [activeTab]);

  const getPostCategoryForNewPost = useCallback(() => {
    const currentTabConfig = getActiveTabConfig();
    return currentTabConfig?.category || POST_CATEGORIES.MOMENTS; // Default if not specific
  }, [getActiveTabConfig]);

  const currentFilteredPosts = useMemo(() => {
    if (isLoading) return [];

    let filtered = posts; // Start with all posts, then filter down
    switch (activeTab) {
      case TAB_IDS.B1:
        filtered = posts.filter(post => post.category === POST_CATEGORIES.THOUGHTS);
        break;
      case TAB_IDS.B2:
        filtered = posts.filter(post => post.category === POST_CATEGORIES.PICS);
        break;
      case TAB_IDS.B3:
        // Assuming B3 is 'Moments', or it could be all posts depending on exact requirement.
        // If B3 is meant to be 'all posts before B4 filtering', then `filtered = posts;` is fine here.
        // If B3 is specifically 'Moments', then:
        filtered = posts.filter(post => post.category === POST_CATEGORIES.MOMENTS);
        break;
      case TAB_IDS.B4:
        switch (subTab) {
          case SUB_TAB_IDS_B4.C1: // Recent (e.g., within 4 hours)
            filtered = posts.filter(post => {
              if (!post.timeAgo.includes('hour')) return false;
              const hours = parseInt(post.timeAgo, 10);
              return !isNaN(hours) && hours <= 4;
            });
            break;
          case SUB_TAB_IDS_B4.C2: // Images
            filtered = posts.filter(post => !!post.imageUrl);
            break;
          case SUB_TAB_IDS_B4.C3: // Text (no image)
            filtered = posts.filter(post => !post.imageUrl);
            break;
          case SUB_TAB_IDS_B4.C4: // Top Voted
            filtered = [...posts].sort((a, b) =>
              (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
            );
            break;
          default:
            filtered = posts; // Or a specific default for B4 if all posts isn't desired
        }
        break;
      default:
        filtered = posts; // Fallback to all posts
    }
    return filtered;
  }, [posts, activeTab, subTab, isLoading]);

  // Pagination Logic
  const totalPages = Math.ceil(currentFilteredPosts.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const postsToDisplay = currentFilteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Effect to reset current page when filters (activeTab, subTab) change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, subTab]);

  // Effect to adjust current page if it becomes out of bounds due to data changes
  useEffect(() => {
    const newTotalPages = Math.ceil(currentFilteredPosts.length / POSTS_PER_PAGE);
    if (newTotalPages > 0 && currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0 && currentPage !== 1) { // If no posts for current filter
      setCurrentPage(1);
    }
  }, [currentFilteredPosts.length, currentPage]);


  // --- EVENT HANDLERS ---
  const handleToggleComments = useCallback((postId) => {
    setExpandedComments(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  }, []);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      title: e.target.title.value,
      content: e.target.content?.value,
      imageUrl: e.target.image?.value || null,
      user: e.target.posterId.value || "anonymous",
    };

    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        ...formData,
        category: getPostCategoryForNewPost(),
        upvotes: 0,
        downvotes: 0,
        comments: [],
        timeAgo: "just now"
      };

      setPosts(prevPosts => [newPost, ...prevPosts]);
      setIsSubmitting(false);
      setShowSubmitModal(false);
      e.target.reset();
      // After adding a post, we might want to go to page 1 if the new post is on top
      // However, if the list is sorted in a way that the new post isn't on page 1,
      // this might be disruptive. For now, rely on the useEffect that checks bounds.
    }, 1500);
  }, [getPostCategoryForNewPost]);

  const handleToggleCollapsePost = useCallback((postId) => {
    setCollapsedPosts(prev => {
      const newCollapsed = new Set(prev);
      if (newCollapsed.has(postId)) {
        newCollapsed.delete(postId);
      } else {
        newCollapsed.add(postId);
      }
      return newCollapsed;
    });
  }, []);

  // --- RENDER LOGIC ---
  const pageTitle = getActiveTabConfig().title;
  const bodyClasses = `min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`;

  // --- RENDER: SKELETON LOADER ---
  const renderLoadingSkeletons = () => (
    <div className="space-y-6">
      {[...Array(POSTS_PER_PAGE)].map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
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
      ))}
    </div>
  );

  return (
    <div className={bodyClasses}>
      {/* === HEADER === (Potential Header.js) */}
      <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              booo.red
            </h1>
            <nav className="hidden md:flex space-x-6">
              {TAB_CONFIG.map(tab => (
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
              onClick={() => setShowSubmitModal(true)}
              className="hidden md:block px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-md"
            >
              Submit
            </button>
            <button className="md:hidden p-2" aria-label="Open menu">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {/* === END HEADER === */}

      {/* === MOBILE NAVIGATION === (Potential MobileNav.js) */}
      <div className="md:hidden">
        <nav className={`shadow-inner ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
          <div className="container mx-auto px-4 py-2 flex space-x-4 overflow-x-auto custom-scrollbar">
            {TAB_CONFIG.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${activeTab === tab.id ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : `${darkMode ? 'border border-pink-500 text-pink-400 hover:bg-pink-900 hover:text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
      {/* === END MOBILE NAVIGATION === */}

      {/* === SUB-TABS for B4 === (Potential SubNavigationB4.js) */}
      {activeTab === TAB_IDS.B4 && (
        <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="container mx-auto px-4 py-2">
            <div className="flex space-x-4 pb-2 overflow-x-auto custom-scrollbar">
              {SUB_TAB_CONFIG_B4.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSubTab(tab.id)}
                  className={`whitespace-nowrap py-3 px-2 transition-colors text-sm ${subTab === tab.id ? 'text-pink-500 border-b-2 border-pink-500 font-semibold' : `${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-pink-500`}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* === END SUB-TABS for B4 === */}

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* === MAIN CONTENT AREA === (Potential MainContent.js containing PostList.js) */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    {pageTitle}
                  </h2>
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="md:hidden px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm hover:opacity-90 transition-opacity"
                  >
                    Submit
                  </button>
                </div>

                {isLoading ? (
                  renderLoadingSkeletons()
                ) : currentFilteredPosts.length === 0 ? (
                  <div className={`p-6 text-center rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                    <p className="text-lg font-semibold">No posts found for this category.</p>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Try a different tab or submit something new!</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {/* === POST LIST === (Potential PostList.js mapping over PostCard.js) */}
                      {postsToDisplay.map((post) => {
                        const isCollapsed = collapsedPosts.has(post.id);
                        const areCommentsExpanded = expandedComments.includes(post.id);
                        // --- START OF POTENTIAL PostCard.js ---
                        return (
                          <div
                            key={post.id}
                            className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${isCollapsed ? 'opacity-75' : ''} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                          >
                            <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                              <h3 className={`font-medium ${darkMode ? 'hover:text-pink-400' : 'hover:text-pink-500'} transition-colors cursor-pointer`}>
                                {post.title}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => console.log('Share post ID:', post.id)}
                                  className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                                  aria-label="Share post"
                                >
                                  <FiShare className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleToggleCollapsePost(post.id)}
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
                              <div className="p-4 pt-0"> {/* Removed pt-0 from parent and added here if content exists*/}
                                {post.imageUrl && (
                                  <div className="relative my-4"> {/* Added my-4 for spacing */}
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
                                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm my-4`}> {/* Added my-4 */}
                                    {post.content}
                                  </p>
                                )}

                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                                  <span className="inline-block w-5 h-5 rounded-full bg-blue-500 mr-2"></span> {/* Placeholder avatar */}
                                  <span className="font-medium text-gray-700 dark:text-gray-300">@{post.user}</span>
                                  <span className="ml-2">{post.timeAgo}</span>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                  <div className="flex items-center space-x-4">
                                    <button
                                      onClick={() => console.log('Upvoted post ID:', post.id)}
                                      className="flex items-center space-x-1 text-green-500 hover:text-green-600 transition-colors"
                                      aria-label={`Upvote post, current upvotes ${post.upvotes}`}
                                    >
                                      <FiArrowUp className="w-4 h-4" />
                                      <span className="text-xs font-medium">{post.upvotes}</span>
                                    </button>
                                    <button
                                      onClick={() => console.log('Downvoted post ID:', post.id)}
                                      className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors"
                                      aria-label={`Downvote post, current downvotes ${post.downvotes}`}
                                    >
                                      <FiArrowDown className="w-4 h-4" />
                                      <span className="text-xs font-medium">{post.downvotes}</span>
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => handleToggleComments(post.id)}
                                    className={`flex items-center space-x-1 transition-colors ${areCommentsExpanded ? (darkMode ? 'text-blue-400' : 'text-blue-600') : (darkMode ? 'text-blue-500 hover:text-blue-400' : 'text-blue-500 hover:text-blue-600')}`}
                                    aria-label={areCommentsExpanded ? 'Hide comments' : `Show ${post.comments.length} comments`}
                                  >
                                    <FiMessageCircle className="w-4 h-4" />
                                    <span className="text-xs font-medium">{post.comments.length} comments</span>
                                  </button>
                                </div>

                                {/* === COMMENT SECTION === (Potential CommentSection.js) */}
                                {areCommentsExpanded && (
                                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    {post.comments.length > 0 ? (
                                      <div className="space-y-3">
                                        {post.comments.map(comment => (
                                          // --- START OF POTENTIAL Comment.js ---
                                          <div key={comment.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} relative overflow-hidden`}>
                                            <div className="flex items-start">
                                              <div className="flex-1">
                                                <span className={`font-medium mr-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>@{comment.author}</span>
                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{comment.text}</p>
                                              </div>
                                              <div className="flex items-center space-x-1 ml-2">
                                                <button
                                                  onClick={() => console.log('Upvoted comment ID:', comment.id)}
                                                  className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                                                  aria-label={`Upvote comment, current upvotes ${comment.upvotes}`}
                                                >
                                                  <FiArrowUp className="w-3 h-3 text-green-500" />
                                                </button>
                                                <span className="text-xs">{comment.upvotes}</span>
                                                <button
                                                  onClick={() => console.log('Downvoted comment ID:', comment.id)}
                                                  className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                                                  aria-label={`Downvote comment`}
                                                >
                                                  <FiArrowDown className="w-3 h-3 text-red-500" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                          // --- END OF POTENTIAL Comment.js ---
                                        ))}
                                      </div>
                                    ) : (
                                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm py-2 text-center`}>
                                        No comments yet. Be the first!
                                      </p>
                                    )}

                                    {/* New Comment Form */}
                                    <div className="mt-3 space-y-2">
                                      <input
                                        type="text"
                                        placeholder="Enter your ID (e.g., user99)"
                                        className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20 transition-colors`}
                                      />
                                      <textarea
                                        placeholder="Add a comment..."
                                        className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20 transition-colors`}
                                        rows={2}
                                      ></textarea>
                                      <div className="flex justify-end">
                                        <button className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs hover:opacity-90 transition-all active:scale-95">
                                          Post Comment
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {/* === END COMMENT SECTION === */}
                              </div>
                            )}
                          </div>
                        );
                        // --- END OF POTENTIAL PostCard.js ---
                      })}
                      {/* === END POST LIST === */}
                    </div>

                    {/* === PAGINATION CONTROLS === (Potential Pagination.js) */}
                    {activeTab !== TAB_IDS.B4 && totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-8">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${currentPage === 1 ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed') : (darkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')}`}
                          aria-label="Previous page"
                        >
                          Prev
                        </button>
                        {/* Page Numbers - Simple version. For many pages, you'd want ellipses (...) */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${currentPage === pageNumber ? 'bg-pink-500 text-white' : (darkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')}`}
                            aria-current={currentPage === pageNumber ? "page" : undefined}
                          >
                            {pageNumber}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${currentPage === totalPages ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed') : (darkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')}`}
                          aria-label="Next page"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* === END MAIN CONTENT AREA === */}

            {/* === RULES SIDEBAR === (Potential RulesSidebar.js) */}
            <div className="lg:w-1/4 lg:sticky lg:top-24 h-fit"> {/* Added h-fit for proper sticky behavior */}
              <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} transform transition-all duration-300 hover:shadow-xl`}>
                <div
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => setShowRules(!showRules)}
                  role="button" // Added role for accessibility
                  tabIndex={0} // Make it focusable
                  onKeyDown={(e) => e.key === 'Enter' && setShowRules(!showRules)} // Keyboard accessibility
                >
                  <h3 className="font-extrabold">Basic Rules & Announcements</h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-300`}>
                    <FiChevronUp className={`w-5 h-5 transition-transform duration-300 ${!showRules ? 'rotate-180' : ''}`} /> {/* Fixed rotation logic */}
                  </div>
                </div>

                <div className={`${!showRules ? 'max-h-0' : 'max-h-96'} overflow-hidden transition-max-height duration-500 ease-in-out`}> {/* Adjusted transition */}
                  <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <ul className="space-y-3">
                      {[
                        { text: 'Be respectful to others' },
                        { text: 'No spam or self-promotion' },
                        { text: 'Stay on topic' },
                        { text: 'Report inappropriate content' }
                      ].map((rule, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 mr-3 flex-shrink-0"></div>
                          <span className="text-sm">{rule.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* === END RULES SIDEBAR === */}
          </div>
        </div>
      </main>

      {/* === FOOTER === (Potential Footer.js) */}
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
              {['About', 'Privacy', 'Terms', 'Contact'].map(link => (
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
      {/* === END FOOTER === */}

      {/* === SUBMIT MODAL === (Potential SubmitModal.js) */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
             onClick={() => setShowSubmitModal(false)} // Close on backdrop click
        >
          <div
            className={`relative z-10 w-full max-w-md rounded-xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} transform transition-all duration-300`}
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside modal
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6"> {/* Increased mb */}
                <h3 className="text-xl font-extrabold">Submit New Post</h3>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  aria-label="Close submission form"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div> {/* Removed mb-4, using space-y-4 on form */}
                  <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title" // Added name attribute
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                    placeholder="Enter your post title"
                  />
                </div>

                {getActiveTabConfig().category === POST_CATEGORIES.THOUGHTS || activeTab === TAB_IDS.B3 ? ( // Show content for Thoughts or Moments (B3)
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="content">Content</label>
                    <textarea
                      id="content"
                      name="content" // Added name attribute
                      required={getActiveTabConfig().category === POST_CATEGORIES.THOUGHTS} // Required only for thoughts
                      rows={4}
                      className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                      placeholder="Write your thoughts here..."
                    ></textarea>
                  </div>
                ) : ( // Show Image URL for Pics (B2) or B4 (where it might be relevant for some subtabs, though form logic doesn't check subtab here)
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="image">Image URL</label>
                    <input
                      type="url"
                      id="image"
                      name="image" // Added name attribute
                      className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="posterId">Your ID (optional)</label>
                  <input
                    type="text"
                    id="posterId"
                    name="posterId" // Added name attribute
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'} transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : "Submit Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* === END SUBMIT MODAL === */}
    </div>
  );
};

export default App;