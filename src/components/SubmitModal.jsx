import React, { useState, useEffect } from 'react';

const SubmitModal = ({ show, onClose, onSubmit, isSubmitting, darkMode, formType }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [posterId, setPosterId] = useState('');

  // Reset form when modal is shown/hidden or formType changes
  useEffect(() => {
    if (show) {
      setTitle('');
      setContent('');
      setImageUrl('');
      setPosterId('');
    }
  }, [show, formType]);


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { title, posterId };
    if (formType === 'content') {
      formData.content = content;
      formData.imageUrl = null; // Ensure imageUrl is null if content form
    } else { // formType === 'image'
      formData.imageUrl = imageUrl;
      formData.content = null; // Ensure content is null if image form
    }
    onSubmit(formData);
    // Form reset is handled by parent after successful submission or in useEffect
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative z-10 w-full max-w-md rounded-xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} transform transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-extrabold">Submit New Post</h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              aria-label="Close submission form"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="modal-title">Title</label>
              <input
                type="text"
                id="modal-title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                placeholder="Enter your post title"
              />
            </div>

            {formType === 'content' ? (
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="modal-content">Content</label>
                <textarea
                  id="modal-content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required // Content is required for 'thoughts' type
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                  placeholder="Write your thoughts here..."
                ></textarea>
              </div>
            ) : ( // formType === 'image'
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="modal-image">Image URL</label>
                <input
                  type="url"
                  id="modal-image"
                  name="image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  // Image URL might not be strictly required for 'pics' category, but can be.
                  // If required, add `required` attribute.
                  className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="modal-posterId">Your ID (optional)</label>
              <input
                type="text"
                id="modal-posterId"
                name="posterId"
                value={posterId}
                onChange={(e) => setPosterId(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-500' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-pink-500/20`}
                placeholder="Enter your username"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
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
  );
};

export default SubmitModal;