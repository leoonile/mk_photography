"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "How far in advance should we book our wedding?",
        answer: "We recommend booking 6-12 months in advance, especially for popular seasons. However, feel free to reach out for last-minute availability."
    },
    {
        question: "Do you travel for shoots?",
        answer: "Yes! While we are based in Benin, Nigeria, we frequently travel for destination weddings and commercial projects worldwide. Travel fees are calculated based on the location."
    },
    {
        question: "When will we receive our photos?",
        answer: "For portraits and events, you will receive a sneak peek within 48 hours and the full gallery within 2 weeks. Weddings typically take 4-6 weeks for full delivery."
    },
    {
        question: "Do we get the RAW, unedited files?",
        answer: "We do not provide RAW files. A significant part of our art and style is in the editing process, and we want to ensure you receive a finished product that reflects the MK Photography standard."
    },
    {
        question: "How do we book a session?",
        answer: "Simply fill out the contact form on our website with your details, and we will get back to you within 24 hours to schedule a consultation and secure your date."
    }
];

function AccordionItem({ faq, isOpen, onClick }: { faq: any, isOpen: boolean, onClick: () => void }) {
    return (
        <motion.div 
            initial={false}
            style={{ 
                background: "var(--input-bg)", 
                border: "1px solid var(--border)", 
                borderRadius: "12px", 
                overflow: "hidden",
                marginBottom: "1rem"
            }}
        >
            <button 
                onClick={onClick}
                style={{ 
                    width: "100%", 
                    padding: "1.5rem", 
                    background: "transparent", 
                    border: "none", 
                    color: "var(--fg)", 
                    textAlign: "left",
                    fontSize: "1.1rem",
                    fontFamily: "var(--sans)",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                {faq.question}
                <motion.span 
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ fontSize: "1.5rem", color: "var(--accent)", transformOrigin: "center" }}
                >
                    +
                </motion.span>
            </button>
            
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div 
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto", paddingBottom: "1.5rem" },
                            collapsed: { opacity: 0, height: 0, paddingBottom: 0 }
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ 
                            padding: "0 1.5rem",
                            color: "var(--muted)",
                            lineHeight: "1.6"
                        }}
                    >
                        {faq.answer}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function FAQAccordion({ hideButton = false }: { hideButton?: boolean }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="faq-section" style={{ padding: "8rem 5%", background: "var(--bg)" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <h2 className="title-lg" style={{ fontFamily: "var(--serif)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", marginBottom: "1rem" }}>
                        Frequently Asked Questions
                    </h2>
                    <p className="text-body" style={{ margin: "0 auto", fontSize: "1.1rem" }}>
                        Everything you need to know about working with MK Photography.
                    </p>
                </div>

                <div>
                    {faqs.map((faq, idx) => (
                        <AccordionItem 
                            key={idx} 
                            faq={faq} 
                            isOpen={openIndex === idx} 
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)} 
                        />
                    ))}
                </div>
                
                {!hideButton && (
                    <div style={{ textAlign: "center", marginTop: "3rem" }}>
                        <a href="/faq" className="btn-outline">View All FAQs</a>
                    </div>
                )}
            </div>
        </section>
    );
}
