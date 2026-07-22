import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{ background: '#050505', padding: '6rem 5%', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="grid-3">
                <div>
                    <h3 className="title-md">MK Photography</h3>
                    <p className="text-body" style={{ marginBottom: '1.5rem' }}>
                        Immortalizing the moments. Crafting timeless visual stories since 2021. Based in Benin, Nigeria.
                    </p>
                </div>
                
                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--sans)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.9rem' }}>Navigate</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <li><Link href="/" className="text-body" style={{ margin: 0 }}>Home</Link></li>
                        <li><Link href="/portfolio" className="text-body" style={{ margin: 0 }}>Portfolio</Link></li>
                        <li><Link href="/services" className="text-body" style={{ margin: 0 }}>Services</Link></li>
                        <li><Link href="/pricing" className="text-body" style={{ margin: 0 }}>Pricing</Link></li>
                        <li><Link href="/faq" className="text-body" style={{ margin: 0 }}>FAQ</Link></li>
                        <li><Link href="/contact" className="text-body" style={{ margin: 0 }}>Contact</Link></li>
                    </ul>
                </div>
                
                <div>
                    <h4 style={{ marginBottom: '1.5rem', fontFamily: 'var(--sans)', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.9rem' }}>Connect</h4>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href="#" className="widget-btn" style={{ position: 'relative', width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                            IG
                        </a>
                        <a href="#" className="widget-btn" style={{ position: 'relative', width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                            TK
                        </a>
                        <a href="mailto:hello@mkphotography.com" className="widget-btn" style={{ position: 'relative', width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ fontSize: '1.2rem' }}>✉</span>
                        </a>
                    </div>
                </div>
            </div>
            
            <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <p className="text-body" style={{ margin: 0, fontSize: '0.85rem' }}>
                    &copy; {new Date().getFullYear()} MK Photography. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
