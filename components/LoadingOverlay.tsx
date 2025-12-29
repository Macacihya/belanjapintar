import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center max-w-xs w-full mx-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-800 font-medium text-center">{message}</p>
      </div>
    </div>
  );
};