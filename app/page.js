"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Portfolio from './portfolio/page';
import Services from './services/page';
import Pricing from './pricing/page';
import FAQ from './faq/page';
import ClientGallery from './client-gallery/page';
import Contact from './contact/page';

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2000&auto=format&fit=crop"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <main style={{ width: '100%' }}>
            {/* Hero Section */}
            <header className="hero">
                <div className="hero-slideshow">
                    {slides.map((src, idx) => (
                        <img 
                            key={idx}
                            src={src}
                            className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
                            loading={idx === 0 ? "eager" : "lazy"}
                            alt={`Slide ${idx + 1}`}
                        />
                    ))}
                </div>

                <div className="hero-overlay"></div>

                <div className="hero-content">
                    <h1 className="title-xl">MK<br />Photography</h1>
                    <p className="text-body">
                        Award-winning Benin photographer specializing in events, portraits, and lifestyle moments that tell
                        authentic stories.
                    </p>
                    <div className="btn-group">
                        <Link href="/contact" className="btn-primary">Book Your Session</Link>
                        <Link href="/portfolio" className="btn-outline">View Portfolio</Link>
                    </div>
                </div>
            </header>
            
            <div id="portfolio"><Portfolio /></div>
            <div id="services"><Services /></div>
            <div id="pricing"><Pricing /></div>
            <div id="faq"><FAQ /></div>
            <div id="gallery"><ClientGallery /></div>
            <div id="contact"><Contact /></div>
        </main>
    );
}
