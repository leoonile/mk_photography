"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <nav className={`navbar ${isHome ? '' : 'static'}`}>
            <div className="nav-left">
                <Link href="/" className="nav-brand">MK PHOTOGRAPHY</Link>
            </div>

            <div className="nav-center">
                <div className="theme-toggle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </div>
                <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
                <Link href={isHome ? "#portfolio" : "/portfolio"} className={`nav-link ${pathname === '/portfolio' ? 'active' : ''}`}>Portfolio</Link>
                <Link href={isHome ? "#services" : "/services"} className={`nav-link ${pathname === '/services' ? 'active' : ''}`}>Services</Link>
                <Link href={isHome ? "#pricing" : "/pricing"} className={`nav-link ${pathname === '/pricing' ? 'active' : ''}`}>Pricing</Link>
                <Link href={isHome ? "#faq" : "/faq"} className={`nav-link ${pathname === '/faq' ? 'active' : ''}`}>FAQ</Link>
                <Link href={isHome ? "#gallery" : "/client-gallery"} className={`nav-link ${pathname === '/client-gallery' ? 'active' : ''}`}>Gallery</Link>
            </div>

            <div className="nav-right">
                <Link href="/contact" className="nav-btn-contact">Contact</Link>
            </div>
        </nav>
    );
}
