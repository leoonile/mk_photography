"use client";

import { useState } from 'react';

export default function Contact() {
    const [status, setStatus] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your API route
        // const formData = new FormData(e.target);
        // fetch('/api/contact', { ... })
        setStatus('Thank you for reaching out! We will get back to you within 24 hours.');
        e.target.reset();
    };

    return (
        <section className="section-padding" style={{ paddingTop: '6rem', paddingBottom: '6rem', minHeight: '100vh' }}>
            <div className="section-header">
                <h1 className="title-lg">Let's Work Together</h1>
                <p className="text-body large" style={{ margin: '0 auto' }}>
                    Ready to capture your special moments? Fill out the form below and we'll be in touch.
                </p>
            </div>

            <div className="grid-2" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Contact Information */}
                <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 className="title-md" style={{ marginBottom: '2rem' }}>Contact Info</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ color: 'var(--accent)', marginTop: '0.2rem', fontSize: '1.5rem' }}>✉</div>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.2rem' }}>Email</h4>
                            <p className="text-body" style={{ margin: 0, fontSize: '0.95rem' }}>hello@mkphotography.com</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ color: 'var(--accent)', marginTop: '0.2rem', fontSize: '1.5rem' }}>☏</div>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.2rem' }}>Phone / WhatsApp</h4>
                            <p className="text-body" style={{ margin: 0, fontSize: '0.95rem' }}>+234 123 456 7890</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ color: 'var(--accent)', marginTop: '0.2rem', fontSize: '1.5rem' }}>📍</div>
                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.2rem' }}>Studio Location</h4>
                            <p className="text-body" style={{ margin: 0, fontSize: '0.95rem' }}>
                                123 Creative Avenue,<br />
                                Benin City, Edo State,<br />
                                Nigeria
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <input type="text" className="input-field" required placeholder="John Doe" />
                    </div>
                    
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <input type="email" className="input-field" required placeholder="john@example.com" />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Service Required</label>
                        <select className="input-field" required style={{ appearance: 'none', background: 'rgba(255, 255, 255, 0.05) url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 1rem center', backgroundSize: '0.65rem auto' }}>
                            <option value="" disabled selected>Select a service</option>
                            <option value="wedding" style={{ color: '#000' }}>Wedding Photography</option>
                            <option value="portrait" style={{ color: '#000' }}>Portrait Session</option>
                            <option value="event" style={{ color: '#000' }}>Event Coverage</option>
                            <option value="commercial" style={{ color: '#000' }}>Commercial Shoot</option>
                            <option value="other" style={{ color: '#000' }}>Other</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Project Details / Date</label>
                        <textarea className="input-field" required placeholder="Tell us more about your project..." rows="5"></textarea>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', cursor: 'pointer' }}>
                        Send Message
                    </button>

                    {status && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(212, 178, 125, 0.1)', color: 'var(--accent)', borderRadius: '4px', textAlign: 'center', fontSize: '0.9rem' }}>
                            {status}
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}
