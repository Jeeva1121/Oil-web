# ARSHITH Organics — Pure Cold-Pressed Oils & Farm Staples

A modern, high-performance web experience for **ARSHITH Organics**, showcasing 100% pure, wood-pressed (Mara Chekku) oils and farm-fresh staples. Crafted with React, Tailwind CSS, Vite, Lenis smooth scrolling, and cinematic GSAP ScrollTrigger animations.

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.x or later recommended)
- `npm` or `yarn` / `pnpm`

### 1. Install Dependencies
In the project root directory, install all required packages:
```bash
npm install
```

### 2. Start the Development Server
Launch the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### 3. Build for Production
Create an optimized production bundle in the `dist/` directory:
```bash
npm run build
```

### 4. Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

---

## 🎨 Key Features & Architectural Highlights

- **Custom Architectural Typography**:
  - **Qafine** (`font-qafine`): Used for elegant luxury editorial headings.
  - **Vagnola** (`font-vagnola`): Used for bold, artisanal display titles.
  - **Chomage** (`font-chomage`): Dedicated luxury tabular typography applied to **all numbers, prices, percentage metrics, ratings, and countdown counters** across the entire website.
- **Real-Time Customer Account & Profile**:
  - Clean Black & White minimal aesthetic with zero AI fluff or pulsing slop dots.
  - Pre-configured with customer details (**Monika**, Coimbatore, Tamil Nadu) with instant real-time editing.
  - Hidden from the cramped mobile top bar and seamlessly integrated into the mobile drawer menu.
- **Search Modal UX**:
  - Global hotkey (`Ctrl + K` or `Cmd + K`) and dedicated search triggers.
  - **Background Scroll-Lock**: When search is active, the background webpage is locked from scrolling.
  - **Hidden Scrollbars** (`no-scrollbar`): Fluid scrolling through filtered items without intrusive browser scrollbars.
- **Interactive Bag & Real-time Checkout**:
  - Slide-over bag drawer with live subtotal calculation, free shipping threshold indicator, and direct checkout modal.

---

## 🎬 How GSAP Works in This Project (Simple English Guide)

### What is GSAP?
**GSAP (GreenSock Animation Platform)** is an industry-standard JavaScript animation library. While standard CSS transitions can only handle basic hover effects, GSAP gives us frame-by-frame control over how elements move, scale, fade, and rotate.

### What is ScrollTrigger?
**ScrollTrigger** is a GSAP plugin that connects animations directly to the user's scroll position. Instead of animations just playing once when the page loads, ScrollTrigger allows elements to:
1. **Trigger on Scroll**: Start moving precisely when they enter the visitor's screen.
2. **Scrub with Scroll**: Tie the progress of the animation directly to the scrollbar (scroll down = move forward; scroll up = move backward).
3. **Pin Elements in Place**: Freeze a section on screen while its internal elements slide, reveal, and animate over one another.

### How Lenis & GSAP Work Together
In this project, we use **Lenis** (`@studio-freight/lenis`) for momentum-based smooth scrolling. On every single animation frame, Lenis calculates the smooth scroll velocity and notifies GSAP:
```javascript
lenis.on('scroll', ScrollTrigger.update);
```
This guarantees that all GSAP ScrollTrigger animations remain 100% synchronized with the scrollbar with zero jitter or lag.

---

## 📍 Where GSAP is Added & How Animations Move

Here is a breakdown of every section in the codebase where GSAP is implemented:

### 1. Hero Showcase (`src/components/Hero.jsx`)
- **What it does**: Displays the signature cold-pressed oils (Groundnut, Sunflower, Sesame, Castor).
- **How animations move**:
  - **Slide Transitions**: When switching between oils, GSAP animates the bottle and background titles using smooth opacity crossfades and scaling.
  - **Floating Corner Micro-Animations**: Four corner ingredient crops (peanuts, sunflower petals, sesame seeds) float subtly around the bottle, creating an organic natural frame.
  - **Header Scroll Scrub**: As the visitor scrolls down past the hero, the bottle and hero typography gently scale down and fade into the next section.

### 2. Heritage & "Sunrefined Purity" (`src/components/About.jsx`)
- **What it does**: Explains the traditional wooden mortar pressing technique below 45°C.
- **How animations move**:
  - **Sequential Header Timeline**: As this section comes into view, the eyebrow tag (`Sunrefined Purity`), main title (`Golden Clarity. Cold-Pressed Under Sun.`), and description paragraph fade and slide upwards in sequence (`stagger`).
  - **Interactive Number Count-Up**: Numerical stats (`45°C` unheated churn, `100%` purity, `0%` chemical hexanes) roll upwards from `0` to their final values using GSAP's `roundProps` feature when they scroll into the viewport.
  - **Bottle Parallax Scrub**: The cold-pressed bottle and its framing botanicals subtly track scroll velocity, giving a 3D depth effect.

### 3. Farm-Fresh Favorites Carousel (`src/components/ProductCarousel.jsx`)
- **What it does**: Displays the carousel of best-selling cold-pressed oils and organic farm staples.
- **How animations move**:
  - **Left & Right Entrance**: Carousel cards slide in dynamically from opposite sides as the section scrolls into the viewport.
  - **Interactive Micro-Interactions**: Hovering over cards triggers hardware-accelerated transforms (`transform-gpu`) for responsive product inspection.

### 4. Single-Origin Harvest Showcase (`src/components/Showcase.jsx`)
- **What it does**: Fullscreen showcase featuring Sun-Dried Guntur Chillies, Authentic Ceylon Cinnamon, and Golden Long Raisins.
- **How animations move**:
  - **Screen Pinning (`pin: true`)**: The section locks onto the screen for a controlled scroll duration.
  - **Curtain Reveal (`clipPath`)**: As you scroll, each item is unveiled from bottom to top using dynamic SVG/CSS clip-path wipes (`inset(100% 0% 0% 0%)` -> `inset(0% 0% 0% 0%)`).
  - **Synchronized Price Rolls**: Each slide's price counter dynamically counts up to its exact price (₹190, ₹255, ₹210) as the slide locks into view.

### 5. Harvest Visuals / Pure Press Collection (`src/components/Gallery.jsx`)
- **What it does**: A curated 4-card editorial packshot gallery.
- **How animations move**:
  - **Header Reveal Timeline**: A GSAP timeline choreographs the entrance of "Harvest Visuals", "The Pure Press Collection", and "Each batch is slow-churned from fresh crop harvests..." sequentially with power3 easing.
  - **Staggered Card Lift**: The cards rise from bottom with a staggered delay (`stagger: 0.12s`).
  - **Parallax Image Zoom (`scrub: 1`)**: As each card scrolls through the screen, GSAP scrubs the inner image from scale `1.15` down to `1.0` while moving the vertical position (`yPercent: -6%` to `6%`). This creates a genuine cinematic parallax effect.

### 6. Smart Responsive Navbar (`src/components/Navbar.jsx`)
- **What it does**: Sticky header with brand logo, quick links, search trigger, bag counter, and customer account.
- **How animations move**:
  - Automatically translates up (`-translate-y-full`) on downward scroll to maximize screen real estate, and glides back down (`translate-y-0`) the moment the user scrolls up.

---

## ♿ Accessibility First
All animations in this project strictly obey user system preferences for reduced motion:
```javascript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) return;
```
If a user has **Reduce Motion** enabled in their OS or browser settings, all GSAP timelines and floating effects are instantly bypassed to ensure a comfortable viewing experience.

---

## 🛠️ Tech Stack Summary

| Technology | Purpose |
|---|---|
| **React 19** | Modern UI Component Architecture |
| **Vite** | Ultra-fast build tool and dev server |
| **Tailwind CSS v4** | Modern utility-first styling with custom CSS design tokens |
| **GSAP & ScrollTrigger** | High-performance scroll choreography and timeline orchestration |
| **Lenis** | Smooth momentum-based scrolling |
| **Lucide React** | Clean, accessible iconography |

---

## 📦 License
Private and Proprietary to **ARSHITH Organics**. All rights reserved.
