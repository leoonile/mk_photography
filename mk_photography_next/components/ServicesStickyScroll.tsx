"use client";

import React from "react";
import { motion } from "framer-motion";

const services = [
  {
    title: "Weddings",
    description: "From intimate ceremonies to grand celebrations, we capture the raw emotion, traditional details, and fleeting moments of your special day with a timeless, cinematic approach.",
    image: "/images/wedding-trad-01.jpg"
  },
  {
    title: "Portraits",
    description: "Professional studio and outdoor portraiture designed to bring out your authentic self. Perfect for personal branding, family sessions, and creative editorials.",
    image: "/images/portrait-studio-11.jpg"
  },
  {
    title: "Events",
    description: "Comprehensive coverage for corporate galas, award ceremonies, concerts, and stadium events. We ensure every key moment and attendee interaction is beautifully documented.",
    image: "/images/event-stadium-01.jpg"
  },
  {
    title: "Commercial",
    description: "High-end commercial photography to elevate your brand. We provide stunning visual assets for marketing campaigns, product launches, and brand storytelling.",
    image: "/images/commercial-studio-03.jpg"
  }
];

export function ServicesStickyScroll() {
  return (
    <section id="services" className="services-section" style={{ padding: "8rem 5%", background: "var(--bg)", position: "relative" }}>
      <div className="services-grid">
        
        {/* Left Sticky Column */}
        <div className="services-left-col">
          <h2 className="title-lg" style={{ fontFamily: "var(--serif)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", marginBottom: "1rem" }}>
            Our Expertise
          </h2>
          <p className="text-body" style={{ fontSize: "1.1rem", marginBottom: "2.5rem" }}>
            Tailored photography experiences designed to meet your specific needs. We combine technical excellence with an artistic eye to deliver stunning results across various disciplines.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="#contact" className="btn-primary" style={{ display: "inline-block" }}>
              Inquire Now
            </a>
            <a href="/services" className="btn-outline" style={{ display: "inline-block" }}>
              View All Services
            </a>
          </div>
        </div>

        {/* Right Scrolling Column */}
        <div className="services-right-col">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.6 }}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "16px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div className="service-card-img-container">
                <motion.img 
                  src={service.image} 
                  alt={service.title} 
                  className="service-card-img"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="service-card-content">
                <h3 className="service-title">{service.title}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>


    </section>
  );
}
