"use client";

export default function ClientGallery() {
    return (
        <section className="section-padding" style={{ paddingTop: '6rem', paddingBottom: '6rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="section-header">
                <h1 className="title-lg">Client Gallery</h1>
                <p className="text-body large" style={{ margin: '0 auto' }}>
                    Access your private collection of memories.
                </p>
            </div>

            <div style={{ 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '8px', 
                padding: '3rem',
                width: '100%',
                maxWidth: '500px'
            }}>
                <form className="input-group" onSubmit={(e) => e.preventDefault()}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="input-label">Gallery Name</label>
                        <input type="text" className="input-field" placeholder="e.g. The Smiths Wedding" />
                    </div>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <label className="input-label">Password</label>
                        <input type="password" className="input-field" placeholder="Enter password" />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', cursor: 'pointer' }}>
                        Access Gallery
                    </button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <p className="text-body" style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                        Forgot your password? Please <a href="/contact" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>contact us</a>.
                    </p>
                </div>
            </div>
        </section>
    );
}
