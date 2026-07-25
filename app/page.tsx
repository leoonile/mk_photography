"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PricingSection } from "@/components/PricingSection";
import { StackedCardsSection } from "@/components/PortfolioSection";
import { ArcGallery } from "@/components/ArcGallery";
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
      
      {/* Interactive Arc Stacked Gallery Section */}
      <ArcGallery />

      {/* 4. Pricing */}
      <PricingSection />

      {/* 5. FAQ (Accordion) */}
      <FAQAccordion />

      {/* 6. Contact Section */}
      <ContactSection />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/2349035252179"
        target="_blank"
        rel="noopener noreferrer"
        className="widget-wa-float"
        aria-label="Chat on WhatsApp"
      >
        {/* Official WhatsApp SVG */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}
