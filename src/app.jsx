import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Import Components
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import SubNavigationB4 from './components/SubNavigationB4';
import PostList from './components/PostList';
import RulesSidebar from './components/RulesSidebar';
import Footer from './components/Footer';
import SubmitModal from './components/SubmitModal';
import Pagination from './components/Pagination';

// --- CONSTANTS --- (These could be moved to a separate constants.js file)
export const TAB_IDS = { B1: 'b1', B2: 'b2', B3: 'b3', B4: 'b4' };
export const SUB_TAB_IDS_B4 = { C1: 'c1', C2: 'c2', C3: 'c3', C4: 'c4', C5: 'c5', C6: 'c6' };
export const POST_CATEGORIES = { THOUGHTS: 'thoughts', PICS: 'pics', MOMENTS: 'moments' };

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
  { id: 1, title: "The paradox of modern communication", content: "We're more connected than ever yet lonelier than before...", category: POST_CATEGORIES.THOUGHTS, upvotes: 245, downvotes: 15, comments: [{ id: 1, author: "user123", text: "Great insight!", upvotes: 12, downvotes: 3 }], user: "philosophy_guy", timeAgo: "2 hours ago" },
  { id: 2, title: "This is a funny image post", imageUrl: "https://picsum.photos/id/1/800/600", category: POST_CATEGORIES.PICS, upvotes: 150, downvotes: 8, comments: [{ id: 3, author: "funnyguy", text: "LOL!", upvotes: 24, downvotes: 2 }], user: "user123", timeAgo: "3 hours ago" },
  { id: 3, title: "Deep Dive into Quantum Entanglement", content: "Exploring the spooky action at a distance...", category: POST_CATEGORIES.THOUGHTS, upvotes: 180, downvotes: 5, comments: [], user: "scienceNerd", timeAgo: "1 day ago" },
  { id: 4, title: "My Cat Being Derpy", imageUrl: "https://picsum.photos/id/103/800/600", category: POST_CATEGORIES.PICS, upvotes: 300, downvotes: 3, comments: [], user: "catLoverX", timeAgo: "5 hours ago" },
  { id: 5, title: "A Haiku for Spring", content: "Green shoots emerge now...", category: POST_CATEGORIES.MOMENTS, upvotes: 90, downvotes: 2, comments: [], user: "poet99", timeAgo: "6 hours ago" },
  { id: 6, title: "Thoughts on AI Ethics in 2024", content: "As AI becomes more advanced...", category: POST_CATEGORIES.THOUGHTS, upvotes: 220, downvotes: 12, comments: [], user: "ethicsGuru", timeAgo: "8 hours ago" },
  { id: 7, title: "Beautiful Sunset Today", imageUrl: "https://picsum.photos/id/200/800/600", category: POST_CATEGORIES.PICS, upvotes: 175, downvotes: 7, comments: [], user: "skywatcher", timeAgo: "1 hour ago" },
  { id: 8, title: "Just hit a new PR at the gym!", content: "Feeling strong and accomplished...", category: POST_CATEGORIES.MOMENTS, upvotes: 120, downvotes: 1, comments: [], user: "fitLife", timeAgo: "30 minutes ago" },
  { id: 9, title: "Is free will an illusion?", content: "Philosophical musings on determinism...", category: POST_CATEGORIES.THOUGHTS, upvotes: 150, downvotes: 20, comments: [], user: "deepThinker", timeAgo: "10 hours ago" },
  { id: 10, title: "Abandoned Places Photography", imageUrl: "https://picsum.photos/id/301/800/600", category: POST_CATEGORIES.PICS, upvotes: 250, downvotes: 6, comments: [], user: "urbanExplorer", timeAgo: "2 days ago" }
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

            <div className="lg:w-1/4 lg:sticky lg:top-24 h-fit">
              <RulesSidebar darkMode={darkMode} />
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