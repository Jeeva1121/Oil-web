import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-(--border-subtle) bg-(--bg-canvas) py-16 text-(--text-body)">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-(--border-subtle)">
          <div className="flex flex-col gap-2">
            <a href="#hero" className="inline-block">
              <img
                src="/brand-logo-transparent.png"
                alt="ARSHITH Organics"
                className="h-10 w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </a>
            <p className="text-xs text-(--text-muted) mt-1 max-w-sm">
              Cold-pressed cooking oils and traditional A2 desi ghee extracted through wooden ghani.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-xs font-semibold text-(--text-muted)">
            <a href="#hero" className="hover:text-(--text-main) transition-colors">
              Home
            </a>
            <a href="#favorites" className="hover:text-(--text-main) transition-colors">
              Favorites
            </a>
            <a href="#showcase" className="hover:text-(--text-main) transition-colors">
              Showcase
            </a>
            <a href="#about" className="hover:text-(--text-main) transition-colors">
              Process
            </a>
            <a href="#gallery" className="hover:text-(--text-main) transition-colors">
              Gallery
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-(--text-muted)">
          <p className="m-0">
            © {new Date().getFullYear()} ARSHITH Organics. All rights reserved.
          </p>
          <p className="m-0 font-medium">
            100% Cold-Pressed • Traditional Wooden Extraction
          </p>
        </div>
      </div>
    </footer>
  );
};
