"use client";

import { useState } from 'react';

const categories = ['All', 'Weddings', 'Portraits', 'Events', 'Commercial'];

const images = [
    { src: '/images/wedding-candid-01.jpg', category: 'Weddings' },
    { src: '/images/wedding-couple-01.jpg', category: 'Weddings' },
    { src: '/images/wedding-detail-01.jpg', category: 'Weddings' },
    { src: '/images/portrait-outdoor-01.jpg', category: 'Portraits' },
    { src: '/images/portrait-studio-01.jpg', category: 'Portraits' },
    { src: '/images/event-award-01.jpg', category: 'Events' },
    { src: '/images/event-gala-01.jpg', category: 'Events' },
    { src: '/images/commercial-studio-01.jpg', category: 'Commercial' },
];

export function PortfolioGallery({ hideButton = false }: { hideButton?: boolean }) {
    const [filter, setFilter] = useState('All');

    const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

    return (
        <section id="gallery" className="portfolio-gallery-section" style={{ padding: '6rem 5%', minHeight: '100vh', background: 'var(--bg)' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 className="title-lg" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>Featured Gallery</h2>
                <p className="text-body large" style={{ margin: '0 auto', color: 'var(--muted)', maxWidth: '600px', lineHeight: '1.6' }}>
                    A curated collection of our finest work, showcasing the emotion, detail, and beauty of every moment.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setFilter(cat)}
                        className={`category-btn ${filter === cat ? 'active' : ''}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="portfolio-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '1.5rem',
                maxWidth: '1200px',
                margin: '0 auto',
                marginBottom: hideButton ? '0' : '4rem'
            }}>
                {filteredImages.map((img, idx) => (
                    <div key={idx} style={{ overflow: 'hidden', borderRadius: '8px', position: 'relative', aspectRatio: '4/5' }}>
                        <img 
                            src={img.src} 
                            alt={img.category} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </div>
                ))}
            </div>

            {!hideButton && (
                <div style={{ textAlign: 'center' }}>
                    <a href="/portfolio" className="btn-outline">View Full Portfolio</a>
                </div>
            )}
        </section>
    );
}
