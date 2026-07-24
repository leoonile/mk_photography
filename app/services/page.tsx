import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Services | MK Photography",
  description: "Tailored photography experiences designed to meet your specific needs.",
};

const services = [
    {
        title: 'Weddings',
        description: 'From intimate ceremonies to grand celebrations, we capture the raw emotion, traditional details, and fleeting moments of your special day with a timeless, cinematic approach.',
        image: '/images/wedding-trad-01.jpg'
    },
    {
        title: 'Portraits',
        description: 'Professional studio and outdoor portraiture designed to bring out your authentic self. Perfect for personal branding, family sessions, and creative editorials.',
        image: '/images/portrait-studio-11.jpg'
    },
    {
        title: 'Events',
        description: 'Comprehensive coverage for corporate galas, award ceremonies, concerts, and stadium events. We ensure every key moment and attendee interaction is beautifully documented.',
        image: '/images/event-stadium-01.jpg'
    },
    {
        title: 'Commercial',
        description: 'High-end commercial photography to elevate your brand. We provide stunning visual assets for marketing campaigns, product launches, and brand storytelling.',
        image: '/images/commercial-studio-03.jpg'
    }
];

export default function ServicesPage() {
    return (
        <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)' }}>
            <section className="section-padding" style={{ paddingTop: '4rem', paddingBottom: '6rem', maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="title-lg" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>Our Services</h1>
                    <p className="text-body large" style={{ margin: '0 auto', color: 'var(--muted)', fontSize: '1.1rem' }}>
                        Tailored photography experiences designed to meet your specific needs.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem', maxWidth: '1000px', margin: '0 auto' }}>
                    {services.map((service, idx) => (
                        <div key={idx} style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                            gap: '3rem',
                            alignItems: 'center',
                            direction: idx % 2 !== 0 ? 'rtl' : 'ltr'
                        }}>
                            <div style={{ direction: 'ltr', overflow: 'hidden', borderRadius: '8px' }}>
                                <img 
                                    src={service.image} 
                                    alt={service.title} 
                                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} 
                                />
                            </div>
                            <div style={{ direction: 'ltr' }}>
                                <h2 className="title-md" style={{ fontFamily: 'var(--serif)', fontSize: '2rem', marginBottom: '1rem' }}>{service.title}</h2>
                                <p className="text-body" style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '2rem' }}>{service.description}</p>
                                <Link href="/contact" className="btn-outline" style={{ display: 'inline-block' }}>
                                    Inquire Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
