"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ClientGallery() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("gallery_token");
        if (!token) {
            router.push("/gallery");
            return;
        }

        const fetchImages = async () => {
            try {
                const res = await fetch("/api/gallery-photos", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (res.status === 401) {
                    localStorage.removeItem("gallery_token");
                    router.push("/gallery");
                    return;
                }

                if (!res.ok) {
                    throw new Error("Failed to fetch gallery");
                }

                const data = await res.json();
                setImages(data.images || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [router, slug]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--bg)", color: "var(--fg)" }}>
                Loading your memories...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "var(--bg)", color: "var(--fg)" }}>
                <p style={{ marginBottom: "1rem" }}>{error}</p>
                <button 
                    onClick={() => router.push("/gallery")} 
                    style={{
                        padding: "0.8rem 1.5rem",
                        background: "var(--accent)",
                        color: "var(--bg)",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <main style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg)" }}>
            <section className="section-padding" style={{ paddingTop: "4rem", paddingBottom: "6rem", width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
                <div className="section-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <button 
                        onClick={() => {
                            localStorage.removeItem("gallery_token");
                            router.push("/gallery");
                        }}
                        style={{
                            position: "absolute",
                            top: "100px",
                            left: "2rem",
                            background: "transparent",
                            border: "1px solid var(--border)",
                            color: "var(--fg)",
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        ← Sign Out
                    </button>
                    <h1 className="title-lg" style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem, 3vw, 3rem)", textTransform: "capitalize", color: "var(--fg)" }}>
                        {slug.replace(/-/g, " ")}
                    </h1>
                    <p className="text-body" style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
                        {images.length} {images.length === 1 ? "Photo" : "Photos"}
                    </p>
                </div>

                {images.length > 0 ? (
                    <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                        gap: "1.5rem",
                        width: "100%"
                    }}>
                        {images.map((img) => (
                            <div key={img.id} style={{ 
                                position: "relative", 
                                overflow: "hidden", 
                                borderRadius: "8px",
                                aspectRatio: "4/5",
                                background: "var(--input-bg)"
                            }}>
                                <img 
                                    src={img.cloudinary_url} 
                                    alt={img.filename}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.3s ease"
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", color: "var(--muted)", marginTop: "4rem" }}>
                        No photos have been uploaded to this gallery yet.
                    </div>
                )}
            </section>
        </main>
    );
}
