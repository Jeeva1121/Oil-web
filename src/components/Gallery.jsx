import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  {
    title: 'Cold-Pressed Sunflower Oil',
    spec: 'Single Farm Sunflower Press',
    image: '/products/sunflower-oil.png',
  },
  {
    title: 'Wood-Pressed Sesame Oil',
    spec: 'Traditional Mortar Churned',
    image: '/products/sesame-oil.png',
  },
  {
    title: 'Vedic Pure Buffalo Ghee',
    spec: 'Bilona Churned A2 Curd',
    image: '/products/buffalo-ghee.png',
  },
  {
    title: 'Organic Castor Oil',
    spec: 'Hexane-Free Cold Extraction',
    image: '/products/castor-oil.png',
  },
];

export const Gallery = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const titleBlockRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      // 1. Tag, Title and Subtitle Sequential GSAP Entrance Animation
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: titleBlockRef.current,
          start: 'top 85%',
          once: true,
        },
      });

      headerTl
        .fromTo(
          tagRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        )
        .fromTo(
          titleRef.current,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.35'
        )
        .fromTo(
          subtitleRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.45'
        );

      // 2. Gallery Cards Stagger and Parallax Image Zoom
      const cards = gsap.utils.toArray('.gallery-card');

      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: trackRef.current,
            start: 'top 80%',
          },
        }
      );

      cards.forEach((card) => {
        const img = card.querySelector('img');
        const overlay = card.querySelector('.gallery-overlay');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          img,
          { scale: 1.15, yPercent: -6 },
          { scale: 1.0, yPercent: 6, ease: 'none' }
        );

        if (overlay) {
          tl.fromTo(
            overlay,
            { opacity: 0.75, y: 10 },
            { opacity: 1, y: 0, ease: 'none' },
            0
          );
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="gallery"
      className="relative w-full py-24 md:py-32 bg-stone-100/60 border-b border-stone-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Block with GSAP Animations */}
        <div ref={titleBlockRef} className="text-center max-w-2xl mx-auto mb-16">
          <span
            ref={tagRef}
            className="text-xs font-semibold text-amber-700 tracking-widest uppercase mb-2 block"
          >
            Harvest Visuals
          </span>
          <h2
            ref={titleRef}
            className="text-3xl sm:text-5xl md:text-6xl font-normal text-stone-900 tracking-tight font-qafine"
          >
            The Pure Press Collection
          </h2>
          <p
            ref={subtitleRef}
            className="text-sm sm:text-base text-stone-600 mt-3 font-normal leading-relaxed"
          >
            Each batch is slow-churned from fresh crop harvests with zero blending and zero dilution.
          </p>
        </div>

        {/* Curated 4-Card Editorial Grid */}
        <div
          ref={trackRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
        >
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="gallery-card group relative rounded-none overflow-hidden border border-stone-200 hover:border-stone-900 bg-white shadow-xs hover:shadow-xl transition-all duration-300 aspect-16/10"
            >
              <div className="w-full h-full overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform-gpu will-change-transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Editorial Gradient Overlay */}
              <div className="gallery-overlay absolute inset-0 bg-linear-to-t from-stone-950/85 via-stone-950/20 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
                  {item.spec}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white m-0">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
