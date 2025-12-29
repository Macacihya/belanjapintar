import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center opacity-70">
      <div className="bg-primary/10 p-6 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-main mb-2">Daftar Belanja Kosong</h3>
      <p className="text-muted max-w-xs text-sm">
        Mulai tambahkan barang manual atau foto catatan belanja Anda.
      </p>
    </div>
  );
};