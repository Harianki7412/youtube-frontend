import React from 'react';
import { Link } from 'react-router-dom';


function Sidebar({ isOpen, toggleSidebar }) { 
  const backdropClass = isOpen ? "fixed inset-0 bg-black bg-opacity-70 z-30 lg:hidden" : "hidden";

  return (
    <>
      <div className={backdropClass} onClick={toggleSidebar}></div>

      <aside
        className={`
          bg-gray-900 text-white p-4 h-full
          fixed top-0 left-0 z-40 w-60 md:w-64
          transform transition-transform ease-in-out duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:shadow-none lg:h-screen lg:border-r lg:border-gray-800
        `}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-lg md:text-xl font-bold text-red-500 hover:text-red-400 transition-colors duration-200"
            onClick={toggleSidebar} 
          >
            YouTube Clone
          </Link>
          <button
            onClick={toggleSidebar}
            className="text-2xl text-gray-400 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            &times;
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            <li className="mb-2">
              <Link
                to="/"
                className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm md:text-base"
                onClick={toggleSidebar} 
              >
                <span className="mr-3 text-lg">🏠</span> Home
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/trending"
                className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm md:text-base"
                onClick={toggleSidebar} 
              >
                <span className="mr-3 text-lg">🔥</span> Trending
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/subscriptions"
                className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm md:text-base"
                onClick={toggleSidebar}
              >
                <span className="mr-3 text-lg">📺</span> Subscriptions
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/history"
                className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm md:text-base"
                onClick={toggleSidebar} 
              >
                <span className="mr-3 text-lg">🕒</span> History
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/library"
                className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm md:text-base"
                onClick={toggleSidebar} 
              >
                <span className="mr-3 text-lg">📚</span> Library
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/settings"
                className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm md:text-base"
                onClick={toggleSidebar}
              >
                <span className="mr-3 text-lg">⚙️</span> Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;