import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Import Components
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import SubNavigationB4 from './components/SubNavigationB4';
import PostList from './components/PostList';
import Footer from './components/Footer';
import SubmitModal from './components/SubmitModal';
import Pagination from './components/Pagination';
import SidebarContent from './components/SidebarContent'

// --- CONSTANTS --- (These could be moved to a separate constants.js file)
export const TAB_IDS = { B1: 'b1', B2: 'b2', B3: 'b3', B4: 'b4' };
export const SUB_TAB_IDS_B4 = { C1: 'c1', C2: 'c2', C3: 'c3', C4: 'c4', C5: 'c5', C6: 'c6' };
export const POST_CATEGORIES = { THOUGHTS: 'thoughts', PICS: 'pics', MOMENTS: 'moments', GENERAL: 'general'};

export const TAB_CONFIG = [
  { id: TAB_IDS.B1, label: 'B1', title: 'Bored Thoughts', category: POST_CATEGORIES.THOUGHTS },
  { id: TAB_IDS.B2, label: 'B2', title: 'Bored Pics', category: POST_CATEGORIES.PICS },
  { id: TAB_IDS.B3, label: 'B3', title: 'Bored Moments', category: POST_CATEGORIES.MOMENTS },
  { id: TAB_IDS.B4, label: 'B4', title: 'Most Bored', category: null },
];
export const SUB_TAB_CONFIG_B4 = [
  { id: SUB_TAB_IDS_B4.C1, label: 'C1' }, { id: SUB_TAB_IDS_B4.C2, label: 'C2' },
  { id: SUB_TAB_IDS_B4.C3, label: 'C3' }, { id: SUB_TAB_IDS_B4.C4, label: 'C4' },
  { id: SUB_TAB_IDS_B4.C5, label: 'C5' }, { id: SUB_TAB_IDS_B4.C6, label: 'C6' },
];
export const POSTS_PER_PAGE = 3;

// Mock data (Could be in src/data/mockPosts.js)
const MOCK_INITIAL_POSTS = [
  // --- Case 1: 0 Pictures ---
  {
    id: 'post-0pic-title-text-0com',
    title: "Deep Thoughts on a Rainy Afternoon",
    content: "The gentle patter of rain against the windowpane often leads to introspection. What are your favorite rainy day thoughts?",
    imageSrcList: [],
    user: "thinkerPro",
    timeAgo: "10 minutes ago",
    upvotes: 15,
    downvotes: 0,
    comments: [],
    category: POST_CATEGORIES.THOUGHTS
  },
  {
    id: 'post-0pic-noTitle-text-1com',
    // title: null, // No title
    content: "Just a quick update: feeling productive today! Managed to clear out a lot of pending tasks. What small wins did you have?",
    imageSrcList: [],
    user: "productivePerson",
    timeAgo: "30 minutes ago",
    upvotes: 22,
    downvotes: 1,
    comments: [
      { id: 'c1-1', author: 'taskMaster', text: 'Great job! Keep it up!', upvotes: 3, downvotes: 0 },
    ],
    category: POST_CATEGORIES.MOMENTS
  },
  {
    id: 'post-0pic-title-noText-2com',
    title: "A Moment of Silence",
    // content: null, // No text content
    imageSrcList: [],
    user: "zenMaster",
    timeAgo: "1 hour ago",
    upvotes: 8,
    downvotes: 0,
    comments: [
      { id: 'c1-2', author: 'peaceSeeker', text: 'Needed this.', upvotes: 2, downvotes: 0 },
      { id: 'c1-3', author: 'quietObserver', text: '...', upvotes: 1, downvotes: 0 },
    ],
    category: POST_CATEGORIES.GENERAL
  },
  {
    id: 'post-0pic-noTitle-noText-0com', // Edge case: No title, no text, no image
    // title: null,
    // content: null,
    imageSrcList: [],
    user: "minimalist",
    timeAgo: "4 hours ago",
    upvotes: 3,
    downvotes: 1,
    comments: [],
    category: POST_CATEGORIES.GENERAL
  },

  // --- Case 2: 1 Picture ---
  {
    id: 'post-1pic-title-text-0com',
    title: "My New Desk Setup",
    content: "Finally organized my workspace for better productivity and a cleaner look. What do you think?",
    imageSrcList: ["https://placehold.co/800x500?text=Desk+Setup"],
    user: "setupGuru",
    timeAgo: "2 hours ago",
    upvotes: 45,
    downvotes: 2,
    comments: [],
    category: POST_CATEGORIES.PICS
  },
  {
    id: 'post-1pic-noTitle-text-1com',
    // title: null,
    content: "Captured this beautiful an hour ago. Nature's art is the best.",
    imageSrcList: ["https://placehold.co/700x700?text=Sunset+View"],
    user: "skyWatcher",
    timeAgo: "3 hours ago",
    upvotes: 60,
    downvotes: 1,
    comments: [
      { id: 'c2-1', author: 'natureLover', text: 'Stunning!', upvotes: 5, downvotes: 0 },
    ],
    category: POST_CATEGORIES.PICS
  },
  {
    id: 'post-1pic-title-noText-2com',
    title: "Abstract Art Piece",
    // content: null,
    imageSrcList: ["https://placehold.co/600x800?text=Abstract+Art"],
    user: "artCollector",
    timeAgo: "5 hours ago",
    upvotes: 33,
    downvotes: 3,
    comments: [
      { id: 'c2-2', author: 'galleryFan', text: 'Intriguing!', upvotes: 4, downvotes: 0 },
      { id: 'c2-3', author: 'criticX', text: 'Makes you think.', upvotes: 2, downvotes: 1 },
    ],
    category: POST_CATEGORIES.PICS
  },

  // --- Case 3: 2 Pictures ---
  {
    id: 'post-2pic-title-text-0com',
    title: "Before & After: Garden Makeover",
    content: "Spent the weekend transforming the garden. So happy with the results!",
    imageSrcList: [
      "https://placehold.co/600x450?text=Garden+Before",
      "https://placehold.co/600x450?text=Garden+After"
    ],
    user: "greenThumb",
    timeAgo: "6 hours ago",
    upvotes: 75,
    downvotes: 1,
    comments: [],
    category: POST_CATEGORIES.MOMENTS
  },
  {
    id: 'post-2pic-noTitle-text-1com',
    // title: null,
    content: "My two furry companions enjoying a nap together. They are inseparable!",
    imageSrcList: [
        "https://placehold.co/500x500?text=Pet+1",
        "https://placehold.co/500x500?text=Pet+2"
    ],
    user: "petParent",
    timeAgo: "1 day ago",
    upvotes: 90,
    downvotes: 0,
    comments: [
      { id: 'c3-1', author: 'animalFriend', text: 'So adorable!', upvotes: 10, downvotes: 0 },
    ],
    category: POST_CATEGORIES.PICS
  },

  // --- Case 4: 3 Pictures ---
  {
    id: 'post-3pic-title-text-2com',
    title: "Weekend Culinary Adventures",
    content: "Tried out a few new recipes this weekend. A delicious pasta, a vibrant salad, and a decadent dessert!",
    imageSrcList: [
      "https://placehold.co/600x400?text=Pasta+Dish",
      "https://placehold.co/600x400?text=Salad+Bowl",
      "https://placehold.co/600x400?text=Dessert+Plate"
    ],
    user: "foodieExtraordinaire",
    timeAgo: "8 hours ago",
    upvotes: 110,
    downvotes: 4,
    comments: [
      { id: 'c4-1', author: 'chefWannabe', text: 'Looks amazing! Recipes?', upvotes: 7, downvotes: 0 },
      { id: 'c4-2', author: 'hungryGal', text: 'I want that dessert!', upvotes: 5, downvotes: 0 },
    ],
    category: POST_CATEGORIES.PICS
  },
  {
    id: 'post-3pic-title-noText-0com',
    title: "Cityscape Views",
    // content: null,
    imageSrcList: [
        "https://placehold.co/700x500?text=City+Day",
        "https://placehold.co/700x500?text=City+Night",
        "https://placehold.co/700x500?text=Rooftop+View"
    ],
    user: "urbanExplorer",
    timeAgo: "10 hours ago",
    upvotes: 65,
    downvotes: 2,
    comments: [],
    category: POST_CATEGORIES.PICS
  },

  // --- Case 5: 4 Pictures ---
  {
    id: 'post-4pic-title-text-1com',
    title: "Hiking Trip Highlights",
    content: "An amazing 4-day hike through the mountains. Challenging but worth every step for these views.",
    imageSrcList: [
      "https://placehold.co/800x600?text=Mountain+Peak",
      "https://placehold.co/600x800?text=Forest+Trail",
      "https://placehold.co/700x500?text=Waterfall",
      "https://placehold.co/600x600?text=Campsite"
    ],
    user: "adventurerMax",
    timeAgo: "12 hours ago",
    upvotes: 150,
    downvotes: 3,
    comments: [
      { id: 'c5-1', author: 'trailBlazer', text: 'Epic journey!', upvotes: 12, downvotes: 0 },
    ],
    category: POST_CATEGORIES.PICS
  },

  // --- Case 6: 5 Pictures ---
  {
    id: 'post-5pic-noTitle-text-2com',
    // title: null,
    content: "A collection of my favorite street art finds from around the city. So much talent out there!",
    imageSrcList: [
      "https://placehold.co/600x400?text=Graffiti+1",
      "https://placehold.co/500x700?text=Mural+Art",
      "https://placehold.co/700x500?text=Stencil+Work",
      "https://placehold.co/400x600?text=Sticker+Art",
      "https://placehold.co/600x500?text=Urban+Canvas"
    ],
    user: "streetArtFan",
    timeAgo: "15 hours ago",
    upvotes: 88,
    downvotes: 5,
    comments: [
      { id: 'c6-1', author: 'artLover', text: 'Love these!', upvotes: 6, downvotes: 0 },
      { id: 'c6-2', author: 'cityScout', text: 'Great finds, keep sharing!', upvotes: 4, downvotes: 0 },
    ],
    category: POST_CATEGORIES.PICS
  },
  // Add more permutations if needed, e.g., more comments with different image counts etc.
];

const MOCK_ANNOUNCEMENTS = [
  { text: "New 'Bored Art' contest starting next week! Details soon." },
  { text: "Server maintenance scheduled for Sunday 2 AM - 3 AM UTC." },
];

const MOCK_RULES = [
  { text: 'Be respectful to others in all interactions.' },
  { text: 'No spam, excessive self-promotion, or irrelevant links.' },
  { text: 'Keep discussions and content appropriate for a general audience.' },
  { text: 'Report any content or behavior that violates these rules.' },
];

const App = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(TAB_IDS.B1);
  const [subTab, setSubTab] = useState(SUB_TAB_IDS_B4.C1);
  const [darkMode, setDarkMode] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedComments, setExpandedComments] = useState([]);
  const [collapsedPosts, setCollapsedPosts] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setPosts(MOCK_INITIAL_POSTS);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getActiveTabConfig = useCallback(() => TAB_CONFIG.find(tab => tab.id === activeTab) || TAB_CONFIG[0], [activeTab]);

  const getPostCategoryForNewPost = useCallback(() => {
    const currentTabConfig = getActiveTabConfig();
    return currentTabConfig?.category || POST_CATEGORIES.MOMENTS;
  }, [getActiveTabConfig]);

  const currentFilteredPosts = useMemo(() => {
    if (isLoading) return [];
    let filtered = posts;
    switch (activeTab) {
      case TAB_IDS.B1: filtered = posts.filter(post => post.category === POST_CATEGORIES.THOUGHTS); break;
      case TAB_IDS.B2: filtered = posts.filter(post => post.category === POST_CATEGORIES.PICS); break;
      case TAB_IDS.B3: filtered = posts.filter(post => post.category === POST_CATEGORIES.MOMENTS); break;
      case TAB_IDS.B4:
        switch (subTab) {
          case SUB_TAB_IDS_B4.C1: filtered = posts.filter(p => p.timeAgo.includes('hour') && parseInt(p.timeAgo, 10) <= 4); break;
          case SUB_TAB_IDS_B4.C2: filtered = posts.filter(p => !!p.imageUrl); break;
          case SUB_TAB_IDS_B4.C3: filtered = posts.filter(p => !p.imageUrl); break;
          case SUB_TAB_IDS_B4.C4: filtered = [...posts].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)); break;
          default: filtered = posts;
        }
        break;
      default: filtered = posts;
    }
    return filtered;
  }, [posts, activeTab, subTab, isLoading]);

  const totalPages = Math.ceil(currentFilteredPosts.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const postsToDisplay = currentFilteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  useEffect(() => { setCurrentPage(1); }, [activeTab, subTab]);
  useEffect(() => {
    const newTotalPages = Math.ceil(currentFilteredPosts.length / POSTS_PER_PAGE);
    if (newTotalPages > 0 && currentPage > newTotalPages) setCurrentPage(newTotalPages);
    else if (newTotalPages === 0 && currentPage !== 1) setCurrentPage(1);
  }, [currentFilteredPosts.length, currentPage]);

  const handleToggleComments = useCallback((postId) => {
    setExpandedComments(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);
  }, []);

  const handleFormSubmit = useCallback((formData) => { // Expects an object of form data
    setIsSubmitting(true);
    setTimeout(() => {
      const newPost = {
        id: Date.now(),
        ...formData, // title, content, imageUrl, user
        category: getPostCategoryForNewPost(),
        upvotes: 0, downvotes: 0, comments: [], timeAgo: "just now"
      };
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setIsSubmitting(false); setShowSubmitModal(false);
    }, 1500);
  }, [getPostCategoryForNewPost]); // Removed posts from dependency array as it's updated via setPosts

  const handleToggleCollapsePost = useCallback((postId) => {
    setCollapsedPosts(prev => {
      const newCollapsed = new Set(prev);
      if (newCollapsed.has(postId)) newCollapsed.delete(postId); else newCollapsed.add(postId);
      return newCollapsed;
    });
  }, []);

  const pageTitle = getActiveTabConfig().title;
  const bodyClasses = `min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`;

  // Determine what fields the submit modal should show
  const submitModalType = getActiveTabConfig().category === POST_CATEGORIES.THOUGHTS || activeTab === TAB_IDS.B3 ? 'content' : 'image';
  const sidebarCards = <SidebarContent darkMode={darkMode} announcements={MOCK_ANNOUNCEMENTS} rules={MOCK_RULES} />;

  return (
    <div className={bodyClasses}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onShowSubmitModal={() => setShowSubmitModal(true)}
        tabConfig={TAB_CONFIG}
      />

      <MobileNav
        darkMode={darkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabConfig={TAB_CONFIG}
      />

      {activeTab === TAB_IDS.B4 && (
        <SubNavigationB4
          darkMode={darkMode}
          subTab={subTab}
          setSubTab={setSubTab}
          subTabConfig={SUB_TAB_CONFIG_B4}
        />
      )}

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-3/4">
              <div className="mb-6"> {/* This div might be part of a MainContentArea component later */}
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
                <div className="lg:hidden mb-6">
                  {sidebarCards}
                </div>
                <PostList
                  isLoading={isLoading}
                  postsToDisplay={postsToDisplay}
                  darkMode={darkMode}
                  expandedComments={expandedComments}
                  onToggleComments={handleToggleComments}
                  collapsedPosts={collapsedPosts}
                  onToggleCollapsePost={handleToggleCollapsePost}
                  postsPerPage={POSTS_PER_PAGE}
                  totalFilteredPosts={currentFilteredPosts.length}
                />

                {activeTab !== TAB_IDS.B4 && totalPages > 1 && !isLoading && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    darkMode={darkMode}
                  />
                )}
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/4 lg:sticky lg:top-24 h-fit">
              {sidebarCards}
            </div>
          </div>
        </div>
      </main>

      <Footer darkMode={darkMode} />

      {showSubmitModal && (
        <SubmitModal
          show={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          darkMode={darkMode}
          formType={submitModalType} // 'content' or 'image'
          // categoryForNewPost={getPostCategoryForNewPost()} // Pass this directly if needed by modal
        />
      )}
    </div>
  );
};

export default App;