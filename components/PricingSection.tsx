"use client";

import React, { useState } from 'react';

const pricingData: Record<string, any[]> = {
  "PORTRAIT SESSIONS": [
    {
      title: "Basic",
      price: "₦15,000",
      features: [
        "1 outfit",
        "1 hour session",
        "3 edited photos",
        "Shared via WhatsApp"
      ]
    },
    {
      title: "Standard",
      price: "₦20,000",
      isPopular: true,
      features: [
        "Max 2 outfits",
        "1 hr 30 min session",
        "5 edited photos",
        "Online gallery"
      ]
    },
    {
      title: "Premium",
      price: "₦30,000",
      features: [
        "Max 3 outfits",
        "2 hour session",
        "Short content videos",
        "8 edited photos",
        "Online gallery"
      ]
    }
  ],
  "LIFESTYLE PHOTOSHOOT": [
    {
      title: "Starter",
      price: "₦30,000",
      features: [
        "1 hour session",
        "3 edited photos"
      ]
    },
    {
      title: "Standard",
      price: "₦40,000",
      isPopular: true,
      features: [
        "1 hr 30 min session",
        "5 edited photos"
      ]
    },
    {
      title: "Extended",
      price: "₦60,000",
      features: [
        "2 hr 30 min session",
        "8 edited photos"
      ]
    }
  ],
  "CONVOCATION / INDUCTION": [
    {
      title: "Basic",
      price: "₦15,000",
      features: [
        "1 outfit",
        "1 hour session",
        "3 edited photos",
        "Shared via WhatsApp"
      ]
    },
    {
      title: "Standard",
      price: "₦20,000",
      features: [
        "Max 2 outfits",
        "1 hr 30 min session",
        "5 edited photos",
        "Online gallery"
      ]
    },
    {
      title: "Premium",
      price: "₦30,000",
      features: [
        "Max 3 outfits",
        "2 hour session",
        "Short content videos",
        "8 edited photos",
        "Online gallery"
      ]
    }
  ],
  "SPORTS COVERAGE": [
    {
      title: "Individual – Photos",
      price: "₦10,000",
      features: [
        "Single player / athlete",
        "Match-day action shots",
        "Edited highlights delivered online"
      ]
    },
    {
      title: "Individual – Video",
      price: "₦25,000",
      features: [
        "Single player / athlete",
        "Video highlight reel",
        "Delivered online"
      ]
    },
    {
      title: "Individual – Combo",
      price: "₦30,000",
      isPopular: true,
      features: [
        "Photos + video highlights",
        "Best value for individuals",
        "Delivered online"
      ]
    },
    {
      title: "Team – Photos",
      price: "₦30,000",
      features: [
        "Full team coverage",
        "Match-day action shots",
        "Edited photos delivered online"
      ]
    },
    {
      title: "Team – Video",
      price: "₦80,000",
      features: [
        "Full team coverage",
        "Match highlight video",
        "Delivered online"
      ]
    },
    {
      title: "Team – Combo",
      price: "₦100,000",
      features: [
        "Photos + video highlights",
        "Full team coverage",
        "Best value for teams",
        "Delivered online"
      ]
    }
  ],
  "WEDDING PHOTOGRAPHY": [
    {
      title: "The Classic Romance",
      price: "₦250,000",
      features: [
        "1 Photographer + 1 Videographer",
        "6 hours wedding day coverage",
        "12×16 Premium Photobook",
        "1 Framed Portrait"
      ]
    },
    {
      title: "The Signature Story",
      price: "₦370,000",
      isPopular: true,
      features: [
        "1 Photographer + 1 Videographer",
        "Pre-wedding shoot included",
        "8 hours wedding day coverage",
        "12×24 Luxury Photobook",
        "1 Framed Portrait"
      ]
    },
    {
      title: "The Eternal Love",
      price: "₦450,000",
      features: [
        "2 Photographers + 2 Videographers",
        "Pre-wedding shoot + Bridal shower",
        "Full wedding day coverage",
        "12×24 Luxury Synthetic Photobook",
        "1 Framed Portrait",
        "Priority delivery — 3 weeks"
      ]
    },
    {
      title: "The Royal Experience",
      price: "₦600,000",
      features: [
        "2 Photographers + 2 Videographers",
        "Unlimited coverage",
        "Pre-wedding + Bridal shower + Wedding day",
        "Luxury 12×24 Photobook",
        "1 Premium Frame",
        "Highlight video slideshow",
        "Priority delivery — 2 weeks"
      ]
    }
  ]
};

export function PricingSection({ hideButton = false }: { hideButton?: boolean }) {
  const categories = Object.keys(pricingData);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const activePackages = pricingData[activeCategory] || [];

  return (
    <section id="pricing" className="pricing-section">
      <div className="pricing-header">
        <h2>Pricing & Packages</h2>
        <p>
          Transparent pricing across every service we offer. Select a package that fits your needs or contact us for a custom quote.
        </p>
      </div>

      {/* Categories / Tabs */}
      <div className="pricing-categories">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="pricing-grid">
        {activePackages.length > 0 ? (
          activePackages.map((pkg, index) => (
            <div 
              key={index}
              className={`pricing-card ${pkg.isPopular ? 'popular' : ''}`}
            >
              {pkg.isPopular && (
                <div className="popular-badge">
                  Most Popular
                </div>
              )}
              
              <h3 className="card-title text-center">{pkg.title}</h3>
              {pkg.description && <p className="card-desc text-center">{pkg.description}</p>}
              
              <div className="card-price justify-center">{pkg.price}</div>
              
              <ul className="card-features">
                {pkg.features.map((feature: string, fIdx: number) => (
                  <li key={fIdx}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <a 
                href="#contact" 
                className="card-btn card-btn-primary"
              >
                Book Now
              </a>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center opacity-50 py-12">
            Pricing details for {activeCategory} are being updated. Please check back later.
          </div>
        )}
      </div>

      {!hideButton && (
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <a href="/pricing" className="btn-outline">View Full Pricing Guide</a>
        </div>
      )}
    </section>
  );
}
