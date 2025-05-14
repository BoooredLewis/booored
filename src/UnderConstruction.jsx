import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Site Name */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">booo.red</h1>

        {/* Under Construction Illustration (Placeholder) */}
        <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        {/* Main Message */}
        <h2 className="text-2xl font-semibold text-gray-700">Website Under Construction</h2>
      </div>
    </div>
  );
}

export default App;