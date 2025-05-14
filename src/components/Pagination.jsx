import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, darkMode }) => {
  // For a large number of pages, you'd implement logic for "..." and showing a limited set of page numbers.
  // This is a simple version.
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${currentPage === 1 ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed') : (darkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')}`}
        aria-label="Previous page"
      >
        Prev
      </button>
      {pageNumbers.map(pageNumber => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${currentPage === pageNumber ? 'bg-pink-500 text-white' : (darkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')}`}
          aria-current={currentPage === pageNumber ? "page" : undefined}
        >
          {pageNumber}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${currentPage === totalPages ? (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed') : (darkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')}`}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;