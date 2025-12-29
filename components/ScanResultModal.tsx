
import React, { useState } from 'react';
import { ParsedItem, CATEGORIES } from '../types';

// PlusIcon definition added to fix "Cannot find name 'PlusIcon'" error
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

interface Props {
  items: ParsedItem[];
  onSave: (items: ParsedItem[]) => void;
  onCancel: () => void;
}

export const ScanResultModal: React.FC<Props> = ({ items, onSave, onCancel }) => {
  const [editedItems, setEditedItems] = useState<ParsedItem[]>(items);

  const handleChange = (index: number, field: keyof ParsedItem, value: string | number) => {
    const newItems = [...editedItems];
    // @ts-ignore
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedItems(newItems);
  };

  const handleDelete = (index: number) => {
    const newItems = editedItems.filter((_, i) => i !== index);
    setEditedItems(newItems);
  };

  const handleAddItem = () => {
    setEditedItems([
      ...editedItems,
      { item: '', category: 'Lainnya', price: 0 }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-app flex flex-col animate-fade-in-up transition-colors duration-300">
      <div className="bg-surface px-6 py-4 shadow-sm border-b border-border-subtle flex justify-between items-center z-10 transition-colors duration-300">
        <div>
          <h2 className="text-lg font-bold text-main">Periksa Hasil Scan</h2>
          <p className="text-xs text-muted">Koreksi nama dan harga sebelum disimpan.</p>
        </div>
        <button 
          onClick={onCancel}
          className="text-muted hover:text-main text-sm font-medium"
        >
          Batal
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {editedItems.map((item, index) => (
          <div key={index} className="bg-surface p-3 rounded-xl shadow-sm border border-border-subtle flex gap-3 items-start animate-fade-in transition-colors duration-300">
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <input
                    type="text"
                    value={item.item}
                    onChange={(e) => handleChange(index, 'item', e.target.value)}
                    placeholder="Nama barang..."
                    className="flex-1 text-main font-medium border-b border-border-subtle focus:border-primary outline-none py-1 bg-transparent transition-colors"
                />
                <div className="relative w-24">
                    <span className="absolute left-0 top-1 text-xs text-muted">Rp</span>
                    <input
                        type="number"
                        value={item.price || ''}
                        onChange={(e) => handleChange(index, 'price', Number(e.target.value))}
                        placeholder="0"
                        className="w-full pl-6 text-right text-main font-medium border-b border-border-subtle focus:border-primary outline-none py-1 bg-transparent transition-colors"
                    />
                </div>
              </div>
              
              <select
                value={item.category}
                onChange={(e) => handleChange(index, 'category', e.target.value)}
                className="text-xs text-muted bg-surface-alt rounded px-2 py-1 outline-none border-none w-full transition-colors"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => handleDelete(index)}
              className="text-muted/30 hover:text-rose-500 p-1 mt-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        
        <button 
          onClick={handleAddItem}
          className="w-full py-3 border-2 border-dashed border-border-strong rounded-xl text-muted font-medium text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <PlusIcon />
          Tambah Item Manual
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-surface p-4 border-t border-border-subtle flex justify-between items-center z-20 md:max-w-md md:mx-auto transition-colors duration-300">
        <div className="text-xs text-muted">
          Total: <span className="font-bold text-main">{editedItems.length} barang</span>
        </div>
        <button
          onClick={() => onSave(editedItems.filter(i => i.item.trim() !== ''))}
          disabled={editedItems.length === 0}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform disabled:opacity-50"
        >
          Simpan Semua
        </button>
      </div>
    </div>
  );
};
