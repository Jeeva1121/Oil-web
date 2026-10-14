import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { ProductCard } from './ProductCard';
import { INITIAL_PRODUCTS } from '../data/products';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const ProductCarousel = ({
  products = INITIAL_PRODUCTS,
  title = "Your Favorites",
  subtitle = "All in One Place",
  cartTargetRef,
  onAddToCart,
  onWishlistChange,
}) => {
  const [wishlist, setWishlist] = useState({});

  // References
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const headerRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const progressBarRef = useRef(null);
  const statPurityRef = useRef(null);
  const statTempRef = useRef(null);
  const statRatingRef = useRef(null);
  const statBottlesRef = useRef(null);

  // Map of references for each card (NO querySelectorAll)
  const cardsMapRef = useRef([]);

  // Callback to collect card & sub-element refs from children
  const registerCardRefs = useCallback((index, refs) => {
    cardsMapRef.current[index] = refs;
  }, []);

  // Toggle Wishlist
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const next = { ...prev, [product.id]: !prev[product.id] };
      if (onWishlistChange) onWishlistChange(product, next[product.id]);
      return next;
    });
  };

  // Add to cart with flying clone animation toward cart icon
  const handleAddToCart = (product, buttonEl) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check if cart target element exists and reduced motion is false
    if (buttonEl && cartTargetRef?.current && !prefersReducedMotion) {
      const btnRect = buttonEl.getBoundingClientRect();
      const cartRect = cartTargetRef.current.getBoundingClientRect();

      // Create floating clone element
      const clone = document.createElement('div');
      clone.className = 'fixed rounded-none z-50 flex items-center justify-center text-white pointer-events-none shadow-xl';
      clone.style.left = `${btnRect.left}px`;
      clone.style.top = `${btnRect.top}px`;
      clone.style.width = `${btnRect.width}px`;
      clone.style.height = `${btnRect.height}px`;
      clone.style.backgroundColor = 'var(--accent-brand)';
      clone.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
        </svg>
      `;

      document.body.appendChild(clone);

      const deltaX = (cartRect.left + cartRect.width / 2) - (btnRect.left + btnRect.width / 2);
      const deltaY = (cartRect.top + cartRect.height / 2) - (btnRect.top + btnRect.height / 2);

      // Animate clone flying to cart
      gsap.to(clone, {
        x: deltaX,
        y: deltaY,
        scale: 0.15,
        opacity: 0.2,
        duration: 0.65,
        ease: 'power3.in',
        onComplete: () => {
          clone.remove();
          // Bounce cart icon in target
          if (cartTargetRef.current) {
            gsap.fromTo(
              cartTargetRef.current,
              { scale: 1.4, rotate: 12 },
              { scale: 1, rotate: 0, duration: 0.45, ease: 'back.out(3)' }
            );
          }
          if (onAddToCart) onAddToCart(product);
        },
      });
    } else {
      // Fallback if no flying animation
      if (onAddToCart) onAddToCart(product);
    }
  };

  const progressTextRef = useRef(null);

  // Update Arrow Disabled States & Progress (rAF throttled, zero React re-render lag)
  const updateArrowAndProgress = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const progress = maxScroll > 0 ? (container.scrollLeft / maxScroll) * 100 : 0;
      
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${Math.max(12, progress)}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(progress)}%`;
      }

      const isAtStart = container.scrollLeft <= 8;
      const isAtEnd = container.scrollLeft >= maxScroll - 8;

      if (prevBtnRef.current) {
        prevBtnRef.current.style.opacity = isAtStart ? '0.35' : '1';
        prevBtnRef.current.style.pointerEvents = isAtStart ? 'none' : 'auto';
      }

      if (nextBtnRef.current) {
        nextBtnRef.current.style.opacity = isAtEnd ? '0.35' : '1';
        nextBtnRef.current.style.pointerEvents = isAtEnd ? 'none' : 'auto';
      }
    });
  }, []);

  // Arrow Click Navigation (Smooth GSAP ScrollTo)
  const handleScrollClick = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const btn = direction === 'left' ? prevBtnRef.current : nextBtnRef.current;
    if (btn) {
      // Arrow scale punch on click
      gsap.fromTo(
        btn,
        { scale: 0.86 },
        { scale: 1, duration: 0.32, ease: 'back.out(2)' }
      );
    }

    // Scroll by card width + 24px gap
    const cardStep = 320 + 24;
    const scrollDelta = container.clientWidth > 800 ? cardStep * 2 : cardStep;
    const targetX = direction === 'left'
      ? Math.max(0, container.scrollLeft - scrollDelta)
      : Math.min(container.scrollWidth - container.clientWidth, container.scrollLeft + scrollDelta);

    // Animate horizontal scroll position with ScrollToPlugin
    gsap.to(container, {
      scrollTo: { x: targetX },
      duration: 0.6,
      ease: 'power3.inOut',
      onUpdate: updateArrowAndProgress,
      onComplete: updateArrowAndProgress,
    });
  };

  // GSAP Entrance Animation with ScrollTrigger.batch()
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Header entrance animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );

        // GSAP Animated Rolling Numbers on Scroll for Section Metrics
        const numStats = { purity: 0, temp: 0, rating: 0, bottles: 0 };
        gsap.to(numStats, {
          purity: 100,
          temp: 45,
          rating: 4.9,
          bottles: 10000,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            if (statPurityRef.current) statPurityRef.current.textContent = `${Math.round(numStats.purity)}%`;
            if (statTempRef.current) statTempRef.current.textContent = `${Math.round(numStats.temp)}°C`;
            if (statRatingRef.current) statRatingRef.current.textContent = `${numStats.rating.toFixed(1)}★`;
            if (statBottlesRef.current) statBottlesRef.current.textContent = `${Math.round(numStats.bottles).toLocaleString()}+`;
          },
        });
      }

      // Collect card elements directly from cardsMapRef (NO querySelectorAll!)
      const cardElements = cardsMapRef.current.map((item) => item?.card).filter(Boolean);

      if (cardElements.length === 0) return;

      // ScrollTrigger.batch on the card elements
      ScrollTrigger.batch(cardElements, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          if (prefersReducedMotion) {
            // Accessible simple opacity fade fallback
            gsap.to(batch, { opacity: 1, duration: 0.4 });
            return;
          }

          // 1. Cards transitions coming from alternating left and right
          batch.forEach((cardEl, i) => {
            const cardIdx = cardElements.indexOf(cardEl);
            const fromX = cardIdx % 2 === 0 ? -90 : 90; // Even from left, odd from right
            gsap.fromTo(
              cardEl,
              { opacity: 0, x: fromX, scale: 0.94 },
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.75,
                delay: i * 0.07,
                ease: 'power3.out',
              }
            );
          });

          // 2. Coordinated sub-element entrance per card
          batch.forEach((cardEl, i) => {
            const cardIdx = cardElements.indexOf(cardEl);
            const refs = cardsMapRef.current[cardIdx];
            if (!refs) return;

            const baseDelay = i * 0.07;

            // Discount badge pops in with slight overshoot
            if (refs.badge) {
              gsap.fromTo(
                refs.badge,
                { scale: 0, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  delay: baseDelay + 0.1,
                  duration: 0.45,
                  ease: 'back.out(2)',
                }
              );
            }

            // Star rating: fill left-to-right with quick stagger (0.03s each)
            if (refs.stars && refs.stars.length > 0) {
              gsap.fromTo(
                refs.stars,
                { opacity: 0, scale: 0.5, rotate: -20 },
                {
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  delay: baseDelay + 0.16,
                  stagger: 0.03,
                  duration: 0.28,
                  ease: 'back.out(2)',
                }
              );
            }

            // Strikethrough original price fades in 0.1s before discounted price
            if (refs.strikePrice) {
              gsap.fromTo(
                refs.strikePrice,
                { opacity: 0, y: 6 },
                {
                  opacity: 1,
                  y: 0,
                  delay: baseDelay + 0.22,
                  duration: 0.3,
                  ease: 'power3.out',
                }
              );
            }

            // Price block ("From Rs. X") fades/slides up last in each card
            if (refs.finalPrice) {
              gsap.fromTo(
                refs.finalPrice,
                { opacity: 0, y: 10 },
                {
                  opacity: 1,
                  y: 0,
                  delay: baseDelay + 0.32,
                  duration: 0.35,
                  ease: 'power3.out',
                }
              );
            }
          });
        },
      });

      // Initialize arrow state
      updateArrowAndProgress();
    },
    { scope: sectionRef, dependencies: [products] }
  );

  // Scroll listener for arrows and progress track
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateArrowAndProgress, { passive: true });
    window.addEventListener('resize', updateArrowAndProgress);

    return () => {
      container.removeEventListener('scroll', updateArrowAndProgress);
      window.removeEventListener('resize', updateArrowAndProgress);
    };
  }, [updateArrowAndProgress]);

  return (
    <section
      ref={sectionRef}
      id="favorites"
      className="relative w-full py-16 md:py-24 px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden border-b border-[var(--border-subtle)]"
      aria-label="Favorites Product Carousel"
    >
      {/* Carousel Header Area */}
      <header
        ref={headerRef}
        className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
      >
        <div>
          <span className="text-xs font-bold text-[var(--accent-brand)] tracking-wider uppercase mb-1.5 block">
            Farm-Pressed Daily
          </span>

          {/* Section Main Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--text-main)] tracking-tight font-qafine">
            {title} <span className="text-[var(--text-muted)] font-normal font-sans">|</span>{' '}
            <span className="text-[var(--accent-brand)]">{subtitle}</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-1 max-w-2xl">
            Pure, unrefined cooking essentials extracted traditionally in wooden churners. Direct to your kitchen with zero preservatives.
          </p>
        </div>

        {/* Carousel Navigation Arrows (Boxy Square Architectural Buttons) */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            ref={prevBtnRef}
            type="button"
            onClick={() => handleScrollClick('left')}
            aria-label="Scroll previous favorites"
            className="w-11 h-11 rounded-none bg-white border border-stone-300 hover:border-stone-900 text-stone-900 flex items-center justify-center shadow-xs focus:outline-none transition-all cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <button
            ref={nextBtnRef}
            type="button"
            onClick={() => handleScrollClick('right')}
            aria-label="Scroll next favorites"
            className="w-11 h-11 rounded-none bg-white border border-stone-300 hover:border-stone-900 text-stone-900 flex items-center justify-center shadow-xs focus:outline-none transition-all cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </header>

      {/* GSAP Animated Farm Metrics (Numbers animate on scroll using Chomage font) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="p-3 sm:p-4 bg-white border border-stone-200 rounded-none text-left shadow-xs">
          <span ref={statPurityRef} className="font-chomage text-2xl sm:text-3xl font-bold text-stone-950 block leading-tight">
            100%
          </span>
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block mt-0.5">
            Raw & Unrefined
          </span>
        </div>
        <div className="p-3 sm:p-4 bg-white border border-stone-200 rounded-none text-left shadow-xs">
          <span ref={statTempRef} className="font-chomage text-2xl sm:text-3xl font-bold text-stone-950 block leading-tight">
            45°C
          </span>
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block mt-0.5">
            Cold-Press Limit
          </span>
        </div>
        <div className="p-3 sm:p-4 bg-white border border-stone-200 rounded-none text-left shadow-xs">
          <span ref={statRatingRef} className="font-chomage text-2xl sm:text-3xl font-bold text-stone-950 block leading-tight">
            4.9★
          </span>
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block mt-0.5">
            Customer Score
          </span>
        </div>
        <div className="p-3 sm:p-4 bg-white border border-stone-200 rounded-none text-left shadow-xs">
          <span ref={statBottlesRef} className="font-chomage text-2xl sm:text-3xl font-bold text-stone-950 block leading-tight">
            10,000+
          </span>
          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block mt-0.5">
            Litres Dispatched
          </span>
        </div>
      </div>

      {/* Horizontal Scroll Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="carousel-snap-container no-scrollbar flex items-stretch overflow-x-auto pb-6 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 focus:outline-none"
        tabIndex={0}
        role="region"
        aria-label="Horizontal list of favorite products"
      >
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            index={idx}
            isWishlisted={!!wishlist[product.id]}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            registerCardRefs={registerCardRefs}
          />
        ))}
      </div>

      {/* Progress Track Indicator (Boxy Square, 'Showing 10 farm-fresh staples' completely removed) */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <div className="w-32 sm:w-56 h-1 bg-stone-200 rounded-none overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-stone-950 rounded-none transition-all duration-75 ease-out"
            style={{ width: '12%' }}
          />
        </div>
        <span ref={progressTextRef} className="text-xs font-semibold text-stone-600 font-mono w-9 text-right">
          0%
        </span>
      </div>
    </section>
  );
};
