// youtube-clone-frontend/src/components/Header.jsx
// The main header component for the YouTube clone.
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFirstLetter } from '../utils/helpers';

function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);

  // Determine channelId for navigation
  const channelId = user?.channels?.[0]?._id;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
    setIsDropdownOpen(false);
    setIsMobileSearchVisible(false); // Hide search bar after submitting
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsMobileSearchVisible(false); // Hide mobile search when dropdown is opened
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleMobileSearch = () => {
    setIsMobileSearchVisible(!isMobileSearchVisible);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-gray-800 text-white p-3 md:p-4 flex items-center justify-between shadow-md sticky top-0 z-40">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-2 md:mr-4 text-xl md:text-2xl focus:outline-none p-1.5 md:p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 lg:hidden"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
        <Link
          to="/"
          className="text-lg md:text-xl lg:text-2xl font-bold text-red-500 hover:text-red-400 transition-colors duration-200 whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
            <path fill="#FF3D00" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"></path><path fill="#FFF" d="M20 31L20 17 32 24z"></path>
          </svg>
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className={`
        absolute top-0 left-0 right-0 h-full p-3 bg-gray-800
        flex items-center transition-transform duration-300 transform
        ${isMobileSearchVisible ? 'translate-y-0' : '-translate-y-full'}
        sm:static sm:h-auto sm:p-0 sm:translate-y-0 sm:flex-1 sm:mx-4 sm:max-w-xs md:max-w-md lg:max-w-xl
      `}>
        <input
          type="text"
          placeholder="Search videos..."
          className="p-1.5 md:p-2 flex-1 bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 rounded-l-md rounded-r-none transition-all duration-200 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search videos"
        />
        <button
          type="submit"
          className="bg-gray-700 p-1.5 md:p-2 border border-l-0 border-gray-600 hover:bg-gray-600 rounded-r-md rounded-l-none transition-colors duration-200"
          aria-label="Submit search"
        >
          🔍
        </button>
      </form>
      <div className="flex items-center relative user-dropdown-container">
        <button
          onClick={toggleMobileSearch}
          className="p-1.5 text-xl text-gray-300 hover:text-white sm:hidden mr-2"
          aria-label="Toggle search bar"
        >
          🔍
        </button>

        {user ? (
          <button onClick={toggleDropdown} className="flex items-center space-x-1 md:space-x-2 focus:outline-none">
            <span className="text-gray-300 text-sm hidden lg:inline">Hello, {user.username || user.email}!</span>
            <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-500 flex items-center justify-center rounded-full text-white font-bold text-xs md:text-sm">
              {getFirstLetter(user.username || user.email)}
            </div>
          </button>
        ) : (
          <Link
            to="/auth"
            className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 md:py-2 md:px-4 rounded-md transition-colors duration-200 text-sm md:text-base whitespace-nowrap"
          >
            Sign In
          </Link>
        )}

        {isDropdownOpen && user && (
          <div className="absolute top-full right-0 mt-2 w-40 md:w-48 bg-white rounded-md shadow-lg py-1 z-10">
            {channelId ? (
              <Link
                to={`/channel/${channelId}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                My Channel
              </Link>
            ) : (
              <Link
                to="/create-channel"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Create Channel
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;