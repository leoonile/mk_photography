"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GalleryPage() {
    const [slug, setSlug] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/gallery-auth?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, password }),
            });

            const data = await res.json();
            if (res.ok) {
                // Store token in localStorage or cookie, then redirect
                localStorage.setItem('gallery_token', data.token);
                router.push(`/gallery/${slug}`);
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <section className="section-padding" style={{ paddingTop: '6rem', paddingBottom: '6rem', width: '100%' }}>
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="title-lg" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>Client Gallery</h1>
                    <p className="text-body large" style={{ margin: '0 auto', color: 'var(--muted)', fontSize: '1.1rem' }}>
                        Access your private collection of memories.
                    </p>
                </div>

                <div style={{ 
                    background: 'var(--input-bg)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '12px', 
                    padding: '3rem',
                    width: '100%',
                    maxWidth: '500px',
                    margin: '0 auto'
                }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="input-label" style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Gallery Slug (e.g. smith-wedding)</label>
                            <input 
                                type="text" 
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="input-field" 
                                required
                                style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg)', borderRadius: '4px' }} 
                            />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="input-label" style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field" 
                                required
                                style={{ padding: '1rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--fg)', borderRadius: '4px' }} 
                            />
                        </div>

                        {error && (
                            <div style={{ color: '#ff6b6b', fontSize: '0.9rem', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', cursor: 'pointer', marginTop: '1rem', padding: '1rem', border: 'none', background: 'var(--accent)', color: 'var(--bg)', fontWeight: 600, fontSize: '1rem', borderRadius: '4px' }}>
                            {loading ? 'Authenticating...' : 'Access Gallery'}
                        </button>
                    </form>
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <p className="text-body" style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                            Forgot your password? Please <a href="/contact" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>contact us</a>.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
