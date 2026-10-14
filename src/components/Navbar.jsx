import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, User, Menu, X, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products';

export const Navbar = ({
  cartCount = 0,
  onOpenCart,
  onOpenSearch,
  onAddToCart,
  cartTargetRef,
  userProfile = {
    name: 'Monika',
    phone: '+91 94421 89234',
    address: 'No. 42, Maruthamalai Main Road, Vadavalli',
    city: 'Coimbatore, Tamil Nadu',
    pincode: '641041',
  },
  onUpdateProfile,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [inlineQuery, setInlineQuery] = useState('');
  const [isInlineSearchFocused, setIsInlineSearchFocused] = useState(false);

  const lastScrollY = useRef(0);
  const accountRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Auto-hide navbar on scroll down, show on scroll up (smoother, eliminates lag)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 30);

          if (currentScrollY <= 40) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY.current + 6) {
            // Scrolling down -> hide navbar
            setIsVisible(false);
            setIsAccountOpen(false);
            setIsInlineSearchFocused(false);
          } else if (currentScrollY < lastScrollY.current - 6) {
            // Scrolling up -> show navbar
            setIsVisible(true);
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account & search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsInlineSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const navLinks = [
    { name: 'Our Oils', href: '#favorites' },
    { name: 'Heritage', href: '#about' },
    { name: 'Process', href: '#showcase' },
    { name: 'Harvest', href: '#gallery' },
  ];

  const handleNavigate = (e, targetHref) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetEl = document.querySelector(targetHref);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Inline search results
  const matchingProducts = inlineQuery.trim()
    ? INITIAL_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(inlineQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(inlineQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out will-change-transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        className={`w-full transition-colors duration-200 border-b border-white/10 ${
          scrolled ? 'bg-stone-950/95 shadow-xl py-2.5 sm:py-3' : 'bg-stone-950/80 py-3 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Official Brand Logo from image copy 10.png */}
          <div className="flex items-center gap-6">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (window.location.hash) {
                  window.history.replaceState(null, '', window.location.pathname);
                }
              }}
              className="flex items-center group cursor-pointer select-none"
              aria-label="ARSHITH Organics Home"
            >
              <img
                src="/brand-logo-transparent.png"
                alt="ARSHITH Organics"
                className="h-9 sm:h-10 w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 ml-2" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavigate(e, link.href)}
                  className="text-xs font-medium tracking-widest uppercase text-white/80 hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400 hover:after:w-full after:transition-all cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Right Action Controls: Small Search Icon Near Profile, Bag, and Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Small Search Icon Button (Positioned right near profile for both web view & mobile) */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search Pure Oils and Spices"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-none bg-stone-900 border border-white/20 hover:border-white text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 group"
              title="Search products (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-stone-300 group-hover:text-white transition-colors" />
            </button>

            {/* User Account / Profile Popover (Strictly Real-Time, Black & White Mode, Zero AI Slop, Zero Dots) */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                aria-label={`User Account for ${userProfile?.name || 'Monika'}`}
                className="hidden sm:flex h-9 px-2 sm:px-2.5 rounded-none bg-stone-900 border border-white/20 hover:border-white text-white items-center gap-2 transition-all cursor-pointer active:scale-95 group"
                title={`Account: ${userProfile?.name || 'Monika'}`}
              >
                <div className="w-5 h-5 rounded-none bg-white text-stone-950 font-bold text-[11px] flex items-center justify-center font-chomage">
                  {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <span className="text-xs font-medium text-white/90 group-hover:text-white transition-colors">
                  {userProfile?.name || 'Monika'}
                </span>
              </button>

              {/* Minimalist White & Black Mode Account Popover (Real-Time Editable, Zero Dots, Zero AI Buzzwords) */}
              {isAccountOpen && (
                <div className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-auto sm:mt-3 w-80 sm:w-88 max-w-[calc(100vw-2rem)] rounded-none bg-white text-stone-950 border border-stone-300 shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3.5 border-b border-stone-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-none bg-stone-950 text-white flex items-center justify-center font-bold text-sm font-chomage">
                        {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'M'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-950 m-0">
                          {userProfile?.name || 'Monika'}
                        </h4>
                        <p className="text-[11px] text-stone-500 m-0">
                          {userProfile?.city || 'Coimbatore, Tamil Nadu'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAccountOpen(false)}
                      className="text-stone-400 hover:text-stone-950 p-1 cursor-pointer transition-colors"
                      aria-label="Close Profile"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Real-Time Editable Customer Inputs */}
                  <div className="py-3.5 space-y-3 text-xs border-b border-stone-200">
                    <div>
                      <label className="block text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={userProfile?.name || ''}
                        onChange={(e) =>
                          onUpdateProfile && onUpdateProfile({ ...userProfile, name: e.target.value })
                        }
                        placeholder="Monika"
                        className="w-full px-3 py-2 rounded-none bg-stone-50 border border-stone-300 text-stone-950 text-xs focus:bg-white focus:border-stone-950 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={userProfile?.phone || ''}
                        onChange={(e) =>
                          onUpdateProfile && onUpdateProfile({ ...userProfile, phone: e.target.value })
                        }
                        placeholder="+91 94421 89234"
                        className="w-full px-3 py-2 rounded-none bg-stone-50 border border-stone-300 text-stone-950 text-xs font-chomage focus:bg-white focus:border-stone-950 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-1">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={userProfile?.address || ''}
                        onChange={(e) =>
                          onUpdateProfile && onUpdateProfile({ ...userProfile, address: e.target.value })
                        }
                        placeholder="No. 42, Maruthamalai Main Road, Vadavalli"
                        className="w-full px-3 py-2 rounded-none bg-stone-50 border border-stone-300 text-stone-950 text-xs focus:bg-white focus:border-stone-950 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={userProfile?.city || ''}
                          onChange={(e) =>
                            onUpdateProfile && onUpdateProfile({ ...userProfile, city: e.target.value })
                          }
                          placeholder="Coimbatore"
                          className="w-full px-3 py-2 rounded-none bg-stone-50 border border-stone-300 text-stone-950 text-xs focus:bg-white focus:border-stone-950 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={userProfile?.pincode || ''}
                          onChange={(e) =>
                            onUpdateProfile && onUpdateProfile({ ...userProfile, pincode: e.target.value })
                          }
                          placeholder="641041"
                          className="w-full px-3 py-2 rounded-none bg-stone-50 border border-stone-300 text-stone-950 text-xs font-chomage focus:bg-white focus:border-stone-950 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      Coimbatore, Tamil Nadu
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAccountOpen(false)}
                      className="px-4 py-1.5 rounded-none bg-stone-950 hover:bg-stone-800 text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bag Button with Item Count */}
            <button
              ref={cartTargetRef}
              type="button"
              onClick={onOpenCart}
              aria-label={`Open Bag (${cartCount} items)`}
              className="h-9 px-3 sm:px-4 rounded-none bg-white text-stone-950 hover:bg-stone-100 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 border border-white"
            >
              <ShoppingBag className="w-4 h-4 stroke-2" />
              <span className="text-xs font-bold tracking-wider uppercase">Bag</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-none bg-stone-950 text-white text-[11px] font-bold font-chomage">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="lg:hidden w-9 h-9 rounded-none bg-stone-900 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Full Responsiveness) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-white/20 px-5 py-5 space-y-4 shadow-2xl">
          {/* Real-time Customer Profile Inside Mobile Drawer */}
          <div className="p-3 bg-stone-900 border border-white/15 rounded-none flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-none bg-white text-stone-950 font-bold text-xs flex items-center justify-center font-chomage flex-none">
                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-white truncate m-0">
                  {userProfile?.name || 'Monika'}
                </p>
                <p className="text-[11px] text-stone-400 truncate m-0 font-chomage">
                  {userProfile?.city || 'Coimbatore'} • {userProfile?.phone || '+91 94421 89234'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAccountOpen(true);
              }}
              className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white text-stone-200 hover:text-stone-950 border border-white/20 transition-colors flex-none cursor-pointer"
            >
              Edit
            </button>
          </div>

          {/* Mobile Search Bar inside menu */}
          <div className="w-full flex items-center px-3 py-2 rounded-none bg-stone-900 border border-white/20 text-xs">
            <Search className="w-4 h-4 text-stone-400 mr-2 flex-none" />
            <input
              type="text"
              placeholder="Search all pure cold-pressed oils..."
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSearch();
              }}
              readOnly
              className="w-full bg-transparent text-white placeholder-stone-400 text-xs cursor-pointer focus:outline-none"
            />
          </div>

          <nav className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavigate(e, link.href)}
                className="text-sm font-medium tracking-widest uppercase text-white/90 hover:text-amber-400 py-1.5 border-b border-white/10 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{link.name}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
            <span>Direct from Organic Farms</span>
            <span className="text-amber-400 font-semibold">100% Raw & Unrefined</span>
          </div>
        </div>
      )}
    </header>
  );
};
