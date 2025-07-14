import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-4 text-red-500">404</h1>
      <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-300">Page Not Found</p>
      <Link 
        to="/" 
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200 shadow-lg text-base md:text-lg"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;