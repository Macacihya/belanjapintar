export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isChecked: boolean;
  createdAt: number;
}

export interface ParsedItem {
  item: string;
  category: string;
  price?: number;
}

export type LoadingState = 'idle' | 'scanning' | 'saving' | 'error';

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

export const CATEGORIES = [
  'Sayuran & Buah',
  'Daging & Ikan',
  'Bahan Pokok',
  'Bumbu Dapur',
  'Minuman',
  'Snack',
  'Kebersihan',
  'Lainnya'
];