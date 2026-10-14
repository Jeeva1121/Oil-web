import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HERO_SLIDES = [
  {
    id: 'groundnut',
    name: 'GROUNDNUT',
    bottle: '/hero/peanut-bottle-swirl.png',
    tl: '/peanuts/peanut-tl.png',
    tr: '/peanuts/peanut-tr.png',
    bl: '/peanuts/peanut-bl.png',
    br: '/peanuts/peanut-br-complete.png',
    tag: 'Traditional Kolhu',
    desc: 'Native Saurashtra Peanuts • Cold-Pressed',
    ctaText: 'Explore Groundnut Oil',
    scaleBoost: '',
  },
  {
    id: 'sunflower',
    name: 'SUNFLOWER',
    bottle: '/hero/sunflower-bottle-swirl.png',
    tl: '/sunflower/sunflower-tl.png',
    tr: '/sunflower/sunflower-tr.png',
    bl: '/sunflower/sunflower-bl.png',
    br: '/sunflower/sunflower-br.png',
    tag: 'Sunrefined Purity',
    desc: 'Cold-Pressed Below 45°C • Natural Vitamin E',
    ctaText: 'Explore Sunflower Oil',
    // Very slight increase in size of sunflower side elements as requested
    scaleBoost: 'scale-[1.24]',
  },
  {
    id: 'sesame',
    name: 'SESAME',
    bottle: '/sesame/sesame-bottle.png',
    // New Sesame Seeds from user's image copy 9.png
    tl: '/sesame/sesame-tl.png',
    tr: '/sesame/sesame-tr.png',
    bl: '/sesame/sesame-bl.png',
    br: '/sesame/sesame-br.png',
    tag: 'Mara Chekku',
    desc: 'Stone-Pressed with Palm Jaggery • Rich Amber Body',
    ctaText: 'Explore Sesame Oil',
    // Very slight reduction of sesame side seeds
    scaleBoost: 'scale-[0.85]',
  },
  {
    id: 'castor',
    name: 'CASTOR OIL',
    bottle: '/castor/castor-bottle.png',
    tl: '/castor/castor-tl.png',
    tr: '/castor/castor-tr.png',
    bl: '/castor/castor-bl.png',
    br: '/castor/castor-br.png',
    tag: 'Cold-Drawn Purity',
    desc: 'Organic Gujarat Seeds • Golden Viscous Press',
    ctaText: 'Explore Castor Oil',
    // Very slight reduction of castor side seeds
    scaleBoost: 'scale-[0.85]',
  },
];

export const Hero = ({ onExplore }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const containerRef = useRef(null);
  const bigTextRef = useRef(null);

  // Level 1: Outer Anchors (Controlled ONLY by ScrollTrigger)
  const bottleAnchorRef = useRef(null);
  const cornerTLAnchorRef = useRef(null);
  const cornerTRAnchorRef = useRef(null);
  const cornerBLAnchorRef = useRef(null);
  const cornerBRAnchorRef = useRef(null);
  const bottomBarRef = useRef(null);

  // Level 2: Float & Parallax Containers (Controlled ONLY by continuous idle loops & mousemove)
  const bottleFloatRef = useRef(null);
  const bottleShadowRef = useRef(null);
  const cornerTLFloatRef = useRef(null);
  const cornerTRFloatRef = useRef(null);
  const cornerBLFloatRef = useRef(null);
  const cornerBRFloatRef = useRef(null);

  // Automatic slide rotation every 4 seconds (4000ms) with zero transform collision
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // GSAP: Continuous Organic Float Loops + Extended Cross-Page Scroll Scrub
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      // 1. Level 2: Continuous organic idle floating loops (Never interrupted by slide changes)
      gsap.to(cornerTLFloatRef.current, {
        y: '+=12',
        rotate: '+=5',
        repeat: -1,
        yoyo: true,
        duration: 3.5,
        ease: 'sine.inOut',
      });

      gsap.to(cornerTRFloatRef.current, {
        y: '-=14',
        rotate: '-=6',
        repeat: -1,
        yoyo: true,
        duration: 3.9,
        ease: 'sine.inOut',
      });

      gsap.to(cornerBLFloatRef.current, {
        y: '+=10',
        rotate: '-=4',
        repeat: -1,
        yoyo: true,
        duration: 3.7,
        ease: 'sine.inOut',
      });

      gsap.to(cornerBRFloatRef.current, {
        y: '-=12',
        rotate: '+=5',
        repeat: -1,
        yoyo: true,
        duration: 4.1,
        ease: 'sine.inOut',
      });

      // 2. Level 1: Scroll Scrub (Extends past hero into the next page)
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=140%', // Extends past hero into next section
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // Top-Left corner flies up and outward to left
      scrollTl.to(
        cornerTLAnchorRef.current,
        {
          x: -300,
          y: -260,
          scale: 0.55,
          rotate: -70,
          opacity: 0,
          ease: 'power1.inOut',
        },
        0
      );

      // Top-Right corner flies up and outward to right
      scrollTl.to(
        cornerTRAnchorRef.current,
        {
          x: 320,
          y: -260,
          scale: 0.55,
          rotate: 80,
          opacity: 0,
          ease: 'power1.inOut',
        },
        0
      );

      // Bottom-Left corner flies downward and outward, extending into the next section!
      scrollTl.to(
        cornerBLAnchorRef.current,
        {
          x: -280,
          y: 480, // Crosses the fold into next page
          scale: 0.68,
          rotate: 65,
          opacity: 0,
          ease: 'power1.inOut',
        },
        0
      );

      // Bottom-Right corner flies downward and outward, extending into the next section!
      scrollTl.to(
        cornerBRAnchorRef.current,
        {
          x: 300,
          y: 500, // Crosses the fold into next page
          scale: 0.68,
          rotate: -65,
          opacity: 0,
          ease: 'power1.inOut',
        },
        0
      );

      // Central Bottle fades earlier so it never overlaps the cards of the next section
      scrollTl.to(
        bottleAnchorRef.current,
        {
          y: 65,
          scale: 0.92,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.in',
        },
        0
      );

      scrollTl.to(
        bottleShadowRef.current,
        {
          scale: 0.5,
          opacity: 0,
          duration: 0.55,
          ease: 'power2.in',
        },
        0
      );

      // Big Typography fades
      scrollTl.to(
        bigTextRef.current,
        {
          scale: 1.15,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.in',
        },
        0
      );

      // Bottom Bar fades down
      scrollTl.to(
        bottomBarRef.current,
        {
          y: 35,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
        },
        0
      );
    },
    { scope: containerRef }
  );

  // Smooth Mousemove 3D Parallax on Level 2 Float Container (rAF throttled to eliminate lag)
  const mouseRafRef = useRef(null);
  const handleMouseMove = (e) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    if (mouseRafRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    mouseRafRef.current = requestAnimationFrame(() => {
      mouseRafRef.current = null;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // If hero is scrolled out of view, don't waste GPU cycles
      if (rect.bottom < 0) return;

      const xRatio = (clientX - rect.left) / rect.width - 0.5;
      const yRatio = (clientY - rect.top) / rect.height - 0.5;

      gsap.to(bottleFloatRef.current, {
        x: xRatio * 18,
        y: yRatio * 12,
        rotateY: xRatio * 8,
        rotateX: -yRatio * 8,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(bottleShadowRef.current, {
        x: xRatio * 14,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(cornerTLFloatRef.current, {
        x: xRatio * -28,
        y: yRatio * -24,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(cornerTRFloatRef.current, {
        x: xRatio * 32,
        y: yRatio * -20,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(cornerBLFloatRef.current, {
        x: xRatio * -24,
        y: yRatio * 28,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(cornerBRFloatRef.current, {
        x: xRatio * 28,
        y: yRatio * 32,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  };

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section
      ref={containerRef}
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen overflow-x-clip overflow-y-visible text-white flex flex-col justify-between pt-24 px-6 sm:px-12 select-none bg-stone-950 z-10"
    >
      {/* Background: Sunlit Kitchen Table Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/hero-bg.jpg"
          alt="Warm Kitchen Table Background"
          className="w-full h-full object-cover object-bottom sm:object-center filter brightness-[0.94] contrast-[1.04]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-stone-950/75 via-stone-950/20 to-stone-950/45 pointer-events-none" />
      </div>

      {/* Giant Typography Behind The Bottle (Pre-mounted crossfade per slide, using Vagnola font) */}
      <div
        ref={bigTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 will-change-transform"
      >
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = activeSlide === idx;
          return (
            <h1
              key={slide.id}
              className={`absolute inset-0 flex items-center justify-center font-vagnola text-[8.4vw] sm:text-[8vw] font-normal uppercase tracking-[0.08em] text-white/55 leading-none m-0 text-center select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] transition-all duration-700 ease-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              {slide.name}
            </h1>
          );
        })}
      </div>

      {/* 4 Corner Floating Elements: 3-Layer Composited Architecture for 100% Glitch-Free Transitions */}

      {/* 1. TOP-LEFT */}
      <div
        ref={cornerTLAnchorRef}
        className="absolute top-[18%] sm:top-[17%] left-[3%] sm:left-[8%] w-24 sm:w-40 md:w-48 pointer-events-none z-20 will-change-transform"
      >
        <div ref={cornerTLFloatRef} className="w-full h-auto relative will-change-transform">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = activeSlide === idx;
            return (
              <div
                key={slide.id}
                className={`transition-all duration-700 ease-out will-change-transform ${
                  isActive
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-90 pointer-events-none absolute inset-0'
                }`}
              >
                <img
                  src={slide.tl}
                  alt=""
                  className={`w-full h-auto object-contain -rotate-12 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)] ${slide.scaleBoost || ''}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. TOP-RIGHT */}
      <div
        ref={cornerTRAnchorRef}
        className="absolute top-[17%] sm:top-[16%] right-[3%] sm:right-[8%] w-26 sm:w-44 md:w-52 pointer-events-none z-20 will-change-transform"
      >
        <div ref={cornerTRFloatRef} className="w-full h-auto relative will-change-transform">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = activeSlide === idx;
            return (
              <div
                key={slide.id}
                className={`transition-all duration-700 ease-out will-change-transform ${
                  isActive
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-90 pointer-events-none absolute inset-0'
                }`}
              >
                <img
                  src={slide.tr}
                  alt=""
                  className={`w-full h-auto object-contain rotate-12 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)] ${slide.scaleBoost || ''}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. BOTTOM-LEFT */}
      <div
        ref={cornerBLAnchorRef}
        className="absolute bottom-[20%] sm:bottom-[19%] left-[3%] sm:left-[7%] w-26 sm:w-44 md:w-52 pointer-events-none z-20 will-change-transform"
      >
        <div ref={cornerBLFloatRef} className="w-full h-auto relative will-change-transform">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = activeSlide === idx;
            return (
              <div
                key={slide.id}
                className={`transition-all duration-700 ease-out will-change-transform ${
                  isActive
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-90 pointer-events-none absolute inset-0'
                }`}
              >
                <img
                  src={slide.bl}
                  alt=""
                  className={`w-full h-auto object-contain -rotate-6 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)] ${slide.scaleBoost || ''}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. BOTTOM-RIGHT */}
      <div
        ref={cornerBRAnchorRef}
        className="absolute bottom-[18%] sm:bottom-[17%] right-[3%] sm:right-[7%] w-26 sm:w-44 md:w-52 pointer-events-none z-20 will-change-transform"
      >
        <div ref={cornerBRFloatRef} className="w-full h-auto relative will-change-transform">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = activeSlide === idx;
            return (
              <div
                key={slide.id}
                className={`transition-all duration-700 ease-out will-change-transform ${
                  isActive
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-90 pointer-events-none absolute inset-0'
                }`}
              >
                <img
                  src={slide.br}
                  alt=""
                  className={`w-full h-auto object-contain rotate-12 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)] ${slide.scaleBoost || ''}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Center: Oil Bottle Standing on Wooden Table with Glitch-Free Pre-Mounted Crossfade */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25">
        <div
          ref={bottleAnchorRef}
          className="relative h-[54vh] sm:h-[74vh] max-h-[700px] w-full max-w-[460px] sm:max-w-[540px] flex items-center justify-center will-change-transform"
        >
          {/* Table Contact Shadow */}
          <div
            ref={bottleShadowRef}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-44 sm:w-56 h-6 bg-black/60 rounded-full blur-md pointer-events-none"
          />

          <div
            ref={bottleFloatRef}
            className="relative w-full h-full flex items-center justify-center will-change-transform"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = activeSlide === idx;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out will-change-transform ${
                    isActive
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 translate-y-3 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.bottle}
                    alt={`ARSHITH Cold Pressed ${slide.name}`}
                    className="h-full w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)]"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Spacer */}
      <div className="w-full h-4" />

      {/* Bottom Bar: Clean CTA Button (Clean, uncluttered, no overlapping boxes) */}
      <div
        ref={bottomBarRef}
        className="w-full max-w-7xl mx-auto flex items-center justify-center sm:justify-start pb-5 sm:pb-8 z-30 will-change-transform"
      >
        <button
          type="button"
          onClick={onExplore}
          className="w-full sm:w-auto px-8 py-3.5 rounded-none bg-white text-stone-950 hover:bg-stone-100 hover:text-stone-950 text-xs font-semibold tracking-wider uppercase transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 group font-qafine border border-white"
        >
          <span className="text-sm tracking-widest">{currentSlide.ctaText}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
};
