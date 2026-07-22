"use client";

import { useState } from 'react';

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

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="section-padding" style={{ paddingTop: '6rem', paddingBottom: '6rem', minHeight: '100vh', maxWidth: '800px', margin: '0 auto' }}>
            <div className="section-header">
                <h1 className="title-lg">Frequently Asked Questions</h1>
                <p className="text-body large" style={{ margin: '0 auto' }}>
                    Everything you need to know about working with MK Photography.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {faqs.map((faq, idx) => (
                    <div 
                        key={idx} 
                        style={{ 
                            background: 'rgba(255, 255, 255, 0.03)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                            borderRadius: '8px', 
                            overflow: 'hidden' 
                        }}
                    >
                        <button 
                            onClick={() => toggleFAQ(idx)}
                            style={{ 
                                width: '100%', 
                                padding: '1.5rem', 
                                background: 'transparent', 
                                border: 'none', 
                                color: 'var(--fg)', 
                                textAlign: 'left',
                                fontSize: '1.1rem',
                                fontFamily: 'var(--sans)',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            {faq.question}
                            <span style={{ fontSize: '1.5rem', color: 'var(--accent)', transition: 'transform 0.3s ease', transform: openIndex === idx ? 'rotate(45deg)' : 'rotate(0)' }}>
                                +
                            </span>
                        </button>
                        
                        <div style={{ 
                            maxHeight: openIndex === idx ? '500px' : '0', 
                            overflow: 'hidden', 
                            transition: 'max-height 0.3s ease-in-out',
                            padding: openIndex === idx ? '0 1.5rem 1.5rem 1.5rem' : '0 1.5rem',
                            color: 'var(--muted)',
                            lineHeight: '1.6'
                        }}>
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
