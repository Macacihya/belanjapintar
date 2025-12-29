import React from 'react';
import { THEMES, Theme } from '../services/themeService';

interface Props {
  currentTheme: Theme;
  onSelect: (theme: Theme) => void;
  onClose: () => void;
}

export const ThemeSelector: React.FC<Props> = ({ currentTheme, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={onClose}
      />
      
      <div className="bg-surface w-full max-w-sm mx-4 mb-4 sm:mb-0 rounded-2xl p-6 shadow-2xl pointer-events-auto animate-fade-in-up transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-main">Ganti Tema</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-alt text-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {THEMES.map((theme) => {
            const isSelected = currentTheme.id === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onSelect(theme)}
                className={`group relative flex flex-col items-center p-3 rounded-xl border transition-all duration-200 ${
                    isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border-subtle hover:border-muted hover:bg-surface-alt'
                }`}
              >
                <div 
                    className="w-12 h-12 rounded-full shadow-sm mb-2 flex items-center justify-center transition-transform group-active:scale-90"
                    style={{ backgroundColor: `rgb(${theme.colors.primary})` }}
                >
                    {isSelected && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-primary' : 'text-muted'}`}>
                    {theme.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};