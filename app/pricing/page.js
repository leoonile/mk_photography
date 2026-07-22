import Link from 'next/link';

export default function Pricing() {
    return (
        <section className="section-padding" style={{ paddingTop: '6rem', paddingBottom: '6rem', minHeight: '100vh' }}>
            <div className="section-header">
                <h1 className="title-lg">Pricing Packages</h1>
                <p className="text-body large" style={{ margin: '0 auto' }}>
                    Transparent pricing across every service we offer. Tailored packages are available upon request.
                </p>
            </div>

            <div className="grid-3" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Standard Package */}
                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px', 
                    padding: '3rem 2rem',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h3 className="title-md">Essential Portrait</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--serif)', marginBottom: '1rem', color: 'var(--accent)' }}>
                        $250
                    </div>
                    <p className="text-body">Perfect for headshots, personal branding, or quick family sessions.</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>1 Hour Session</li>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>1 Location (Studio or Outdoor)</li>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>15 Edited High-Res Images</li>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Online Delivery Gallery</li>
                    </ul>
                    <Link href="/contact" className="btn-outline" style={{ textAlign: 'center', width: '100%' }}>Book Now</Link>
                </div>

                {/* Premium Package */}
                <div style={{ 
                    background: 'rgba(212, 178, 125, 0.05)', 
                    border: '1px solid var(--accent)', 
                    borderRadius: '8px', 
                    padding: '3rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    transform: 'scale(1.05)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    <div style={{ background: 'var(--accent)', color: '#000', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: '1rem', textTransform: 'uppercase' }}>Most Popular</div>
                    <h3 className="title-md">Wedding Standard</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--serif)', marginBottom: '1rem', color: 'var(--accent)' }}>
                        $1,800
                    </div>
                    <p className="text-body">Comprehensive coverage for your special day, capturing all the key moments.</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>8 Hours of Coverage</li>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>2 Photographers</li>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>400+ Edited High-Res Images</li>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Complimentary Engagement Session</li>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Private Online Gallery</li>
                    </ul>
                    <Link href="/contact" className="btn-primary" style={{ textAlign: 'center', width: '100%' }}>Book Now</Link>
                </div>

                {/* Luxury Package */}
                <div style={{ 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px', 
                    padding: '3rem 2rem',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h3 className="title-md">Event Coverage</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--serif)', marginBottom: '1rem', color: 'var(--accent)' }}>
                        $350<span style={{ fontSize: '1rem', color: 'var(--muted)', fontFamily: 'var(--sans)' }}>/hr</span>
                    </div>
                    <p className="text-body">Professional documentation of corporate galas, private parties, and commercial events.</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1 }}>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Minimum 3 Hours</li>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Candid & Posed Coverage</li>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Rapid 48-Hour Turnaround Available</li>
                        <li style={{ padding: '0.8rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Commercial Usage Rights</li>
                    </ul>
                    <Link href="/contact" className="btn-outline" style={{ textAlign: 'center', width: '100%' }}>Book Now</Link>
                </div>
            </div>
        </section>
    );
}
