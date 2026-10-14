import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Plus, Check, ArrowRight } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products';

export const SearchModal = ({ isOpen, onClose, onAddToCart }) => {
  const [query, setQuery] = useState('');
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const inputRef = useRef(null);

  // Autofocus input when modal opens, handle Escape key & lock background body scroll
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  // Live filtered products
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INITIAL_PRODUCTS.slice(0, 5); // Show top 5 curated products by default
    return INITIAL_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.badgeTag && p.badgeTag.toLowerCase().includes(q))
    );
  }, [query]);

  const handleAdd = (product) => {
    if (onAddToCart) onAddToCart(product);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Search Pure Cold-Pressed Oils"
    >
      {/* Deep Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-start justify-center p-4 sm:p-6 md:p-12 pt-16 sm:pt-20">
        <div
          className="relative w-full max-w-2xl bg-white rounded-none border border-stone-300 shadow-2xl overflow-hidden z-10 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Input Bar (Boxy Square Architectural Styling) */}
          <div className="flex items-center px-4 sm:px-6 py-4 border-b border-stone-200 bg-stone-50">
            <Search className="w-5 h-5 text-stone-400 flex-none mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search groundnut, sunflower, sesame, ghee..."
              className="w-full bg-transparent text-stone-900 placeholder-stone-400 text-sm sm:text-base font-normal focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-stone-400 hover:text-stone-600 p-1 mr-2 cursor-pointer"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-none border border-stone-300 hover:border-stone-900 text-stone-600 hover:text-stone-950 text-xs uppercase tracking-wider font-mono cursor-pointer transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="px-4 sm:px-6 py-2.5 bg-[#faf8f5] border-b border-stone-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider flex-none">
              Popular:
            </span>
            {['Groundnut', 'Sunflower', 'Sesame', 'Castor', 'Ghee'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="px-2.5 py-0.5 rounded-none bg-white border border-stone-200 hover:border-stone-900 text-stone-700 hover:text-stone-950 text-xs transition-colors cursor-pointer flex-none"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results List with Hidden Scrollbar */}
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-stone-500">
                <Search className="w-10 h-10 stroke-1 text-stone-300 mx-auto mb-3" />
                <p className="font-medium text-stone-800 text-sm">No organic staples found</p>
                <p className="text-xs text-stone-400 mt-1">
                  Try searching for "groundnut", "sunflower", or "cold-pressed".
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => {
                const isRecentlyAdded = recentlyAddedId === product.id;
                const isPng = product.image.endsWith('.png');

                return (
                  <div
                    key={product.id}
                    className="p-3 sm:p-4 rounded-none bg-white border border-stone-200 hover:border-stone-900 transition-colors flex items-center justify-between gap-4 group"
                  >
                    {/* Thumbnail & Metadata */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-none bg-[#f8f7f4] border border-stone-100 flex items-center justify-center flex-none p-1.5 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.fullName}
                          className={`w-full h-full ${
                            isPng ? 'object-contain' : 'object-cover'
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                            {product.category}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-none bg-stone-100 text-stone-700 font-chomage">
                            {product.discount}
                          </span>
                        </div>
                        <h4 className="font-qafine text-base sm:text-lg text-stone-950 truncate m-0 group-hover:text-amber-800 transition-colors">
                          {product.title}
                        </h4>
                        <p className="text-xs text-stone-400 truncate">
                          {product.unit} • {product.fullName}
                        </p>
                      </div>
                    </div>

                    {/* Price and Add to Bag Action */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-none">
                      <div className="text-right">
                        <span className="font-chomage text-base sm:text-lg font-bold text-stone-950 block leading-tight">
                          ₹{product.discountedPrice}
                        </span>
                        <del className="text-[11px] text-stone-400 line-through font-chomage">
                          ₹{product.originalPrice}
                        </del>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdd(product)}
                        className={`px-3.5 py-2 rounded-none text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                          isRecentlyAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-950 hover:bg-stone-800 text-white'
                        }`}
                      >
                        {isRecentlyAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <span>Add</span>
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-4 sm:px-6 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>{filteredProducts.length} results matching</span>
            <span className="text-[11px] font-medium text-amber-800">
              100% Traditional Wooden Ghani Extraction
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
