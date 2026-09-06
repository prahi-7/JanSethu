import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;