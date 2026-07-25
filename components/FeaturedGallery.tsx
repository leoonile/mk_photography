"use client";

import { useState, useEffect } from 'react';
import { portfolioData } from './portfolioData';
import './featured-gallery.css';

interface PortfolioImage {
    id: string;
    cloudinary_url: string;
    filename: string;
}

export function FeaturedGallery() {
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
                setImages(allImages);
            } catch (err: any) {
                console.error(err);
                setImages(staticImages);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolio();
    }, []);

    // Split images into two halves for the two rows
    const half = Math.ceil(images.length / 2);
    const topRowImages = images.slice(0, half);
    const bottomRowImages = images.slice(half);

    return (
        <section className="featured-gallery bg-bg relative z-10 py-24 overflow-hidden">
            <div className="section-header text-center mb-12">
                <h2 className="title-lg font-serif text-[clamp(2.5rem,4vw,3.5rem)] mb-4">Featured Gallery</h2>
                <p className="text-body large mx-auto text-muted max-w-[600px] leading-relaxed mb-8">
                    A curated collection of our finest work, showcasing the emotion, detail, and beauty of every moment.
                </p>
            </div>

            {isLoading ? (
                <div className="text-center text-muted py-16 min-h-[400px]">
                    <div className="inline-block w-10 h-10 border-4 border-white/10 border-t-accent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="gallery-tracks flex flex-col w-full">
                    
                    {/* Top Row: Left-to-Right */}
                    <div className="marquee-wrapper">
                        <ul className="marquee-track track-ltr">
                            {/* Original Set */}
                            {topRowImages.map((img) => (
                                <li key={`orig-top-${img.id}`} className="item">
                                    <img src={img.cloudinary_url} alt={img.filename} loading="lazy" />
                                </li>
                            ))}
                            {/* Cloned Set for Infinite Loop */}
                            {topRowImages.map((img) => (
                                <li key={`clone-top-${img.id}`} className="item">
                                    <img src={img.cloudinary_url} alt={img.filename} loading="lazy" />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Bottom Row: Right-to-Left */}
                    <div className="marquee-wrapper">
                        <ul className="marquee-track track-rtl">
                            {/* Original Set */}
                            {bottomRowImages.map((img) => (
                                <li key={`orig-bottom-${img.id}`} className="item">
                                    <img src={img.cloudinary_url} alt={img.filename} loading="lazy" />
                                </li>
                            ))}
                            {/* Cloned Set for Infinite Loop */}
                            {bottomRowImages.map((img) => (
                                <li key={`clone-bottom-${img.id}`} className="item">
                                    <img src={img.cloudinary_url} alt={img.filename} loading="lazy" />
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            )}

            <div className="text-center mt-16">
                <a href="/portfolio" className="btn-outline">View Full Portfolio</a>
            </div>
        </section>
    );
}
