export type Theme = {
  id: string;
  name: string;
  colors: {
    primary: string;   // RGB triplet e.g., "99 102 241"
    secondary: string; // RGB triplet
    dark: string;      // RGB triplet
  };
  hex: string; // Hex code for meta theme-color
};

export type UIMode = 'light' | 'dark' | 'system';

export const THEMES: Theme[] = [
  {
    id: 'indigo',
    name: 'Indigo',
    colors: {
      primary: '99 102 241',   // #6366f1
      secondary: '129 140 248', // #818cf8
      dark: '49 46 129'        // #312e81
    },
    hex: '#6366f1'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    colors: {
      primary: '16 185 129',   // #10b981
      secondary: '52 211 153', // #34d399
      dark: '6 78 59'          // #064e3b
    },
    hex: '#10b981'
  },
  {
    id: 'rose',
    name: 'Rose',
    colors: {
      primary: '244 63 94',    // #f43f5e
      secondary: '251 113 133', // #fb7185
      dark: '136 19 55'        // #881337
    },
    hex: '#f43f5e'
  },
  {
    id: 'amber',
    name: 'Amber',
    colors: {
      primary: '245 158 11',   // #f59e0b
      secondary: '251 191 36', // #fbbf24
      dark: '120 53 15'        // #78350f
    },
    hex: '#f59e0b'
  },
  {
    id: 'sky',
    name: 'Sky',
    colors: {
      primary: '14 165 233',   // #0ea5e9
      secondary: '56 189 248', // #38bdf8
      dark: '12 74 110'        // #0c4a6e
    },
    hex: '#0ea5e9'
  },
  {
    id: 'violet',
    name: 'Violet',
    colors: {
      primary: '139 92 246',   // #8b5cf6
      secondary: '167 139 250', // #a78bfa
      dark: '76 29 149'        // #4c1d95
    },
    hex: '#8b5cf6'
  }
];

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-dark', theme.colors.dark);
  
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.hex);
  localStorage.setItem('app-theme', theme.id);
};

export const applyUIMode = (mode: UIMode) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  
  if (mode === 'light') {
    root.classList.add('light');
  } else if (mode === 'dark') {
    root.classList.add('dark');
  }
  // If 'system', we remove both and let media queries handle it
  
  localStorage.setItem('app-ui-mode', mode);
};

export const getSavedTheme = (): Theme => {
  const saved = localStorage.getItem('app-theme');
  return THEMES.find(t => t.id === saved) || THEMES[0];
};

export const getSavedUIMode = (): UIMode => {
  return (localStorage.getItem('app-ui-mode') as UIMode) || 'system';
};
