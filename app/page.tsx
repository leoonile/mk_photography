"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PricingSection } from "@/components/PricingSection";
import { StackedCardsSection } from "@/components/PortfolioSection";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { ProcessScramble } from "@/components/ProcessScramble";
import { ServicesStickyScroll } from "@/components/ServicesStickyScroll";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ContactSection } from "@/components/ContactSection";

const SLIDESHOW_IMAGES = [
  "/images/hero/hero-1.jpg",
  "/images/hero/hero-2.jpg",
  "/images/hero/hero-3.jpg",
  "/images/hero/hero-4.jpg"
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const slideInterval = 4000;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, slideInterval);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <header id="hero" className="hero">
        {/* Cross-fading Slideshow Background */}
        <div className="hero-slideshow" id="slideshow-container">
          {SLIDESHOW_IMAGES.map((src, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={src}
              className={`hero-slide ${index === activeSlide ? "active" : ""}`}
              loading={index === 0 ? "eager" : "lazy"}
              alt={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Gradient Overlay ensures the left side matches your black background */}
        <div className="hero-overlay"></div>

        {/* Left-aligned Content */}
        <div className="hero-content">
          <motion.div 
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            IMMORTALIZING THE MOMENTS
          </motion.div>
          
          <motion.h1 
            className="title-jop"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            MK<br /><i>Photography</i>
          </motion.h1>
          
          <motion.p 
            className="text-body"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ color: "rgba(255, 255, 255, 0.85)" }}
          >
            Crafting timeless visual stories since 2021. Based in Benin, Nigeria.
          </motion.p>
          
          <motion.div 
            className="btn-group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            <a href="#pricing" className="btn-primary">Book Your Session</a>
            <a href="#portfolio" className="btn-outline">View Portfolio</a>
          </motion.div>
        </div>
      </header>

      {/* 1. How It Works (Process Scramble) */}
      <ProcessScramble />

      {/* 2. Services (Sticky Split-Scroll) */}
      <ServicesStickyScroll />

      {/* 3. Our Works (Stacked Cards Portfolio + Grid Gallery) */}
      <StackedCardsSection />
      
      {/* Interactive Gallery Section */}
      <PortfolioGallery />

      {/* 4. Pricing */}
      <PricingSection />

      {/* 5. FAQ (Accordion) */}
      <FAQAccordion />

      {/* 6. Contact Section */}
      <ContactSection />

      {/* Floating Widgets */}
      <div className="floating-widgets">
        <a href="tel:+2349136102452" className="widget-btn widget-phone">
          {/* Phone Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z">
            </path>
          </svg>
        </a>
        <a href="mailto:mkphotography370@gmail.com" className="widget-btn widget-email">
          {/* Mail Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </a>
        <a href="https://wa.me/2349035252179" target="_blank" rel="noopener noreferrer" className="widget-btn widget-wa">
          {/* WhatsApp Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
            </path>
          </svg>
        </a>
        <a href="https://tiktok.com/@mk.4tography" target="_blank" rel="noopener noreferrer" className="widget-btn widget-email" style={{ background: '#000', color: '#fff' }}>
          {/* TikTok Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
          </svg>
        </a>
      </div>
    </>
  );
}
