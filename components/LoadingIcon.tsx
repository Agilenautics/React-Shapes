import React from "react";

const LoadingIcon: React.FC = () => {
  return (
    <div className="loading-icon">
      <svg
        className="animate-spin h-10 w-10 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="11"
          stroke="currentColor"
          strokeWidth="2"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M9.5 16A6.5 6.5 0 016 12.5c0-1.623.61-3.105 1.61-4.22l1.564 1.564A4.5 4.5 0 008 12.5a4.5 4.5 0 004.5 4.5 4.5 4.5 0 004.22-6.15l1.565-1.565A6.5 6.5 0 0114.5 16h-5z"
        ></path>
      </svg>
    </div>
  );
};

export default LoadingIcon;
