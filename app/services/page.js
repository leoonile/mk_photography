import Link from 'next/link';
import img1 from '../../images/wedding-trad-01.jpg';
import img2 from '../../images/portrait-studio-11.jpg';
import img3 from '../../images/event-stadium-01.jpg';
import img4 from '../../images/commercial-studio-03.jpg';

const services = [
    {
        title: 'Weddings',
        description: 'From intimate ceremonies to grand celebrations, we capture the raw emotion, traditional details, and fleeting moments of your special day with a timeless, cinematic approach.',
        image: img1.src
    },
    {
        title: 'Portraits',
        description: 'Professional studio and outdoor portraiture designed to bring out your authentic self. Perfect for personal branding, family sessions, and creative editorials.',
        image: img2.src
    },
    {
        title: 'Events',
        description: 'Comprehensive coverage for corporate galas, award ceremonies, concerts, and stadium events. We ensure every key moment and attendee interaction is beautifully documented.',
        image: img3.src
    },
    {
        title: 'Commercial',
        description: 'High-end commercial photography to elevate your brand. We provide stunning visual assets for marketing campaigns, product launches, and brand storytelling.',
        image: img4.src
    }
];

export default function Services() {
    return (
        <section className="section-padding" style={{ paddingTop: '6rem', paddingBottom: '6rem', minHeight: '100vh' }}>
            <div className="section-header">
                <h1 className="title-lg">Our Services</h1>
                <p className="text-body large" style={{ margin: '0 auto' }}>
                    Tailored photography experiences designed to meet your specific needs.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
                {services.map((service, idx) => (
                    <div key={idx} style={{ 
                        display: 'grid', 
                        gridTemplateColumns: idx % 2 === 0 ? '1fr 1fr' : '1fr 1fr', 
                        gap: '3rem',
                        alignItems: 'center',
                        direction: idx % 2 !== 0 ? 'rtl' : 'ltr'
                    }}>
                        <div style={{ direction: 'ltr' }}>
                            <img 
                                src={service.image} 
                                alt={service.title} 
                                style={{ width: '100%', borderRadius: '4px', aspectRatio: '4/3', objectFit: 'cover' }} 
                            />
                        </div>
                        <div style={{ direction: 'ltr' }}>
                            <h2 className="title-md">{service.title}</h2>
                            <p className="text-body" style={{ fontSize: '1.1rem' }}>{service.description}</p>
                            <Link href="/contact" className="btn-outline" style={{ display: 'inline-block' }}>
                                Inquire Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
