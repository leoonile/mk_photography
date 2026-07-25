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

  const renderThemeToggle = () => {
    if (!mounted) return null;
    return (
      <div 
        className="theme-toggle" 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        title="Toggle theme"
      >
        {theme === 'dark' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
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
          <img src="/logo.png" alt="MK Photography Logo" style={{ height: '120px', width: 'auto', filter: theme === 'dark' ? 'invert(1)' : 'none' }} />
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
          {renderThemeToggle()}
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
