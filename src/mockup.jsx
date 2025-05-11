import React, { useState, useEffect } from 'react';
import { FiShare, FiChevronUp, FiMoon, FiSun, FiArrowUp, FiArrowDown, FiMessageCircle } from 'react-icons/fi';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('b1');
  const [subTab, setSubTab] = useState('c1');
  const [darkMode, setDarkMode] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedComments, setExpandedComments] = useState([]);
  const [showRules, setShowRules] = useState(true);
  const [collapsedPosts, setCollapsedPosts] = useState(new Set());

  // Mock data
  const mockPosts = [
    {
      id: 1,
      title: "The paradox of modern communication",
      content: "We're more connected than ever yet lonelier than before. Social media promised to bring us together but created digital silos where we only hear our own echo.",
      category: "thoughts",
      upvotes: 245,
      downvotes: 15,
      comments: [
        { id: 1, author: "user123", text: "Great insight! This really resonates with me.", upvotes: 12, downvotes: 3 },
        { id: 2, author: "thinker", text: "But isn't this also about how we use these platforms?", upvotes: 8, downvotes: 1 }
      ],
      user: "philosophy_guy",
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      title: "This is a funny image post",
      imageUrl: "https://picsum.photos/id/1/800/600 ",
      category: "pics",
      upvotes: 150,
      downvotes: 8,
      comments: [
        { id: 3, author: "funnyguy", text: "LOL!", upvotes: 24, downvotes: 2 },
        { id: 4, author: "viewer", text: "Classic meme material", upvotes: 15, downvotes: 1 }
      ],
      user: "user123",
      timeAgo: "3 hours ago"
    }
  ];

  // Filter posts
  const filteredPosts = () => {
    switch (activeTab) {
      case 'b1': return posts.filter(post => post.category === 'thoughts');
      case 'b2': return posts.filter(post => post.category === 'pics');
      case 'b3': return [...posts];
      case 'b4': 
        switch(subTab) {
          case 'c1': return posts.filter(post => {
            const hours = parseInt(post.timeAgo);
            return post.timeAgo.includes('hour') && (isNaN(hours) ? false : hours <= 4);
          });
          case 'c2': return posts.filter(post => post.imageUrl);
          case 'c3': return posts.filter(post => !post.imageUrl);
          case 'c4': return [...posts].sort((a, b) => 
            (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
          );
          default: return posts;
        }
      default: return posts;
    }
  };

  useEffect(() => {
    setTimeout(() => setPosts(mockPosts), 500);
  }, []);

  // Toggle comment section
  const toggleComments = (postId) => {
    setExpandedComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newPost = {
        id: posts.length + 1,
        title: e.target.title.value,
        content: e.target.content?.value,
        imageUrl: e.target.image.value || null,
        category: activeTab === 'b1' ? 'thoughts' : 
                  activeTab === 'b2' ? 'pics' : 'moments',
        upvotes: 0,
        downvotes: 0,
        comments: [],
        user: e.target.posterId.value || "anonymous",
        timeAgo: "just now"
      };
      
      setPosts([newPost, ...posts]);
      setIsSubmitting(false);
      setShowSubmitModal(false);
      e.target.reset();
    }, 1500);
  };

  // Handle post collapse
  const toggleCollapse = (postId) => {
    setCollapsedPosts(prev => {
      const newCollapsed = new Set(prev);
      if (newCollapsed.has(postId)) {
        newCollapsed.delete(postId);
      } else {
        newCollapsed.add(postId);
      }
      return newCollapsed;
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              booo.red
            </h1>
            <nav className="hidden md:flex space-x-6">
              {['b1', 'b2', 'b3', 'b4'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 transition-colors ${activeTab === tab ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-600 hover:text-pink-500'} hover:scale-105 active:scale-95`}
                >
                  {tab.toUpperCase()}
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
              {darkMode ? (
 <FiMoon className="h-5 w-5" /> ) : (<FiSun className="h-5 w-5" /> )}
            </button>
            <button className="px-4 py-1 rounded-full border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 active:scale-95">
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
            <button className="md:hidden p-2">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className="md:hidden">
        <nav className={`shadow-inner ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
          <div className="container mx-auto px-4 py-2 flex space-x-4 overflow-x-auto custom-scrollbar">
            {['b1', 'b2', 'b3', 'b4'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${activeTab === tab ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : `${darkMode ? 'border border-pink-500 text-pink-400 dark:hover:bg-pink-900 dark:hover:text-white' : 'bg-gray-200'}`}`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Sub-tabs for b4 */}
      {activeTab === 'b4' && (
        <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="container mx-auto px-4 py-2">
            <div className="flex space-x-4 pb-2">
              {['c1', 'c2', 'c3', 'c4', 'c5', 'c6'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setSubTab(tab)}
                  className={`whitespace-nowrap py-3 px-2 transition-colors ${subTab === tab ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-600 hover:text-pink-500'}`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content Area */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                    {activeTab === 'b1' ? 'Bored Thoughts' : 
                     activeTab === 'b2' ? 'Bored Pics' : 
                     activeTab === 'b3' ? 'Bored Moments' : 
                     'Most Bored'}
                  </h2>
                  <button 
                    onClick={() => setShowSubmitModal(true)}
                    className="md:hidden px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm hover:opacity-90 transition-opacity"
                  >
                    Submit
                  </button>
                </div>
                
                {/* Loading state */}
                {posts.length === 0 ? (
                  <div className="space-y-6">
                    {[...Array(4)].map((_, index) => (
                      <div 
                        key={index} 
                        className="rounded-xl overflow-hidden shadow-lg bg-white"
                      >
                        <div className="h-48 bg-gray-200 relative overflow-hidden"></div>
                        <div className="p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="h-3 w-16 bg-gray-200 rounded-full"></div>
                            <div className="h-3 w-12 bg-gray-200 rounded-full"></div>
                          </div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <div className="h-5 w-5 rounded-full bg-gray-200"></div>
                                <div className="h-3 w-6 bg-gray-200 rounded-full"></div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className="h-5 w-5 rounded-full bg-gray-200"></div>
                                <div className="h-3 w-6 bg-gray-200 rounded-full"></div>
                              </div>
                            </div>
                            <div className="h-3 w-16 bg-gray-200 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredPosts().map((post) => (
                      <div 
                        key={post.id} 
                        className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${collapsedPosts.has(post.id) ? 'opacity-75' : ''} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                      >
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="font-medium hover:text-pink-500 transition-colors cursor-pointer">
                            {post.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => console.log('Share')}
                              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                              aria-label="Share post"
                            >
                              <FiShare className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => toggleCollapse(post.id)}
                              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                              aria-label={collapsedPosts.has(post.id) ? 'Expand post' : 'Collapse post'}
                            >
                              <FiChevronUp 
                                className={`w-5 h-5 transition-transform duration-300 ${
                                  collapsedPosts.has(post.id) ? 'rotate-180' : ''
                                }`} 
                              />

                            </button>
                          </div>
                        </div>
                        
                        {!collapsedPosts.has(post.id) && (
                          <div className="p-4 pt-0">
                            {post.imageUrl && (
                              <div className="relative mb-4">
                                <img 
                                  src={post.imageUrl} 
                                  alt={post.title} 
                                  className="w-full h-auto object-cover rounded-lg"
                                />
                                <span className="absolute top-2 right-2 text-xs text-white bg-black/50 px-1 rounded">
                                  {post.category}
                                </span>
                              </div>
                            )}
                            
                            {post.content && (
                              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>
                                {post.content}
                              </p>
                            )}
                            
                            <div className="flex items-center text-xs mb-4">
                              <span className="inline-block w-5 h-5 rounded-full bg-blue-500 mr-2"></span>
                              <span className="font-medium">@{post.user}</span>
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>
                                {post.timeAgo}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center space-x-4">
                                <button 
                                  onClick={() => console.log('Upvoted')}
                                  className="flex items-center space-x-1 text-green-500 hover:text-green-600 transition-colors"
                                >
                                  <FiArrowUp className="w-4 h-4" />
                                  <span className="text-xs font-medium">{post.upvotes}</span>
                                </button>
                                <button 
                                  onClick={() => console.log('Downvoted')}
                                  className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors"
                                >
                                  <FiArrowDown className="w-4 h-4" />
                                  <span className="text-xs font-medium">{post.downvotes}</span>
                                </button>
                              </div>
                              
                              <button 
                                onClick={() => toggleComments(post.id)}
                                className={`flex items-center space-x-1 transition-colors ${expandedComments.includes(post.id) ? 'text-blue-600' : 'text-blue-500 hover:text-blue-600'}`}
                              >
                                <FiMessageCircle className="w-4 h-4" />
                                <span className="text-xs font-medium">{post.comments.length} comments</span>
                              </button>
                            </div>
                            
                            {expandedComments.includes(post.id) && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                {post.comments.length > 0 ? (
                                  <div className="space-y-3">
                                    {post.comments.map(comment => (
                                      <div key={comment.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} relative overflow-hidden`}>
                                        <div className="flex items-start">
                                          <div className="flex-1">
                                            <span className="font-medium mr-2">@{comment.author}</span>
                                            <p className="text-sm">{comment.text}</p>
                                          </div>
                                          <div className="flex items-center space-x-1 ml-2">
                                            <button 
                                              onClick={() => console.log('Upvoted comment')}
                                              className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                                            >
                                              <FiArrowUp className="w-3 h-3 text-green-500" />
                                            </button>
                                            <span className="text-xs">{comment.upvotes}</span>
                                            <button
                                              onClick={() => console.log('Downvoted comment')}
                                              className={`p-1 rounded-md ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                                            >
                                                <FiArrowDown className="w-3 h-3 text-red-500" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm py-2`}>
                                    No comments yet
                                  </p>
                                )}
                                
                                <div className="mt-3 space-y-2">
                                  <input 
                                    type="text"
                                    placeholder="Enter your ID" 
                                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20 transition-colors`}
                                  />
                                  <textarea 
                                    placeholder="Add a comment..." 
                                    className={`w-full p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20 transition-colors`}
                                    rows={2}
                                  ></textarea>
                                  <div className="flex justify-end">
                                    <button className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs hover:opacity-90 transition-all">
                                      Post Comment
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Load More Button */}
                {posts.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <button className={`px-6 py-2 rounded-full border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'} transition-all duration-300 transform hover:scale-105 active:scale-95`}>
                      Load More
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Rules Section */}
            <div className="lg:sticky lg:top-24">
              <div className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} transform transition-all duration-300 hover:shadow-xl`}>
                <div 
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => setShowRules(!showRules)}
                >
                  <h3 className="font-extrabold">Basic Rules & Announcements</h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-300`}>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-300 ${showRules ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7 -7" />
                    </svg>
                  </div>
                </div>
                
                <div className={`${!showRules ? 'max-h-0 overflow-hidden' : 'max-h-96 overflow-y-auto'} transition-all duration-300 ease-in-out`}>
                  <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <ul className="space-y-3">
                      {[
                        { text: 'Be respectful to others' },
                        { text: 'No spam or self-promotion' },
                        { text: 'Stay on topic' },
                        { text: 'Report inappropriate content' }
                      ].map((rule, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 mr-3"></div>
                          <span className="text-sm">{rule.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-12 py-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                booo.red
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>
                Community-curated content for the internet generation
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-pink-500 transition-colors`}>
                About
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-pink-500 transition-colors`}>
                Privacy
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-pink-500 transition-colors`}>
                Terms
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-pink-500 transition-colors`}>
                Contact
              </a>
            </div>
          </div>
          
          <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>&copy; {new Date().getFullYear()} booo.red. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSubmitModal(false)}
          ></div>
          
          <div className={`relative z-10 w-full max-w-md rounded-xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} transform transition-all duration-300`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-extrabold">Submit New Post</h3>
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="title">
                    Title
                  </label>
                  <input 
                    type="text" 
                    id="title" 
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                    placeholder="Enter your post title"
                  />
                </div>
                
                {activeTab === 'b1' ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="content">
                      Content
                    </label>
                    <textarea 
                      id="content" 
                      required
                      rows={4}
                      className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                      placeholder="Write your thoughts here..."
                    ></textarea>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor="image">
                      Image URL (optional)
                    </label>
                    <input 
                      type="url" 
                      id="image"
                      className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                      placeholder="https://example.com/image.jpg "
                    />
                  </div>
                )}
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="posterId">
                    Your ID (optional)
                  </label>
                  <input 
                    type="text" 
                    id="posterId" 
                    className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                    placeholder="Enter your username"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowSubmitModal(false)}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
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
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8 -8 8 8 0 0 0 -8 8z"></path>
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
    </div>
  );
};

export default App;