"use client";

import { useState } from 'react';
import wedding1 from '../../images/wedding-candid-01.jpg';
import wedding2 from '../../images/wedding-couple-01.jpg';
import wedding3 from '../../images/wedding-detail-01.jpg';
import portrait1 from '../../images/portrait-outdoor-01.jpg';
import portrait2 from '../../images/portrait-studio-01.jpg';
import event1 from '../../images/event-award-01.jpg';
import event2 from '../../images/event-gala-01.jpg';
import commercial1 from '../../images/commercial-studio-01.jpg';

const categories = ['All', 'Weddings', 'Portraits', 'Events', 'Commercial'];

const images = [
    { src: wedding1.src, category: 'Weddings' },
    { src: wedding2.src, category: 'Weddings' },
    { src: wedding3.src, category: 'Weddings' },
    { src: portrait1.src, category: 'Portraits' },
    { src: portrait2.src, category: 'Portraits' },
    { src: event1.src, category: 'Events' },
    { src: event2.src, category: 'Events' },
    { src: commercial1.src, category: 'Commercial' },
];

export default function Portfolio() {
    const [filter, setFilter] = useState('All');

    const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

    return (
        <section className="section-padding" style={{ paddingTop: '6rem', paddingBottom: '6rem', minHeight: '100vh' }}>
            <div className="section-header">
                <h1 className="title-lg">Our Portfolio</h1>
                <p className="text-body large" style={{ margin: '0 auto' }}>
                    A curated collection of our finest work, showcasing the emotion, detail, and beauty of every moment.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setFilter(cat)}
                        className={`btn-outline ${filter === cat ? 'active' : ''}`}
                        style={filter === cat ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#fff' } : {}}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid-3">
                {filteredImages.map((img, idx) => (
                    <div key={idx} style={{ overflow: 'hidden', borderRadius: '4px', position: 'relative', aspectRatio: '4/5' }}>
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
        </section>
    );
}
