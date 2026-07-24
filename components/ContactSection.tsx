"use client";

import React, { useState } from "react";

export function ContactSection() {
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would typically send the data to your API route
        // const formData = new FormData(e.currentTarget);
        // fetch('/api/contact', { ... })
        setStatus('Thank you for reaching out! We will get back to you within 24 hours.');
        (e.target as HTMLFormElement).reset();
    };

    return (
        <section id="contact" className="contact-section" style={{ padding: '8rem 5%', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <h2 className="title-lg" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>
                    Let's Work Together
                </h2>
                <p className="text-body" style={{ margin: '0 auto', fontSize: '1.1rem', maxWidth: '600px' }}>
                    Ready to capture your special moments? Fill out the form below and we'll be in touch.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Contact Information */}
                <div style={{ padding: '2.5rem', background: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <h3 className="title-md" style={{ marginBottom: '2rem', fontFamily: 'var(--sans)', fontSize: '1.5rem' }}>Contact Info</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ color: 'var(--accent)', marginTop: '0.2rem', fontSize: '1.5rem' }}>✉</div>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>Email</h4>
                            <p className="text-body" style={{ margin: 0, fontSize: '0.95rem' }}>mkphotography370@gmail.com</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ color: 'var(--accent)', marginTop: '0.2rem', fontSize: '1.5rem' }}>☏</div>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>Phone / WhatsApp</h4>
                            <p className="text-body" style={{ margin: 0, fontSize: '0.95rem' }}>+234 913 610 2452 / 0903 525 2179</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ color: 'var(--accent)', marginTop: '0.2rem', fontSize: '1.5rem' }}>📍</div>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>Studio Location</h4>
                            <p className="text-body" style={{ margin: 0, fontSize: '0.95rem' }}>
                                Ugbowo,<br />
                                Benin City,<br />
                                Nigeria
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} style={{ padding: '2.5rem', background: 'var(--input-bg)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="input-label" style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Full Name</label>
                        <input type="text" className="input-field" required placeholder="John Doe" style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg)', borderRadius: '4px' }} />
                    </div>
                    
                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="input-label" style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Email Address</label>
                        <input type="email" className="input-field" required placeholder="john@example.com" style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg)', borderRadius: '4px' }} />
                    </div>

                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="input-label" style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Service Required</label>
                        <select className="input-field" required defaultValue="" style={{ padding: '1rem', background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--fg)', borderRadius: '4px', appearance: 'none' }}>
                            <option value="" disabled>Select a service</option>
                            <option value="wedding" style={{ color: '#000' }}>Wedding Photography</option>
                            <option value="portrait" style={{ color: '#000' }}>Portrait Session</option>
                            <option value="event" style={{ color: '#000' }}>Event Coverage</option>
                            <option value="commercial" style={{ color: '#000' }}>Commercial Shoot</option>
                            <option value="other" style={{ color: '#000' }}>Other</option>
                        </select>
                    </div>

                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="input-label" style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Project Details / Date</label>
                        <textarea className="input-field" required placeholder="Tell us more about your project..." rows={4} style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg)', borderRadius: '4px', resize: 'vertical' }}></textarea>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem', cursor: 'pointer', border: 'none', background: 'var(--accent)', color: 'var(--bg)', fontWeight: 600, fontSize: '1rem', borderRadius: '4px' }}>
                        Send Message
                    </button>

                    {status && (
                        <div style={{ padding: '1rem', background: 'rgba(212, 178, 125, 0.1)', color: 'var(--accent)', borderRadius: '4px', textAlign: 'center', fontSize: '0.9rem' }}>
                            {status}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}
