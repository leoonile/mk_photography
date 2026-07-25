"use client";

import { useState, useEffect } from 'react';
import { portfolioData } from './portfolioData';
import './arc-gallery.css';

interface PortfolioImage {
    id: string;
    cloudinary_url: string;
    filename: string;
}

export function ArcGallery() {
    const [images, setImages] = useState<PortfolioImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolio = async () => {
            const staticImages = portfolioData.map((img, idx) => ({
                id: `static-${idx}`,
                cloudinary_url: img.src,
                filename: img.src.split('/').pop() || 'static-image'
            }));

            try {
                const res = await fetch('/api/admin?action=portfolio-images');
                if (!res.ok) throw new Error('Failed to fetch portfolio images');
                const data = await res.json();
                
                let allImages = [];
                if (data.images && data.images.length > 0) {
                    allImages = [...data.images, ...staticImages];
                } else {
                    allImages = staticImages;
                }
                // Slice exactly 7 images for the Arc effect
                setImages(allImages.slice(0, 7));
            } catch (err: any) {
                console.error(err);
                setImages(staticImages.slice(0, 7));
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolio();
    }, []);

    return (
        <section className="arc-gallery-section" style={{ position: 'relative', zIndex: 10 }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 className="title-lg" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>Featured Gallery</h2>
                <p className="text-body large" style={{ margin: '0 auto', color: 'var(--muted)', maxWidth: '600px', lineHeight: '1.6', marginBottom: '2rem' }}>
                    A curated collection of our finest work, showcasing the emotion, detail, and beauty of every moment.
                </p>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '4rem 0', minHeight: '400px' }}>
                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                </div>
            ) : (
                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', padding: '4rem 0 6rem' }}>
                    <div className="arc-wrapper">
                        {images.map((img, idx) => {
                            const thumbUrl = img.cloudinary_url.includes('/upload/') 
                                ? img.cloudinary_url.replace('/upload/', '/upload/w_800,c_fill,q_auto/')
                                : img.cloudinary_url;
                                
                            return (
                                <div key={img.id || idx}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={thumbUrl} 
                                        alt={img.filename} 
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <a href="/portfolio" className="btn-outline">View Full Portfolio</a>
            </div>
        </section>
    );
}
