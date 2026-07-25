"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    setMounted(true);
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 50);
      
      // Hide if scrolling down and past 100px, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const renderThemeToggle = (idPrefix = 'desktop') => {
    if (!mounted) return null;
    return (
        <div className="theme-switch-wrapper" title="Toggle theme">
          <div className="checkbox">
            <input 
              type="checkbox" 
              name={`theme-toggle-${idPrefix}`}
              id={`theme-toggle-${idPrefix}`}
              checked={mounted && theme === 'dark'}
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
            <div className="checkbox-inner">
              <label htmlFor={`theme-toggle-${idPrefix}`}></label>
              <span></span>
            </div>
          </div>
        </div>
    );
  };

  const navLinks = (
    <>
      <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
      <Link href="/portfolio" className={`nav-link ${pathname === "/portfolio" ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>Portfolio</Link>
      <Link href="/services" className={`nav-link ${pathname === "/services" ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
      <Link href="/pricing" className={`nav-link ${pathname === "/pricing" ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
      <Link href="/gallery" className={`nav-link ${pathname === "/gallery" ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
      <Link href="/faq" className={`nav-link ${pathname === "/faq" ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
    </>
  );

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""} ${isHidden ? "hidden" : ""}`}>
      <div className="nav-left">
        <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="MK Photography Logo" className="nav-logo" style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }} />
        </Link>
      </div>

      <div className="nav-center desktop-nav">
        {renderThemeToggle()}
        {navLinks}
      </div>

      <div className="nav-right desktop-nav">
        <Link href="/contact" className="nav-btn-contact">Contact</Link>
      </div>

      <div className="mobile-nav-toggle">
        {renderThemeToggle('mobile')}
        <button className={`hamburger-text-btn ${isMobileMenuOpen ? "is-open" : ""}`} onClick={toggleMenu} aria-label="Toggle menu">
          <span className="menu-label-open">MENU</span>
          <span className="menu-label-close">CLOSE</span>
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? "is-open" : ""}`}>
        <div className="mobile-menu-header-top">
          {renderThemeToggle('overlay')}
        </div>
        <nav className="mobile-menu-nav-links">
          {navLinks}
          <Link href="/contact" className="mobile-contact-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        </nav>
        <div className="mobile-menu-footer">
          <span>MK PHOTOGRAPHY</span>
          <span>BENIN CITY, NIGERIA</span>
        </div>
      </div>
    </nav>
  );
}
