import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCarousel } from './components/ProductCarousel';
import { Showcase } from './components/Showcase';
import { About } from './components/About';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { INITIAL_PRODUCTS } from './data/products';
import { Check, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);

  const [userProfile, setUserProfile] = useState({
    name: 'Monika',
    phone: '+91 94421 89234',
    address: 'No. 42, Maruthamalai Main Road, Vadavalli',
    city: 'Coimbatore, Tamil Nadu',
    pincode: '641041',
  });

  const progressBarRef = useRef(null);
  const cartTargetRef = useRef(null);
  const lenisRef = useRef(null);

  // Initialize Lenis smooth scroll and connect to GSAP ScrollTrigger
  useEffect(() => {
    // Clean window location hash on load/refresh so it never jumps to #hero, #favorites or other sections
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      syncTouch: true,
      syncTouchLerp: 0,
      touchMultiplier: 1.0,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(500, 33);

    // Global scroll progress indicator bar at the top
    const progressTween = gsap.to(progressBarRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(updateTicker);
      progressTween.kill();
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const showToast = (message, duration = 3000) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    showToast(`Added ${product.title} to your bag`);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const scrollToFavorites = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#favorites', { offset: -30 });
    } else {
      gsap.to(window, {
        scrollTo: { y: '#favorites', offsetY: 30 },
        duration: 0.8,
        ease: 'power3.inOut',
      });
    }
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cartItems.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );
  const totalCartSavings = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.discountedPrice) * item.quantity,
    0
  );

  return (
    <div className="relative min-h-screen bg-(--bg-canvas) text-(--text-body) selection:bg-(--accent-brand) selection:text-white">
      {/* Global Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-1 bg-white z-50 origin-left scale-x-0 pointer-events-none"
      />

      {/* Boxy Toast Notification with Auto-dismiss & Manual Close */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-none bg-stone-950 text-white border border-stone-800 shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="w-5 h-5 rounded-none bg-emerald-600 text-white flex items-center justify-center flex-none">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white p-0.5 ml-1 cursor-pointer transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Luxury Redesigned Navbar with Integrated Search & Real-Time Profile */}
      <Navbar
        cartCount={totalCartCount}
        cartTotal={totalCartAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onAddToCart={handleAddToCart}
        cartTargetRef={cartTargetRef}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
      />

      <main className="w-full">
        {/* Full-viewport Pinned Hero with Organic Multi-Product Rotation */}
        <Hero onExplore={scrollToFavorites} />

        {/* Favorites Horizontal Carousel with ScrollTrigger.batch and Boxy Aesthetic */}
        <ProductCarousel
          products={INITIAL_PRODUCTS}
          title="Your Favorites"
          subtitle="All in One Place"
          cartTargetRef={cartTargetRef}
          onAddToCart={handleAddToCart}
        />

        {/* Cinematic Pinned Showcase with Curtain Reveals */}
        <Showcase onAddToCart={handleAddToCart} />

        {/* Sunflower Feature Showcase with Boxy Panels & Rolling GSAP Numbers */}
        <About onAddToCart={handleAddToCart} />

        {/* Harvest Visuals Gallery with Scroll-Linked Image Zooms */}
        <Gallery />
      </main>

      {/* Clean Luxury Footer */}
      <Footer />

      {/* Boxy Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Workable Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Workable Interactive Checkout Flow */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems || []}
        totalAmount={totalCartAmount || 0}
        totalSavings={totalCartSavings || 0}
        userProfile={userProfile || {}}
        onUpdateProfile={setUserProfile}
        onOrderComplete={() => {
          setCartItems([]);
          showToast('Order confirmed! Cold-pressed harvest dispatched.', 3500);
        }}
      />
    </div>
  );
}

export default App;
