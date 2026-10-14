import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer = ({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );
  const totalSavings = items.reduce(
    (sum, item) => sum + (item.originalPrice - item.discountedPrice) * item.quantity,
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <aside className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200 rounded-none">
          {/* Header (Boxy Square Architectural Design) */}
          <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-none bg-stone-950 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 stroke-2" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-normal text-stone-950 m-0 font-qafine">
                  Your Bag
                </h2>
                <p className="text-xs text-stone-500 m-0">
                  {items.length} {items.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="w-9 h-9 rounded-none bg-white border border-stone-200 hover:border-stone-900 text-stone-600 hover:text-stone-950 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-2" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 py-16">
                <ShoppingBag className="w-12 h-12 stroke-1 mb-3 text-stone-300" />
                <p className="font-semibold text-sm text-stone-900">Your bag is empty</p>
                <p className="text-xs mt-1 max-w-xs text-stone-500">
                  Click the "Add" button on any cold-pressed oil card to begin your order.
                </p>
              </div>
            ) : (
              items.map((item) => {
                const isPng = item.image && item.image.endsWith('.png');
                return (
                  <div
                    key={item.id}
                    className="p-3 sm:p-3.5 rounded-none bg-white border border-stone-200 hover:border-stone-900 transition-colors flex items-center gap-3.5"
                  >
                    <div className="w-16 h-16 rounded-none bg-[#f8f7f4] border border-stone-100 flex items-center justify-center flex-none p-1 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className={`w-full h-full ${
                          isPng ? 'object-contain' : 'object-cover'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-normal text-stone-950 truncate m-0 font-qafine">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {item.unit} • <span className="font-chomage font-bold text-stone-900">₹{item.discountedPrice}</span>
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        {/* Boxy Quantity Selector */}
                        <div className="flex items-center border border-stone-300 bg-white rounded-none">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.title}`}
                            className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-950 hover:bg-stone-100 cursor-pointer transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-stone-950 font-chomage">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.title}`}
                            className="w-7 h-7 flex items-center justify-center text-stone-600 hover:text-stone-950 hover:bg-stone-100 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.title} from cart`}
                          className="text-stone-400 hover:text-red-600 p-1.5 text-xs ml-auto transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Summary and Working Proceed to Checkout Button */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Total Savings</span>
                <span className="text-emerald-700 font-semibold font-chomage">₹{totalSavings}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-950">
                <span>Subtotal</span>
                <span className="font-chomage text-xl font-bold">₹{subtotal}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Taxes and standard delivery calculated at checkout.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onProceedToCheckout) {
                    onProceedToCheckout();
                  }
                }}
                className="w-full py-3.5 rounded-none bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs tracking-wider uppercase shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
