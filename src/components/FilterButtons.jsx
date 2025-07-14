import React from 'react';

function FilterButtons({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="md:gap-3 justify-start sm:justify-center mb-4 p-2 sm:p-0 w-full">
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`
            py-1.5 px-3 md:py-2 md:px-4 
            rounded-full
            text-xs sm:text-sm font-medium 
            whitespace-nowrap transition-colors duration-200 shadow-md 
            flex-shrink-0 
            ${activeCategory === category
              ? 'bg-white text-gray-900 border border-blue-500'
              : 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-700'
            }`}
        >
          
          {category}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;