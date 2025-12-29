
import React, { useState, useEffect, useRef } from 'react';
import { 
  subscribeToItems, 
  addItemToFirebase, 
  toggleItemStatus, 
  deleteItemFromFirebase, 
  addMultipleItems, 
  updateItemPrice, 
  updateItemName, 
  deleteCheckedItems, 
  deleteUncheckedItems,
  deleteAllItemsFromFirebase
} from './services/firebaseService';
import { parseShoppingListImage } from './services/geminiService';
import { ShoppingItem, CATEGORIES, LoadingState, ParsedItem, SortOption } from './types';
import { EmptyState } from './components/EmptyState';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ScanResultModal } from './components/ScanResultModal';
import { ShoppingItemRow } from './components/ShoppingItemRow';
import { ThemeSelector } from './components/ThemeSelector';
import { Toast, ToastItem, ToastType } from './components/Toast';
import { getSavedTheme, applyTheme, Theme, getSavedUIMode, applyUIMode, UIMode } from './services/themeService';

// Helper Icons
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>;
const BroomIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const PaletteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
const SortIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const SparklesSmallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const DangerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export default function App() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [loadingMsg, setLoadingMsg] = useState('');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [hideCompleted, setHideCompleted] = useState(false);
  
  const [budget, setBudget] = useState<number>(() => {
    const saved = localStorage.getItem('shoppingBudget');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const budgetInputRef = useRef<HTMLInputElement>(null);

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(CATEGORIES[7]);
  const [showInput, setShowInput] = useState(false);
  const isAutoCategoryEnabled = useRef(true);

  const [filterCategory, setFilterCategory] = useState<string>('Semua');
  const [sortOrder, setSortOrder] = useState<SortOption>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [scannedItems, setScannedItems] = useState<ParsedItem[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const [currentTheme, setCurrentTheme] = useState<Theme>(getSavedTheme());
  const [uiMode, setUiMode] = useState<UIMode>(getSavedUIMode());
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and React to Theme/Mode Changes
  useEffect(() => {
    applyTheme(currentTheme);
    applyUIMode(uiMode);
  }, [currentTheme, uiMode]);

  useEffect(() => {
    const unsubscribe = subscribeToItems((fetchedItems) => {
      setItems(fetchedItems);
    });
    return () => unsubscribe();
  }, []);

  const showFeedback = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const toggleUiMode = () => {
    let nextMode: UIMode = 'light';
    if (uiMode === 'light') nextMode = 'dark';
    else if (uiMode === 'dark') nextMode = 'system';
    else if (uiMode === 'system') nextMode = 'light';
    
    setUiMode(nextMode);
    const label = nextMode === 'system' ? 'Mode Sistem' : nextMode === 'dark' ? 'Mode Gelap' : 'Mode Terang';
    showFeedback(`Beralih ke ${label}`, 'info');
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setLoadingState('saving');
    try {
      await addItemToFirebase(newItemName, newItemCategory, Number(newItemPrice) || 0);
      showFeedback(`${newItemName} ditambah!`);
      setNewItemName('');
      setNewItemPrice('');
      setShowInput(false);
    } catch (e) {
      showFeedback("Gagal menyimpan", "error");
    } finally {
      setLoadingState('idle');
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm("PERINGATAN: Hapus seluruh daftar belanja selamanya?")) {
      setLoadingState('saving');
      try {
        await deleteAllItemsFromFirebase();
        showFeedback("Seluruh daftar telah dihapus permanen", "info");
      } catch (e) {
        showFeedback("Gagal menghapus daftar", "error");
      } finally {
        setLoadingState('idle');
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingState('scanning');
    setLoadingMsg('AI sedang membaca...');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        // Explicitly cast result of parseShoppingListImage to ParsedItem[]
        // This fixes Error in App.tsx: Property 'length' does not exist on type 'unknown'.
        const parsed: ParsedItem[] = await parseShoppingListImage(base64String);
        if (parsed && parsed.length > 0) {
          setScannedItems(parsed);
          setShowReviewModal(true);
        } else {
          showFeedback("Tidak ada barang terbaca", "error");
        }
      } catch (err) {
        showFeedback("Gagal memproses gambar", "error");
      } finally {
        setLoadingState('idle');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // Rendering logic
  const totalCost = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const filteredItems = items.filter(item => {
    const matchesCategory = filterCategory === 'Semua' || item.category === filterCategory;
    const matchesCompletion = !hideCompleted || !item.isChecked;
    return matchesCategory && matchesCompletion;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    const cat = item.category || 'Lainnya';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <div className="min-h-screen bg-app flex flex-col md:max-w-md md:mx-auto shadow-2xl overflow-hidden relative transition-colors duration-300">
      
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[90%] pointer-events-none flex flex-col items-center">
        {toasts.map(t => <Toast key={t.id} toast={t} onClose={removeToast} />)}
      </div>

      <header className="bg-primary pt-10 pb-20 px-6 rounded-b-[2.5rem] shadow-lg shadow-primary/30 relative z-10 transition-all duration-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">BelanjaPintar</h1>
            <p className="text-white/80 text-xs mt-1 font-medium">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          
          <div className="flex gap-2 items-center">
             <button onClick={toggleUiMode} className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-full backdrop-blur-sm transition-all shadow-sm active:scale-90 relative">
               {uiMode === 'light' ? <SunIcon /> : uiMode === 'dark' ? <MoonIcon /> : <SparklesSmallIcon />}
               {uiMode === 'system' && <span className="absolute -top-1 -right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>}
             </button>
             <button onClick={() => setShowThemeSelector(true)} className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-full backdrop-blur-sm transition-all shadow-sm active:scale-90">
               <PaletteIcon />
             </button>
             <button onClick={handleDeleteAll} className="bg-rose-500/90 hover:bg-rose-600 text-white p-2.5 rounded-full backdrop-blur-sm transition-all shadow-sm active:scale-90" title="Hapus Permanen Semua">
               <DangerIcon />
             </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white border border-white/20 mb-4 shadow-inner">
            <div className="flex justify-between items-center mb-2">
                <span className="text-white/90 text-[11px] font-bold uppercase tracking-wider">Anggaran</span>
                <button onClick={() => setIsEditingBudget(true)} className="text-[11px] font-bold text-white/80 hover:text-white underline">Ubah</button>
            </div>
            <div className="text-2xl font-bold mb-2">
                {isEditingBudget ? (
                    <input ref={budgetInputRef} type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} onBlur={() => setIsEditingBudget(false)} className="bg-transparent border-b border-white/50 w-full focus:outline-none" autoFocus />
                ) : formatRupiah(budget)}
            </div>
            <div className="flex justify-between items-end border-t border-white/20 pt-2 mt-2 text-xs font-bold">
                <div><span>Total: </span>{formatRupiah(totalCost)}</div>
                <div className={budget - totalCost < 0 ? 'text-rose-300' : ''}><span>Sisa: </span>{formatRupiah(budget - totalCost)}</div>
            </div>
        </div>
      </header>

      <main className="flex-1 px-4 -mt-10 pb-28 relative z-20 overflow-y-auto modern-scrollbar">
        {showInput && (
          <form onSubmit={handleManualSubmit} className="bg-surface p-5 rounded-2xl shadow-xl mb-6 animate-fade-in-down border border-border-strong">
            <input type="text" placeholder="Nama barang..." className="w-full bg-transparent border-b border-border-strong py-2 outline-none focus:border-primary mb-4 text-main" value={newItemName} onChange={e => setNewItemName(e.target.value)} autoFocus />
            <div className="flex gap-4 mb-4">
               <input type="number" placeholder="Harga..." className="w-1/2 bg-transparent border-b border-border-strong py-2 outline-none focus:border-primary text-main" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} />
               <select className="w-1/2 bg-surface-alt rounded p-2 text-xs text-main border-none outline-none" value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)}>
                 {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowInput(false)} className="px-4 py-2 text-muted text-sm font-bold">Batal</button>
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg">Simpan</button>
            </div>
          </form>
        )}

        <div className="flex gap-2 mb-4 overflow-x-auto pb-3 sticky top-0 bg-app/90 backdrop-blur-sm z-30 pt-2 -mx-4 px-4 transition-colors">
          <button onClick={() => setFilterCategory('Semua')} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterCategory === 'Semua' ? 'bg-primary text-white' : 'bg-surface text-muted border border-border-strong'}`}>Semua</button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilterCategory(cat)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterCategory === cat ? 'bg-primary text-white' : 'bg-surface text-muted border border-border-strong'}`}>{cat}</button>
          ))}
        </div>

        {items.length === 0 ? <EmptyState /> : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, catItems]) => (
              <div key={category} className="bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden">
                <div className="bg-surface-alt/50 px-4 py-2 border-b border-border-subtle flex justify-between items-center text-[10px] font-black uppercase text-muted">
                  <span>{category}</span>
                  <span>{catItems.length} item</span>
                </div>
                <ul className="divide-y divide-border-subtle">
                  {catItems.map(item => (
                    <ShoppingItemRow key={item.id} item={item} onToggle={toggleItemStatus} onUpdateName={updateItemName} onUpdatePrice={updateItemPrice} onDelete={deleteItemFromFirebase} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center items-end pointer-events-none md:max-w-md md:mx-auto z-30">
        <div className="flex gap-4 pointer-events-auto bg-surface/90 backdrop-blur-xl p-3 rounded-full shadow-2xl border border-border-strong transition-colors">
          <button onClick={() => setShowInput(true)} className="h-12 w-12 bg-surface-alt text-muted rounded-full flex items-center justify-center border border-border-strong"><PlusIcon /></button>
          <button onClick={() => fileInputRef.current?.click()} className="relative h-16 w-16 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-surface -mt-8"><SparklesIcon /></button>
          <button onClick={() => setHideCompleted(!hideCompleted)} className={`h-12 w-12 rounded-full flex items-center justify-center border ${hideCompleted ? 'bg-primary text-white border-primary' : 'bg-surface-alt text-muted border-border-strong'}`}>{hideCompleted ? <EyeOffIcon /> : <EyeIcon />}</button>
          <input type="file" accept="image/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
        </div>
      </div>

      {loadingState !== 'idle' && <LoadingOverlay message={loadingMsg || 'Memproses...'} />}
      {showThemeSelector && <ThemeSelector currentTheme={currentTheme} onSelect={setCurrentTheme} onClose={() => setShowThemeSelector(false)} />}
      {/* Fix for Error in App.tsx: Property 'map' does not exist on type 'unknown'. 
          Adding explicit type to 'items' parameter in the callback. */}
      {showReviewModal && <ScanResultModal items={scannedItems} onSave={async (items: ParsedItem[]) => { await addMultipleItems(items.map(i => ({ name: i.item, category: i.category, price: i.price }))); setShowReviewModal(false); showFeedback(`Berhasil menyimpan ${items.length} item`); }} onCancel={() => setShowReviewModal(false)} />}
    </div>
  );
}
