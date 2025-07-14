import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen w-full bg-gray-900 text-white p-4">
      <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 border-t-4 border-b-4 border-blue-500"></div>
      <p className="mt-4 md:mt-0 md:ml-4 text-base sm:text-lg md:text-xl font-semibold">Loading...</p>
    </div>
  );
}

export default LoadingSpinner;