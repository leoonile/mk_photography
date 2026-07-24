'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// 1. Photography Portfolio Data
const cardData = [
  { 
    id: 1, 
    title: 'Wedding Stories', 
    description: 'Timeless moments captured on your special day. From the first look to the final dance, we document the authentic emotions of your celebration.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop'
  },
  { 
    id: 2, 
    title: 'Portrait Sessions', 
    description: 'Authentic portraits that highlight your unique personality. Perfect for personal branding, graduations, or just celebrating you.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    id: 3, 
    title: 'Event Coverage', 
    description: 'Professional documentation of your most important events, ensuring every detail and candid moment is preserved forever.',
    image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=2000&auto=format&fit=crop'
  },
];

// 2. The Individual Sticky Card Component
function StickyCard({
  item,
  index,
  totalCards,
  containerRef,
}: {
  item: typeof cardData[0];
  index: number;
  totalCards: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Track scroll progress against the parent container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Calculate this specific card's animation window
  const segmentSize = 1 / totalCards;
  const start = index * segmentSize;
  const end = start + segmentSize;

  // Scale down to 0.9 as the next card scrolls over it
  const scale = useTransform(
    scrollYProgress,
    [start, end],
    [1, index < totalCards - 1 ? 0.9 : 1]
  );

  // Darken the card as the next card scrolls over it
  const overlayOpacity = useTransform(
    scrollYProgress,
    [start, end],
    [0.3, index < totalCards - 1 ? 0.8 : 0.3] // Base 0.3 to make text readable, max 0.8
  );

  // Increment the top margin so cards stack visibly
  const topOffset = 10 + index * 4; 

  return (
    <motion.div
      style={{ scale, top: `${topOffset}vh` }}
      className="portfolio-sticky-card origin-top"
    >
      {/* Card UI Wrapper */}
      <div className="portfolio-card-wrapper">
        
        {/* Background Image */}
        <img 
          src={item.image} 
          alt={item.title}
          className="portfolio-card-image"
        />

        {/* Darkening Overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="portfolio-card-overlay"
        />

        {/* Card Content */}
        <div className="portfolio-card-content">
          <h3 className="portfolio-card-title">{item.title}</h3>
          <p className="portfolio-card-desc">{item.description}</p>
          <a href="#gallery" className="btn-outline portfolio-card-btn">View Gallery</a>
        </div>
      </div>
    </motion.div>
  );
}

// 3. The Parent Section Component
export function StackedCardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="portfolio"
      ref={containerRef}
      className="portfolio-stacked-section bg-bg"
      // Crucial: Create enough scrollable height based on card count
      style={{ height: `${cardData.length * 100}vh` }}
    >
      {/* Section Header that stays sticky behind the cards */}
      <div className="portfolio-section-header">
        <div className="portfolio-header-inner">
          <h2 className="portfolio-header-subtitle">
            Our Portfolio
          </h2>
          <h1 className="title-lg portfolio-header-title">A collection of our recent work</h1>
        </div>
      </div>

      {/* The Cards */}
      <div className="portfolio-cards-container">
        {cardData.map((item, index) => (
          <StickyCard
            key={item.id}
            item={item}
            index={index}
            totalCards={cardData.length}
            containerRef={containerRef}
          />
        ))}
      </div>
    </section>
  );
}
