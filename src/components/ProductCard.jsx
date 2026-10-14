import React, { useRef, useEffect } from 'react';
import { Heart, Plus, Star } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ProductCard = ({
  product,
  index,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  registerCardRefs,
}) => {
  const cardRef = useRef(null);
  const badgeRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const starsContainerRef = useRef(null);
  const starRefs = useRef([]);
  const strikePriceRef = useRef(null);
  const finalPriceRef = useRef(null);
  const heartBtnRef = useRef(null);
  const plusBtnRef = useRef(null);
  const ratingNumRef = useRef(null);
  const priceNumRef = useRef(null);

  // Register refs for parent entrance coordination
  useEffect(() => {
    if (registerCardRefs) {
      registerCardRefs(index, {
        card: cardRef.current,
        badge: badgeRef.current,
        image: imageRef.current,
        title: titleRef.current,
        stars: starRefs.current.filter(Boolean),
        strikePrice: strikePriceRef.current,
        finalPrice: finalPriceRef.current,
        heartBtn: heartBtnRef.current,
        plusBtn: plusBtnRef.current,
      });
    }
  }, [index, registerCardRefs]);

  const reviewNumRef = useRef(null);
  const strikeNumRef = useRef(null);

  // GSAP Animated Number Count-Up for ALL numbers on scroll
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const statsObj = {
      rating: 0,
      reviews: 0,
      price: Math.round(product.discountedPrice * 0.4),
      strike: Math.round(product.originalPrice * 0.4),
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardEl,
        start: 'top 94%',
        once: true,
      },
    });

    if (ratingNumRef.current) {
      tl.to(
        statsObj,
        {
          rating: product.rating,
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => {
            if (ratingNumRef.current) {
              ratingNumRef.current.textContent = statsObj.rating.toFixed(1);
            }
          },
        },
        0.1
      );
    }

    if (reviewNumRef.current) {
      tl.to(
        statsObj,
        {
          reviews: product.reviewCount,
          duration: 1.2,
          ease: 'power2.out',
          roundProps: 'reviews',
          onUpdate: () => {
            if (reviewNumRef.current) {
              reviewNumRef.current.textContent = `(${Math.round(statsObj.reviews)})`;
            }
          },
        },
        0.15
      );
    }

    if (priceNumRef.current) {
      tl.to(
        statsObj,
        {
          price: product.discountedPrice,
          duration: 1.0,
          ease: 'power2.out',
          roundProps: 'price',
          onUpdate: () => {
            if (priceNumRef.current) {
              priceNumRef.current.textContent = `₹${Math.round(statsObj.price)}`;
            }
          },
        },
        0.2
      );
    }

    if (strikeNumRef.current) {
      tl.to(
        statsObj,
        {
          strike: product.originalPrice,
          duration: 1.0,
          ease: 'power2.out',
          roundProps: 'strike',
          onUpdate: () => {
            if (strikeNumRef.current) {
              strikeNumRef.current.textContent = `₹${Math.round(statsObj.strike)}`;
            }
          },
        },
        0.25
      );
    }

    return () => {
      tl.kill();
    };
  }, [product.rating, product.reviewCount, product.discountedPrice, product.originalPrice]);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) onToggleWishlist(product.id);
  };

  const handlePlusClick = (e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product, plusBtnRef.current);
  };

  const isBottleProduct = product.image.endsWith('.png');

  return (
    <article
      ref={cardRef}
      id={`product-card-${product.id}`}
      tabIndex={0}
      className="carousel-snap-item relative flex-none w-[270px] sm:w-[290px] md:w-[310px] rounded-none bg-white border border-stone-200 hover:border-stone-900 transition-all duration-300 hover:shadow-lg cursor-pointer group flex flex-col justify-between"
      style={{
        marginRight: '1.5rem',
      }}
      aria-label={`${product.fullName}, now ₹${product.discountedPrice}, was ₹${product.originalPrice}`}
    >
      {/* Top Banner Area with Boxy Badge and Square Wishlist */}
      <div className="relative p-3 pb-0 z-10 flex items-center justify-between">
        {/* Boxy Discount Badge */}
        <div
          ref={badgeRef}
          className="px-2.5 py-1 rounded-none bg-stone-950 text-white font-chomage text-xs tracking-wider uppercase shadow-xs"
        >
          {product.discount}
        </div>

        {/* Boxy Square Wishlist Heart Button */}
        <button
          ref={heartBtnRef}
          type="button"
          onClick={handleHeartClick}
          aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          className="w-8 h-8 rounded-none bg-white border border-stone-200 hover:border-stone-900 flex items-center justify-center text-stone-500 hover:text-red-600 transition-colors shadow-xs active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-red-600 text-red-600' : 'fill-none stroke-current'
            }`}
          />
        </button>
      </div>

      {/* Product Image Section: Boxy Luxury Editorial Frame */}
      <figure className="relative mx-3 my-2 h-[230px] sm:h-[250px] rounded-none bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden p-0">
        <img
          ref={imageRef}
          src={product.image}
          alt={product.fullName}
          loading="lazy"
          className="h-full w-full object-cover object-center rounded-none transform-gpu group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Boxy Tag */}
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-none bg-white/95 text-[10px] font-semibold uppercase tracking-wider text-stone-700 border border-stone-200 shadow-xs">
          {product.badgeTag || product.category}
        </span>
      </figure>

      {/* Card Content & Details (Boxy & Luxury Editorial Typography) */}
      <div className="p-4 pt-1 flex-1 flex flex-col justify-between">
        <header className="mb-2">
          {/* Category breadcrumb */}
          <p className="text-[10px] uppercase tracking-widest font-semibold text-stone-500 mb-1">
            {product.category}
          </p>

          {/* Product Title (Luxury Qafine Serif) */}
          <h3
            ref={titleRef}
            className="font-qafine text-xl sm:text-2xl font-normal text-stone-950 line-clamp-1 leading-snug group-hover:text-amber-800 transition-colors"
          >
            {product.title}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
            {product.fullName} • {product.unit}
          </p>
        </header>

        {/* Rating Block with Stars & GSAP Animated Number */}
        <div
          ref={starsContainerRef}
          className="flex items-center gap-1.5 my-1.5"
          aria-label={`Rating: ${product.rating} out of 5 stars`}
        >
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, starIdx) => {
              const isFilled = starIdx < Math.floor(product.rating);
              return (
                <span
                  key={starIdx}
                  ref={(el) => {
                    starRefs.current[starIdx] = el;
                  }}
                  className="inline-block"
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isFilled
                        ? 'fill-amber-500 text-amber-500'
                        : 'fill-transparent text-stone-300'
                    }`}
                  />
                </span>
              );
            })}
          </div>
          {/* GSAP Rolling Rating Number */}
          <span
            ref={ratingNumRef}
            className="text-xs font-semibold text-stone-900 w-6 font-chomage"
          >
            0.0
          </span>
          <span ref={reviewNumRef} className="text-[11px] text-stone-400 font-chomage">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price Row and Boxy Add-To-Cart Action */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-1">
          <div>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-medium">Price</span>
            <div className="flex items-baseline gap-2">
              {/* GSAP Animated Final Price */}
              <span
                ref={priceNumRef}
                className="text-xl sm:text-2xl font-bold text-stone-950 font-chomage tracking-wide"
              >
                ₹{product.discountedPrice}
              </span>
              <del
                ref={strikeNumRef}
                className="text-xs text-stone-400 line-through font-chomage"
              >
                ₹{product.originalPrice}
              </del>
            </div>
          </div>

          {/* Boxy Square Add-to-Cart Action Button */}
          <button
            ref={plusBtnRef}
            type="button"
            onClick={handlePlusClick}
            aria-label={`Add ${product.title} to Cart`}
            className="px-3.5 py-2 rounded-none bg-stone-950 hover:bg-stone-800 text-white flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer font-medium text-xs uppercase tracking-wider"
          >
            <span>Add</span>
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </article>
  );
};
