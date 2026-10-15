import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Truck, CreditCard, ArrowRight, Sparkles, MapPin, Phone, User } from 'lucide-react';

export const CheckoutModal = ({
  isOpen,
  onClose,
  items = [],
  totalAmount = 0,
  totalSavings = 0,
  onOrderComplete,
  userProfile = {
    name: 'Monika',
    phone: '+91 94421 89234',
    address: 'No. 42, Maruthamalai Main Road, Vadavalli',
    city: 'Coimbatore, Tamil Nadu',
    pincode: '641041',
  },
  onUpdateProfile,
}) => {
  const [step, setStep] = useState('checkout'); // 'checkout' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi' | 'card'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Lock background scrolling and handle escape key when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setStep('checkout');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `AO-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsSubmitting(false);
      setStep('success');
      if (onOrderComplete) onOrderComplete();
    }, 900);
  };

  const handleClose = () => {
    setStep('checkout');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-2.5 sm:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Order Checkout"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Centered Modal Card with Strict Viewport Height Bounds */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-none border border-stone-300 shadow-2xl z-10 transition-all text-stone-900 flex flex-col max-h-[92vh] sm:max-h-[86vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'checkout' ? (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Header (Fixed) */}
            <div className="p-4 sm:p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between flex-none">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-800 block">
                  Direct From Organic Ghani
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-stone-950 m-0 font-qafine">
                  Complete Your Order
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close Checkout"
                className="w-9 h-9 rounded-none bg-white border border-stone-200 hover:border-stone-900 text-stone-600 hover:text-stone-950 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-2" />
              </button>
            </div>

            {/* Scrollable Form Body: NO SCROLLBAR, SMOOTH TOUCH SCROLL */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar overscroll-contain p-4 sm:p-6 space-y-5">
                  {/* Delivery Address Section (Editable in Real Time) */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-950 mb-3 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>1. Delivery Address</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-stone-500 text-[11px] mb-1 font-medium">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={userProfile?.name || ''}
                          onChange={(e) =>
                            onUpdateProfile &&
                            onUpdateProfile({ ...userProfile, name: e.target.value })
                          }
                          placeholder="Enter your name"
                          className="w-full px-3 py-2.5 rounded-none border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-500 text-[11px] mb-1 font-medium">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={userProfile?.phone || ''}
                          onChange={(e) =>
                            onUpdateProfile &&
                            onUpdateProfile({ ...userProfile, phone: e.target.value })
                          }
                          placeholder="Enter phone number"
                          className="w-full px-3 py-2.5 rounded-none border border-stone-300 bg-white text-stone-900 text-xs font-chomage focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-stone-500 text-[11px] mb-1 font-medium">
                          Street Address / House No.
                        </label>
                        <input
                          type="text"
                          required
                          value={userProfile?.address || ''}
                          onChange={(e) =>
                            onUpdateProfile &&
                            onUpdateProfile({ ...userProfile, address: e.target.value })
                          }
                          placeholder="Door no., street name, locality"
                          className="w-full px-3 py-2.5 rounded-none border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-500 text-[11px] mb-1 font-medium">
                          City, State
                        </label>
                        <input
                          type="text"
                          required
                          value={userProfile?.city || ''}
                          onChange={(e) =>
                            onUpdateProfile &&
                            onUpdateProfile({ ...userProfile, city: e.target.value })
                          }
                          placeholder="City, State"
                          className="w-full px-3 py-2.5 rounded-none border border-stone-300 bg-white text-stone-900 text-xs focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-500 text-[11px] mb-1 font-medium">
                          Pincode
                        </label>
                        <input
                          type="text"
                          required
                          value={userProfile?.pincode || ''}
                          onChange={(e) =>
                            onUpdateProfile &&
                            onUpdateProfile({ ...userProfile, pincode: e.target.value })
                          }
                          placeholder="Pincode"
                          className="w-full px-3 py-2.5 rounded-none border border-stone-300 bg-white text-stone-900 text-xs font-chomage focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Section */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-950 mb-3 flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                      <span>2. Payment Method</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'cod', title: 'Cash on Delivery', desc: 'Pay when oil arrives' },
                        { id: 'upi', title: 'UPI / QR Code', desc: 'GPay, PhonePe, Paytm' },
                        { id: 'card', title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                      ].map((method) => {
                        const isSelected = paymentMethod === method.id;
                        return (
                          <div
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`p-3 rounded-none border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-stone-950 bg-stone-50 ring-1 ring-stone-950'
                                : 'border-stone-200 bg-white hover:border-stone-400'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-stone-950">
                                {method.title}
                              </span>
                              <div
                                className={`w-3.5 h-3.5 rounded-none border flex items-center justify-center ${
                                  isSelected
                                    ? 'border-stone-950 bg-stone-950 text-white'
                                    : 'border-stone-300'
                                }`}
                              >
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-3" />}
                              </div>
                            </div>
                            <p className="text-[10px] text-stone-500 m-0">{method.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items Overview */}
                  <div className="pt-2 border-t border-stone-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-950 mb-2">
                      Order Summary ({(items || []).length} items)
                    </h4>
                    <div className="space-y-2">
                      {(items || []).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-xs text-stone-600"
                        >
                          <span className="truncate max-w-[280px]">
                            {item.title} × {item.quantity} ({item.unit})
                          </span>
                          <span className="font-chomage font-bold text-stone-900">
                            ₹{item.discountedPrice * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-4 bg-stone-50 border border-stone-200 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal</span>
                      <span className="font-chomage font-bold">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-emerald-600" />
                        Cold-Press Express Delivery
                      </span>
                      <span className="text-emerald-700 font-bold uppercase text-[10px]">
                        FREE
                      </span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Total Farm Savings</span>
                        <span className="font-chomage font-bold">₹{totalSavings}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                      <span>Total Amount Payable</span>
                      <span className="font-chomage text-xl text-stone-950 font-bold">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

            {/* Footer Action (Neat, Balanced Single-Line on Mobile) */}
            <div className="p-3.5 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 flex-none">
              <div className="flex items-center gap-1.5 text-xs text-stone-600 min-w-0">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-none" />
                <span className="text-[11px] font-medium tracking-tight whitespace-nowrap">
                  100% Secure Checkout
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 sm:px-8 py-3 sm:py-3.5 rounded-none bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                <span>{isSubmitting ? 'Confirming...' : 'Place Order'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-2" />
              </button>
            </div>
          </form>
        ) : (
          /* Order Success View */
          <div className="p-6 sm:p-10 text-center space-y-5 overflow-y-auto no-scrollbar max-h-[85vh]">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-none bg-stone-950 text-white mx-auto flex items-center justify-center shadow-lg animate-in zoom-in-75 duration-300">
              <Check className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5] text-amber-300" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-1">
                Order Successfully Placed
              </span>
              <h3 className="text-2xl sm:text-3xl font-normal text-stone-950 font-qafine m-0">
                Thank You, {userProfile?.name || 'Monika'}!
              </h3>
              <p className="text-xs text-stone-500 mt-2 max-w-md mx-auto leading-relaxed">
                Your order <span className="font-bold text-stone-900 font-chomage">#{orderId}</span> has been confirmed. Fresh cold-pressed harvest will be bottled and dispatched directly to your doorstep.
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery Address:</span>
                <span className="font-semibold text-stone-900 text-right truncate max-w-[200px]">
                  {userProfile?.address || ''}, {userProfile?.city || ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment:</span>
                <span className="font-semibold uppercase text-stone-900">
                  {paymentMethod === 'cod' ? 'Cash On Delivery' : paymentMethod.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Estimated Delivery:</span>
                <span className="font-semibold text-emerald-700">Tomorrow by 4:00 PM</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-8 py-3.5 rounded-none bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
