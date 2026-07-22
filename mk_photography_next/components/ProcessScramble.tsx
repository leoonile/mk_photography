"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

function ScrambleText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (!isInView) return;
    
    let iteration = 0;
    const maxIterations = text.length * 2;
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 2) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text); // Ensure final exact match
      }
      iteration += 1;
    }, 40);

    return () => clearInterval(interval);
  }, [text, isInView]);

  return <span ref={ref}>{displayText || text.replace(/./g, '_')}</span>;
}

const processes = [
  {
    number: "01",
    title: "Consultation & Planning",
    description: "We start by understanding your vision, preferences, and the specific needs of your event or session. We discuss locations, styling, and timelines to ensure a seamless experience.",
  },
  {
    number: "02",
    title: "The Shoot",
    description: "On the day, we bring our expertise and creativity to capture authentic moments. We guide you through poses while also focusing on candid, unstaged emotions.",
  },
  {
    number: "03",
    title: "Post-Production & Delivery",
    description: "Every image undergoes our signature editing process. We color-grade, retouch, and deliver your high-resolution memories through a secure, private online gallery.",
  }
];

export function ProcessScramble() {
  return (
    <section id="process" className="process-section" style={{ padding: '8rem 5%', background: 'var(--bg)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '5rem', textAlign: 'left' }}>
          <h2 className="title-lg" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem', color: 'var(--fg)' }}>
            <ScrambleText text="How It Works" />
          </h2>
          <p className="text-body" style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', fontWeight: 600 }}>
            <ScrambleText text="Our Photography Process" />
          </p>
        </div>

        <div className="process-grid" style={{ display: 'grid', gap: '4rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {processes.map((proc, idx) => (
            <motion.div 
              key={proc.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              style={{ paddingRight: '2rem' }}
            >
              <div style={{ fontSize: '3rem', fontFamily: 'var(--serif)', color: 'var(--accent)', opacity: 0.5, marginBottom: '1rem', lineHeight: 1 }}>
                {proc.number}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--sans)', fontWeight: 600, marginBottom: '1rem' }}>
                {proc.title}
              </h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                {proc.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
