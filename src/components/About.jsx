import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ShoppingBag, Sparkles, Thermometer, SunMedium, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const About = ({ onAddToCart }) => {
  const sectionRef = useRef(null);
  const bottleRef = useRef(null);
  const bottleShadowRef = useRef(null);
  const bigTextRef = useRef(null);

  // 4 Corner Sunflower Blooms & Splashes (Framing strictly the bottle)
  const flowerTLRef = useRef(null);
  const flowerTRRef = useRef(null);
  const flowerBLRef = useRef(null);
  const flowerBRRef = useRef(null);

  const textBlockRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const cardsRef = useRef(null);
  const actionBarRef = useRef(null);

  // Number Counter Refs for GSAP
  const tempNumRef = useRef(null);
  const purityNumRef = useRef(null);
  const hexanesNumRef = useRef(null);

  // GSAP Number Counters Animation on Scroll
  useEffect(() => {
    const secEl = sectionRef.current;
    if (!secEl) return;

    const statsObj = { temp: 0, purity: 0, hexanes: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardsRef.current || secEl,
        start: 'top 85%',
        once: true,
      },
    });

    tl.to(
      statsObj,
      {
        temp: 45,
        purity: 100,
        hexanes: 0,
        duration: 1.5,
        ease: 'power2.out',
        roundProps: 'temp,purity,hexanes',
        onUpdate: () => {
          if (tempNumRef.current) tempNumRef.current.textContent = `${Math.round(statsObj.temp)}°C`;
          if (purityNumRef.current) purityNumRef.current.textContent = `${Math.round(statsObj.purity)}%`;
          if (hexanesNumRef.current) hexanesNumRef.current.textContent = `${Math.round(statsObj.hexanes)}%`;
        },
      },
      0.2
    );

    return () => {
      tl.kill();
    };
  }, []);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      // 1. Text entrance animation timeline on scroll into view
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: textBlockRef.current,
          start: 'top 82%',
          once: true,
        },
      });

      textTl
        .fromTo(
          tagRef.current,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        )
        .fromTo(
          titleRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.35'
        )
        .fromTo(
          descRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.45'
        )
        .fromTo(
          cardsRef.current?.children || [],
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.16, duration: 0.75, ease: 'power3.out' },
          '-=0.35'
        )
        .fromTo(
          actionBarRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        );

      // 2. Continuous Scroll Scrub strictly constrained around the bottle stage
      // (NEVER pushing blooms into the right column!)
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // Top-Left Flower floats subtly upward and leftward
      scrubTl.fromTo(
        flowerTLRef.current,
        { x: -10, y: 10, scale: 0.9, rotate: -8 },
        { x: -45, y: -50, scale: 1.05, rotate: 6, ease: 'none' },
        0
      );

      // Top-Right Flower floats subtly upward - CLAMPED so it NEVER touches text!
      scrubTl.fromTo(
        flowerTRRef.current,
        { x: 0, y: 10, scale: 0.9, rotate: 8 },
        { x: 25, y: -45, scale: 1.04, rotate: -6, ease: 'none' },
        0
      );

      // Bottom-Left Flower floats subtly downward and leftward
      scrubTl.fromTo(
        flowerBLRef.current,
        { x: -10, y: -10, scale: 0.9, rotate: 6 },
        { x: -40, y: 45, scale: 1.05, rotate: -10, ease: 'none' },
        0
      );

      // Bottom-Right Flower floats subtly downward - CLAMPED so it NEVER touches cards or button!
      scrubTl.fromTo(
        flowerBRRef.current,
        { x: 0, y: -10, scale: 0.9, rotate: -6 },
        { x: 20, y: 45, scale: 1.04, rotate: 8, ease: 'none' },
        0
      );

      // Central Sunflower Bottle subtle vertical parallax
      scrubTl.fromTo(
        bottleRef.current,
        { y: 35, scale: 0.96 },
        { y: -30, scale: 1.02, ease: 'none' },
        0
      );

      // Background giant text subtle scrub
      scrubTl.fromTo(
        bigTextRef.current,
        { y: 20, scale: 0.96 },
        { y: -20, scale: 1.06, ease: 'none' },
        0
      );

      // Gentle floating loops for corner flowers
      gsap.to(flowerTLRef.current, {
        y: '+=8',
        rotate: '+=3',
        repeat: -1,
        yoyo: true,
        duration: 3.5,
        ease: 'sine.inOut',
      });
      gsap.to(flowerTRRef.current, {
        y: '-=10',
        rotate: '-=4',
        repeat: -1,
        yoyo: true,
        duration: 4.0,
        ease: 'sine.inOut',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full py-20 md:py-28 bg-[#fdfcf9] border-b border-stone-200 overflow-hidden"
      aria-label="Sunflower Oil Feature"
    >
      {/* Background Subtle Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span
          ref={bigTextRef}
          className="text-[14vw] font-bold uppercase tracking-tight text-stone-200/40 leading-none font-vagnola"
        >
          SUNFLOWER
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Visual Stage with Sunflower Bottle and 4 Corner Blooms Tightly Contained */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[540px]">
            {/* Contained Centered Stage: The blooms are positioned relative to this 380px wrapper so they NEVER cross into column 6! */}
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] h-[440px] sm:h-[500px] flex items-center justify-center">
              {/* 4 Floating Corner Sunflower Blooms & Golden Splashes (image copy.png) */}

              {/* Top-Left Bloom */}
              <div
                ref={flowerTLRef}
                className="absolute -top-4 -left-10 sm:-top-2 sm:-left-12 w-32 sm:w-44 pointer-events-none z-10 transform-gpu will-change-transform filter drop-shadow-[0_12px_24px_rgba(217,119,6,0.18)]"
              >
                <img
                  src="/sunflower/sunflower-tl.png"
                  alt="Sunflower with Golden Oil Splash"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Top-Right Bloom (Positioned securely so it NEVER overlaps right column text) */}
              <div
                ref={flowerTRRef}
                className="absolute -top-6 -right-6 sm:-top-4 sm:-right-8 w-28 sm:w-38 pointer-events-none z-10 transform-gpu will-change-transform filter drop-shadow-[0_12px_24px_rgba(217,119,6,0.18)]"
              >
                <img
                  src="/sunflower/sunflower-tr.png"
                  alt="Sunflower with Golden Oil Splash"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Bottom-Left Bloom */}
              <div
                ref={flowerBLRef}
                className="absolute -bottom-6 -left-10 sm:-bottom-4 sm:-left-12 w-32 sm:w-44 pointer-events-none z-10 transform-gpu will-change-transform filter drop-shadow-[0_12px_24px_rgba(217,119,6,0.18)]"
              >
                <img
                  src="/sunflower/sunflower-bl.png"
                  alt="Sunflower with Golden Oil Splash"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Bottom-Right Bloom (Positioned safely inside stage, never covers text or CTA) */}
              <div
                ref={flowerBRRef}
                className="absolute -bottom-6 -right-6 sm:-bottom-4 sm:-right-8 w-28 sm:w-38 pointer-events-none z-10 transform-gpu will-change-transform filter drop-shadow-[0_12px_24px_rgba(217,119,6,0.18)]"
              >
                <img
                  src="/sunflower/sunflower-br.png"
                  alt="Sunflower with Golden Oil Splash"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Center Stage: The Sunflower Bottle (image.png) */}
              <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
                {/* Soft Ground Contact Shadow */}
                <div
                  ref={bottleShadowRef}
                  className="absolute bottom-2 w-36 sm:w-44 h-5 bg-amber-950/20 rounded-none blur-md"
                />

                <div
                  ref={bottleRef}
                  className="relative h-[380px] sm:h-[450px] flex items-center justify-center transform-gpu will-change-transform"
                >
                  <img
                    src="/sunflower/sunflower-bottle.png"
                    alt="ARSHITH Cold Pressed Sunflower Oil"
                    className="h-full w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.2)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Editorial Presentation with Boxy Square Architectural Geometry */}
          <div ref={textBlockRef} className="lg:col-span-6 space-y-6">
            <div>
              <span
                ref={tagRef}
                className="text-xs font-semibold text-amber-800 tracking-widest uppercase mb-2 block font-vagnola"
              >
                Sunrefined Purity
              </span>
              <h2
                ref={titleRef}
                className="text-3xl sm:text-4xl md:text-5xl font-normal text-stone-950 tracking-tight leading-tight font-qafine"
              >
                Golden Clarity. <br />
                <span className="text-amber-700 font-normal">Cold-Pressed Under Sun.</span>
              </h2>
            </div>

            <p ref={descRef} className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              Freshly harvested seeds from generational organic farms are crushed at ambient room temperature in traditional wooden mortars. Never treated with chemical hexanes or industrial deodorizers.
            </p>

            {/* Artisanal Quality Points: Boxy Square Architectural Panels with GSAP Numbers */}
            <div ref={cardsRef} className="space-y-3 pt-2">
              {/* Feature 1: Wood Mortar Pressing */}
              <div className="p-4 sm:p-5 rounded-none bg-white border border-stone-200 hover:border-stone-900 transition-colors shadow-xs flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-amber-700 flex-none" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950 font-sans">
                      Wood Mortar Pressing
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Slow churn below 45°C retains natural Vitamin E and vibrant nutty aroma.
                  </p>
                </div>
                <div className="text-right flex-none pl-4 border-l border-stone-100">
                  <span
                    ref={tempNumRef}
                    className="font-chomage text-2xl sm:text-3xl font-bold text-stone-950 block leading-none"
                  >
                    45°C
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 block mt-1">
                    Unheated
                  </span>
                </div>
              </div>

              {/* Feature 2: Natural Sun Sedimentation */}
              <div className="p-4 sm:p-5 rounded-none bg-white border border-stone-200 hover:border-stone-900 transition-colors shadow-xs flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <SunMedium className="w-4 h-4 text-amber-700 flex-none" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950 font-sans">
                      Natural Sun Sedimentation
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Settled naturally under sunlight, gravity-filtered through fine woven cotton.
                  </p>
                </div>
                <div className="text-right flex-none pl-4 border-l border-stone-100">
                  <span
                    ref={purityNumRef}
                    className="font-chomage text-2xl sm:text-3xl font-bold text-stone-950 block leading-none"
                  >
                    100%
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 block mt-1">
                    Purity
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar (Boxy Square Architectural Styling) */}
            <div ref={actionBarRef} className="pt-4 flex items-center gap-6">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">Standard Pack</span>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl sm:text-3xl font-bold text-stone-950 font-chomage">₹320</p>
                  <span className="text-xs text-stone-500">/ 1 Litre</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onAddToCart) {
                    onAddToCart({
                      id: 'sunflower-oil',
                      title: 'Sunflower Oil',
                      discountedPrice: 320,
                      originalPrice: 420,
                      image: '/sunflower/sunflower-bottle.png',
                      unit: '1 Litre',
                    });
                  }
                }}
                className="px-7 py-3.5 rounded-none bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 stroke-2" />
                <span>Add To Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
