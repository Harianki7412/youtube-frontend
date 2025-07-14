import React from 'react';
function CustomAlertDialog({ isOpen, message, onConfirm, onCancel, showCancelButton = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 md:p-8">
      
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl max-w-sm w-full border border-gray-700">
        
        <p className="text-white text-lg md:text-xl font-medium mb-4 text-center">
          
          {message}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-4">
         
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            OK
          </button>
          {showCancelButton && (
            <button
              onClick={onCancel}
              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomAlertDialog;