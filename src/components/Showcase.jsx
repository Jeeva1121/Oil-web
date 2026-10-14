import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ShoppingBag } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SHOWCASE_SLIDES = [
  {
    id: 'guntur-chillies',
    title: 'Sun-Dried Guntur Chillies',
    step: '01 / Solar Cured',
    desc: 'Direct from Andhra farm yards. Earthen sun-curing preserves essential capsaicin, deep fiery heat, and bright crimson color with zero chemical polish.',
    price: 190,
    unit: '250g Whole Spices Pack',
    image: '/products/guntur-chillies.png',
  },
  {
    id: 'cinnamon',
    title: 'Authentic Ceylon Cinnamon',
    step: '02 / Hand-Rolled Quills',
    desc: 'Delicately rolled single-estate Ceylon cinnamon bark. Naturally sweet, fragrant multi-layer quills with ultra-low coumarin and soothing warmth.',
    price: 255,
    unit: '100g Glass Jar',
    image: '/products/cinnamon.png',
  },
  {
    id: 'raisins',
    title: 'Golden Long Raisins',
    step: '03 / Shade-Dried Kishmish',
    desc: 'Hand-picked from Sangli vineyards and shade-dried naturally. Juicy, sun-ripened long golden raisins with 100% natural fruit sweetness and zero sulfur.',
    price: 210,
    unit: '500g Fresh Pack',
    image: '/products/raisins.png',
  },
];

export const Showcase = ({ onAddToCart }) => {
  const containerRef = useRef(null);
  const slide1Ref = useRef(null);
  const slide2Ref = useRef(null);
  const slide3Ref = useRef(null);

  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const img3Ref = useRef(null);

  const content1Ref = useRef(null);
  const content2Ref = useRef(null);
  const content3Ref = useRef(null);

  const price1Ref = useRef(null);
  const price2Ref = useRef(null);
  const price3Ref = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Slide 1 zoom & price roll
      tl.fromTo(img1Ref.current, { scale: 1.03 }, { scale: 1, ease: 'none' }, 0);

      const priceObj1 = { val: 0 };
      gsap.to(priceObj1, {
        val: SHOWCASE_SLIDES[0].price,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          once: true,
        },
        onUpdate: () => {
          if (price1Ref.current) price1Ref.current.textContent = `₹${Math.round(priceObj1.val)}`;
        },
      });

      // Slide 2 full-screen curtain reveal over Slide 1
      tl.fromTo(
        slide2Ref.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power2.inOut',
          onStart: () => {
            const p2 = { val: 0 };
            gsap.to(p2, {
              val: SHOWCASE_SLIDES[1].price,
              duration: 0.9,
              ease: 'power2.out',
              onUpdate: () => {
                if (price2Ref.current) price2Ref.current.textContent = `₹${Math.round(p2.val)}`;
              },
            });
          },
        },
        0.5
      );
      tl.fromTo(img2Ref.current, { scale: 1.03 }, { scale: 1, ease: 'none' }, 0.5);
      tl.fromTo(content2Ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, 0.6);

      // Slide 3 full-screen curtain reveal over Slide 2
      tl.fromTo(
        slide3Ref.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power2.inOut',
          onStart: () => {
            const p3 = { val: 0 };
            gsap.to(p3, {
              val: SHOWCASE_SLIDES[2].price,
              duration: 0.9,
              ease: 'power2.out',
              onUpdate: () => {
                if (price3Ref.current) price3Ref.current.textContent = `₹${Math.round(p3.val)}`;
              },
            });
          },
        },
        1.2
      );
      tl.fromTo(img3Ref.current, { scale: 1.03 }, { scale: 1, ease: 'none' }, 1.2);
      tl.fromTo(content3Ref.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, 1.3);
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="showcase"
      className="relative w-full h-screen overflow-hidden bg-stone-950 text-white select-none"
      aria-label="Single-Origin Batches Showcase"
    >
      {/* SLIDE 1: Sun-Dried Guntur Chillies */}
      <div
        ref={slide1Ref}
        className="absolute inset-0 w-full h-full overflow-hidden z-10"
      >
        {/* Ambient Blurred Background to Fill the Screen Atmosphere */}
        <img
          src={SHOWCASE_SLIDES[0].image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-35 scale-110 pointer-events-none"
        />

        {/* Crisp Featured Packaging Scene (Uncropped on Mobile & Desktop) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            ref={img1Ref}
            src={SHOWCASE_SLIDES[0].image}
            alt={SHOWCASE_SLIDES[0].title}
            className="w-full h-full object-contain md:object-cover object-center filter brightness-[1.02] contrast-[1.02]"
          />
        </div>
        {/* Soft, Transparent Ambient Lighting */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Floating Content Over Background */}
        <div
          ref={content1Ref}
          className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-between py-24 sm:py-28 pointer-events-none"
        >
          {/* Header - Crystal Clear Radiant White */}
          <div className="pointer-events-auto">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-300 mb-1.5 block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Kinetic Showcase
            </span>
            <h2
              className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] font-qafine"
              style={{ color: '#ffffff' }}
            >
              Single-Origin Batches.
            </h2>
          </div>

          {/* Bottom Card Info Overlaid Directly on Background */}
          <div className="pointer-events-auto max-w-xl bg-stone-950/75 backdrop-blur-xl border border-white/20 rounded-none p-6 sm:p-8 space-y-3.5 shadow-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-300 block font-chomage">
              {SHOWCASE_SLIDES[0].step}
            </span>
            <h3
              className="text-2xl sm:text-4xl font-normal text-white tracking-tight drop-shadow-md font-qafine"
              style={{ color: '#ffffff' }}
            >
              {SHOWCASE_SLIDES[0].title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-100 leading-relaxed font-normal">
              {SHOWCASE_SLIDES[0].desc}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-white/15">
              <div>
                <span className="text-xs text-white/80 block">{SHOWCASE_SLIDES[0].unit}</span>
                <p ref={price1Ref} className="text-2xl font-bold text-amber-300 font-chomage">₹{SHOWCASE_SLIDES[0].price}</p>
              </div>
              <button
                type="button"
                onClick={() => onAddToCart(SHOWCASE_SLIDES[0])}
                className="px-6 py-3 rounded-none bg-white text-stone-950 hover:bg-stone-100 font-semibold text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2 border border-white"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDE 2: Authentic Ceylon Cinnamon */}
      <div
        ref={slide2Ref}
        className="absolute inset-0 w-full h-full overflow-hidden z-20"
        style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      >
        {/* Ambient Blurred Background to Fill the Screen Atmosphere */}
        <img
          src={SHOWCASE_SLIDES[1].image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-35 scale-110 pointer-events-none"
        />

        {/* Crisp Featured Packaging Scene (Uncropped on Mobile & Desktop) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            ref={img2Ref}
            src={SHOWCASE_SLIDES[1].image}
            alt={SHOWCASE_SLIDES[1].title}
            className="w-full h-full object-contain md:object-cover object-center filter brightness-[1.02] contrast-[1.02]"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        <div
          ref={content2Ref}
          className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-between py-24 sm:py-28 pointer-events-none"
        >
          <div className="pointer-events-auto">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-300 mb-1.5 block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Kinetic Showcase
            </span>
            <h2
              className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] font-qafine"
              style={{ color: '#ffffff' }}
            >
              Single-Origin Batches.
            </h2>
          </div>

          <div className="pointer-events-auto max-w-xl bg-stone-950/75 backdrop-blur-xl border border-white/20 rounded-none p-6 sm:p-8 space-y-3.5 shadow-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-300 block font-chomage">
              {SHOWCASE_SLIDES[1].step}
            </span>
            <h3
              className="text-2xl sm:text-4xl font-normal text-white tracking-tight drop-shadow-md font-qafine"
              style={{ color: '#ffffff' }}
            >
              {SHOWCASE_SLIDES[1].title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-100 leading-relaxed font-normal">
              {SHOWCASE_SLIDES[1].desc}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-white/15">
              <div>
                <span className="text-xs text-white/80 block">{SHOWCASE_SLIDES[1].unit}</span>
                <p ref={price2Ref} className="text-2xl font-bold text-amber-300 font-chomage">₹{SHOWCASE_SLIDES[1].price}</p>
              </div>
              <button
                type="button"
                onClick={() => onAddToCart(SHOWCASE_SLIDES[1])}
                className="px-6 py-3 rounded-none bg-white text-stone-950 hover:bg-stone-100 font-semibold text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2 border border-white"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDE 3: Golden Long Raisins */}
      <div
        ref={slide3Ref}
        className="absolute inset-0 w-full h-full overflow-hidden z-30"
        style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      >
        {/* Ambient Blurred Background to Fill the Screen Atmosphere */}
        <img
          src={SHOWCASE_SLIDES[2].image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-35 scale-110 pointer-events-none"
        />

        {/* Crisp Featured Packaging Scene (Uncropped on Mobile & Desktop) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            ref={img3Ref}
            src={SHOWCASE_SLIDES[2].image}
            alt={SHOWCASE_SLIDES[2].title}
            className="w-full h-full object-contain md:object-cover object-center filter brightness-[1.02] contrast-[1.02]"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        <div
          ref={content3Ref}
          className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-between py-24 sm:py-28 pointer-events-none"
        >
          <div className="pointer-events-auto">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-300 mb-1.5 block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Kinetic Showcase
            </span>
            <h2
              className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] font-qafine"
              style={{ color: '#ffffff' }}
            >
              Single-Origin Batches.
            </h2>
          </div>

          <div className="pointer-events-auto max-w-xl bg-stone-950/75 backdrop-blur-xl border border-white/20 rounded-none p-6 sm:p-8 space-y-3.5 shadow-2xl">
            <span className="text-xs font-semibold tracking-widest uppercase text-amber-300 block font-chomage">
              {SHOWCASE_SLIDES[2].step}
            </span>
            <h3
              className="text-2xl sm:text-4xl font-normal text-white tracking-tight drop-shadow-md font-qafine"
              style={{ color: '#ffffff' }}
            >
              {SHOWCASE_SLIDES[2].title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-100 leading-relaxed font-normal">
              {SHOWCASE_SLIDES[2].desc}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-white/15">
              <div>
                <span className="text-xs text-white/80 block">{SHOWCASE_SLIDES[2].unit}</span>
                <p ref={price3Ref} className="text-2xl font-bold text-amber-300 font-chomage">₹{SHOWCASE_SLIDES[2].price}</p>
              </div>
              <button
                type="button"
                onClick={() => onAddToCart(SHOWCASE_SLIDES[2])}
                className="px-6 py-3 rounded-none bg-white text-stone-950 hover:bg-stone-100 font-semibold text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2 border border-white"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
