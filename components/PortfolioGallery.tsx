"use client";

import { useState, useMemo, useEffect } from 'react';

interface PortfolioImage {
    id: string;
    cloudinary_url: string;
    portfolio_category: string;
    filename: string;
}

export function PortfolioGallery({ hideButton = false }: { hideButton?: boolean }) {
    const [filter, setFilter] = useState('All');
    const [images, setImages] = useState<PortfolioImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const res = await fetch('/api/admin?action=portfolio-images');
                if (!res.ok) throw new Error('Failed to fetch portfolio images');
                const data = await res.json();
                
                if (data.images) {
                    setImages(data.images);
                } else {
                    setImages([]);
                }
            } catch (err: any) {
                console.error(err);
                setError('Unable to load portfolio gallery.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolio();
    }, []);

    // Extract unique categories from data and capitalize them
    const categories = useMemo(() => {
        const cats = new Set(images.map(img => (img.portfolio_category || 'Other').toLowerCase()));
        const formattedCats = Array.from(cats).map(c => c.charAt(0).toUpperCase() + c.slice(1));
        return ['All', ...formattedCats];
    }, [images]);

    // Format the images to match the new categories
    const formattedImages = useMemo(() => {
        return images.map(img => ({
            ...img,
            category: (img.portfolio_category || 'Other').charAt(0).toUpperCase() + (img.portfolio_category || 'Other').slice(1)
        }));
    }, [images]);

    const filteredImages = filter === 'All' ? formattedImages : formattedImages.filter(img => img.category === filter);

    return (
        <section id="gallery" className="portfolio-gallery-section" style={{ padding: '6rem 5%', minHeight: '100vh', background: 'var(--bg)' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 className="title-lg" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>Featured Gallery</h2>
                <p className="text-body large" style={{ margin: '0 auto', color: 'var(--muted)', maxWidth: '600px', lineHeight: '1.6' }}>
                    A curated collection of our finest work, showcasing the emotion, detail, and beauty of every moment.
                </p>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '4rem 0' }}>
                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`
                        @keyframes spin { to { transform: rotate(360deg); } }
                    `}</style>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '2rem' }}>
                    {error}
                </div>
            ) : images.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '4rem 0' }}>
                    No photos added to the portfolio yet. 
                </div>
            ) : (
                <>
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
                        {filteredImages.map((img, idx) => {
                            // Automatically fetch a medium-res optimized crop from Cloudinary for the grid
                            const thumbUrl = img.cloudinary_url.replace('/upload/', '/upload/w_600,c_fill,q_auto/');
                            
                            return (
                                <div key={img.id || idx} style={{ overflow: 'hidden', borderRadius: '8px', position: 'relative', aspectRatio: '4/5', background: 'var(--input-bg)' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={thumbUrl} 
                                        alt={img.filename || img.category} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        loading="lazy"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {!hideButton && (
                        <div style={{ textAlign: 'center' }}>
                            <a href="/portfolio" className="btn-outline">View Full Portfolio</a>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
