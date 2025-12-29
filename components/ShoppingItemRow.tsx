import React, { useState, useEffect } from 'react';
import { ShoppingItem } from '../types';

interface Props {
  item: ShoppingItem;
  onToggle: (id: string, currentStatus: boolean) => void;
  onUpdateName: (id: string, newName: string) => void;
  onUpdatePrice: (id: string, newPrice: number) => void;
  onDelete: (id: string) => void;
}

export const ShoppingItemRow: React.FC<Props> = ({ item, onToggle, onUpdateName, onUpdatePrice, onDelete }) => {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price?.toString() || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const age = Date.now() - item.createdAt;
    if (age < 5000) {
      setIsNew(true);
      const timer = setTimeout(() => setIsNew(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [item.id, item.createdAt]);

  useEffect(() => {
    setName(item.name);
  }, [item.name]);

  useEffect(() => {
    setPrice(item.price ? item.price.toString() : '');
  }, [item.price]);

  const handleNameBlur = () => {
    const trimmedName = name.trim();
    if (trimmedName && trimmedName !== item.name) {
      onUpdateName(item.id, trimmedName);
    } else if (!trimmedName) {
      setName(item.name);
    }
  };

  const handlePriceBlur = () => {
    const numPrice = parseInt(price.replace(/[^0-9]/g, ''), 10);
    const validPrice = isNaN(numPrice) ? 0 : numPrice;
    if (validPrice !== item.price) {
      onUpdatePrice(item.id, validPrice);
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
        onDelete(item.id);
    }, 300);
  };

  return (
    <li
      className={`group relative flex items-center gap-3 p-3.5 rounded-xl transition-all duration-500 ease-out 
        ${isDeleting ? 'opacity-0 scale-95 -translate-x-4' : 'opacity-100 scale-100'}
        ${isNew ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5' : ''}
        ${item.isChecked
          ? 'bg-app/50 shadow-none border border-transparent'
          : 'bg-surface shadow-sm border border-border-subtle hover:shadow-md hover:border-primary/20'
        }
      `}
    >
      <button
        onClick={() => onToggle(item.id, item.isChecked)}
        className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 focus:outline-none active:scale-125 ${
          item.isChecked
            ? 'bg-primary border-primary'
            : 'bg-transparent border-muted/30 hover:border-primary'
        }`}
      >
        <svg
          className={`w-3.5 h-3.5 text-white transition-all duration-300 transform ${
            item.isChecked ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
          disabled={item.isChecked}
          className={`w-full bg-transparent outline-none transition-all duration-300 text-sm md:text-base ${
            item.isChecked
              ? 'text-muted/50 line-through decoration-muted/30'
              : 'text-main font-medium placeholder-muted/50 focus:text-primary'
          }`}
          placeholder="Nama barang..."
        />

        <div className={`flex items-center mt-0.5 text-xs transition-colors duration-300 ${item.isChecked ? 'text-muted/30' : 'text-primary/70'}`}>
             <span className="mr-1 font-bold">Rp</span>
             <input
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={handlePriceBlur}
                disabled={item.isChecked}
                className={`bg-transparent outline-none w-24 p-0 font-bold ${item.isChecked ? 'text-muted/30' : 'placeholder-muted/30'}`}
                placeholder="0"
             />
        </div>
      </div>

      <button
        onClick={handleDelete}
        className={`p-2 rounded-full transition-all duration-200 text-muted/30 hover:text-rose-500 hover:bg-rose-500/10`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </li>
  );
};