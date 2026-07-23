<script>
        (() => {
            'use strict';

            // Load content from CONFIG
            function loadContent() {
                document.getElementById('hero-subtitle').textContent = CONFIG.hero.subtitle;
                document.getElementById('hero-title').textContent = CONFIG.hero.title;
                document.getElementById('hero-tagline').textContent = CONFIG.hero.tagline;
                document.getElementById('hero-btn-1').textContent = CONFIG.hero.mainButton;
                document.getElementById('hero-btn-2').textContent = CONFIG.hero.secondaryButton;

                const emailLink = document.getElementById('contact-email');
                emailLink.href = `mailto:${CONFIG.contact.email}`;
                emailLink.textContent = CONFIG.contact.email;

                const phoneLink = document.getElementById('contact-phone');
                phoneLink.href = `tel:${CONFIG.contact.phone}`;
                phoneLink.textContent = CONFIG.contact.phone;

                document.getElementById('action-email').href = `mailto:${CONFIG.contact.email}`;
                document.getElementById('action-phone').href = `tel:${CONFIG.contact.phone.replace(/\s/g, '')}`;
                document.getElementById('footer-instagram').href = `https://instagram.com/${CONFIG.contact.instagram.replace('@', '')}`;
                document.getElementById('footer-instagram').textContent = 'Instagram';
                document.getElementById('footer-tiktok').href = `https://tiktok.com/${CONFIG.contact.tiktok}`;
                document.getElementById('footer-tiktok').textContent = 'TikTok';
                document.getElementById('footer-email').href = `mailto:${CONFIG.contact.email}`;
                document.getElementById('footer-email').textContent = 'Email';
                document.getElementById('whatsapp-btn').href = `https://wa.me/${CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hi, I'd like to book a photography session")}`;

                // Testimonials
                document.getElementById('testimonials-container').innerHTML = CONFIG.testimonials.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-stars">${'★'.repeat(t.stars)}</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">${t.author}</div>
      <div class="testimonial-meta">${t.meta}</div>
    </div>
  `).join('');

                // Pricing
                // Pricing — tabbed by category
                let activePricingCategory = 0;

                function renderPricingTabs() {
                    document.getElementById('pricing-tabs').innerHTML = CONFIG.pricing.map((cat, i) => `
      <button class="pricing-tab ${i === activePricingCategory ? 'active' : ''}"
        onclick="selectPricingCategory(${i})">${cat.category}</button>
    `).join('');
                }

                function renderPricingCards() {
                    const cat = CONFIG.pricing[activePricingCategory];
                    document.getElementById('pricing-container').innerHTML = cat.tiers.map(t => `
      <div class="pricing-card ${t.featured ? 'featured' : ''}">
        <h3 class="pricing-title">${t.name}</h3>
        <div class="pricing-price">${t.price}</div>
        <ul class="pricing-features">${t.features.map(f => `<li>${f}</li>`).join('')}</ul>
        <button class="hero-cta" data-page="contact">Book Now</button>
      </div>
    `).join('');
                    document.getElementById('pricing-note').textContent = cat.note || '';
                }

                window.selectPricingCategory = function (index) {
                    activePricingCategory = index;
                    renderPricingTabs();
                    renderPricingCards();
                };

                renderPricingTabs();
                renderPricingCards();

                // Services
                const iconMap = {
                    wedding: '<path d="M12 2L10.5 8H6l4.5 3.5L8 18l4-3 4 3-2.5-6.5L18 8h-4.5L12 2z"/>',
                    portrait: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>',
                    corporate: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h6M9 17h6"/>'
                };
                document.getElementById('services-container').innerHTML = CONFIG.services.map(s => `
    <div class="service-card">
      <div class="service-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${iconMap[s.icon] || iconMap.portrait}</svg>
      </div>
      <h3 class="service-title">${s.title}</h3>
      <p class="service-desc">${s.description}</p>
      <ul class="service-features">${s.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <button class="hero-cta" data-page="contact">Get Started</button>
    </div>
  `).join('');

                // FAQ
                document.getElementById('faq-container').innerHTML = CONFIG.faq.map((item, i) => `
    <div class="faq-item">
      <button class="faq-question" onclick="toggleFAQ(${i})">${item.question}</button>
      <div class="faq-answer" id="faq-${i}"><p>${item.answer}</p></div>
    </div>
  `).join('');

                // Blog
                document.getElementById('blog-container').innerHTML = CONFIG.blog.map(post => `
    <div class="blog-card">
      <div class="blog-card-image">${mkImg(post.image, post.title, 'lazy')}</div>
      <div class="blog-card-content">
        <div class="blog-card-meta">${post.category} — ${post.date}</div>
        <h3 class="blog-card-title">${post.title}</h3>
        <p class="blog-card-excerpt">${post.excerpt}</p>
      </div>
    </div>
  `).join('');

                // Portfolio
                const portfolioHome = document.getElementById('portfolio-home');
                const portfolioFull = document.getElementById('portfolio-full');
                const heroGallery = document.getElementById('hero-gallery');

                portfolioHome.innerHTML = CONFIG.portfolio.slice(0, 6).map(img => `
    <div class="masonry-item">${mkImg(img.src, img.alt, 'lazy')}</div>
  `).join('');

                portfolioFull.innerHTML = CONFIG.portfolio.map(img => `
    <div class="portfolio-item" data-cat="${img.category}">
      <div class="masonry-item">${mkImg(img.src, img.alt, 'lazy')}</div>
    </div>
  `).join('');

                // Hero images are above the fold — eager + high priority
                heroGallery.innerHTML = CONFIG.portfolio.slice(0, 4).map(img => `
    <div class="hero-gallery-item">${mkImg(img.src, img.alt, 'eager', true)}</div>
  `).join('');
            }

            // ─── Image Loading System ────────────────────────────────────────────────────
            // mkImg(src, alt, loading, highPriority)
            //   Returns an HTML string: a .mk-img-wrap containing a .mk-img <img>.
            //   The wrapper shows a shimmer until the image fires onload, then fades in.
            //   On onerror the wrapper shows a clean fallback (no broken icon).
            function mkImg(src, alt, loading = 'lazy', highPriority = false) {
                const fetchAttr = highPriority ? ' fetchpriority="high"' : '';
                return `<div class="mk-img-wrap" data-src="${src}">` +
                    `<img class="mk-img" src="${src}" alt="${alt || ''}" ` +
                    `loading="${loading}" decoding="async"${fetchAttr} ` +
                    `onload="this.parentNode.setAttribute('data-loaded','')" ` +
                    `onerror="this.parentNode.setAttribute('data-error','')">` +
                    `</div>`;
            }

            // Wire up any .mk-img-wrap that was rendered into static HTML
            // (logo and footer logo — those are not JS-rendered)
            function wireStaticImages() {
                document.querySelectorAll('.mk-img-wrap:not([data-wired])').forEach(wrap => {
                    wrap.setAttribute('data-wired', '');
                    const img = wrap.querySelector('.mk-img');
                    if (!img) return;
                    if (img.complete && img.naturalWidth > 0) {
                        wrap.setAttribute('data-loaded', '');
                    } else if (img.complete) {
                        wrap.setAttribute('data-error', '');
                    }
                    // onload/onerror are already inline — this just handles already-cached images
                });
            }

            loadContent();
            wireStaticImages();

            // FAQ Toggle
            window.toggleFAQ = (index) => {
                const answer = document.getElementById(`faq-${index}`);
                const question = answer.previousElementSibling;
                answer.classList.toggle('active');
                question.classList.toggle('active');
            };

            // Portfolio Filter
            document.addEventListener('click', (e) => {
                if (e.target.matches('.filter-btn')) {
                    const filter = e.target.dataset.filter;
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');

                    const items = document.querySelectorAll('.portfolio-item');
                    items.forEach(item => {
                        if (filter === 'all' || item.dataset.cat === filter) {
                            item.classList.remove('hide');
                        } else {
                            item.classList.add('hide');
                        }
                    });
                }
            });

            // Gallery Unlock
            // ── Client Gallery System ────────────────────────────────────────────────────
            let galleryToken = sessionStorage.getItem('mk_gallery_token') || '';
            let gallerySlug = sessionStorage.getItem('mk_gallery_slug') || '';
            let lightboxImages = [];
            let lightboxIndex = 0;

            // On entering the gallery page, check if already authenticated
            function initGalleryPage() {
                if (galleryToken && gallerySlug) {
                    showGalleryView();
                    fetchGalleryPhotos();
                } else {
                    document.getElementById('gallery-step-1').style.display = 'block';
                    document.getElementById('gallery-step-2').style.display = 'none';
                    document.getElementById('gallery-view').style.display = 'none';
                }
            }

            // Step 1 → Step 2
            function galleryNextStep() {
                const slug = document.getElementById('gallery-slug-input').value.trim().toLowerCase();
                const errEl = document.getElementById('gallery-slug-error');
                if (!slug) { errEl.textContent = 'Please enter your gallery name'; errEl.style.display = 'block'; return; }
                errEl.style.display = 'none';
                gallerySlug = slug;
                document.getElementById('gallery-step2-title').textContent = slug;
                document.getElementById('gallery-step-1').style.display = 'none';
                document.getElementById('gallery-step-2').style.display = 'block';
                document.getElementById('gallery-password-input').focus();
            }

            function galleryBack() {
                document.getElementById('gallery-step-2').style.display = 'none';
                document.getElementById('gallery-step-1').style.display = 'block';
            }

            // Step 2 → Authenticate
            async function galleryAuthenticate() {
                const password = document.getElementById('gallery-password-input').value;
                const errEl = document.getElementById('gallery-pw-error');
                const btn = document.getElementById('gallery-auth-btn');
                if (!password) { errEl.textContent = 'Enter your password'; errEl.style.display = 'block'; return; }

                errEl.style.display = 'none';
                btn.disabled = true; btn.textContent = 'Checking...';

                try {
                    const res = await fetch('/api/gallery-auth', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ slug: gallerySlug, password }),
                    });
                    const data = await res.json();

                    if (!res.ok) {
                        errEl.textContent = data.error || 'Incorrect password';
                        errEl.style.display = 'block';
                        return;
                    }

                    galleryToken = data.token;
                    sessionStorage.setItem('mk_gallery_token', galleryToken);
                    sessionStorage.setItem('mk_gallery_slug', gallerySlug);

                    // Show gallery name + event info
                    document.getElementById('gallery-view-title').textContent = data.gallery.client_name + '\u2019s Gallery';
                    const meta = [data.gallery.event_type, data.gallery.event_date ? new Date(data.gallery.event_date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) : ''].filter(Boolean).join(' · ');
                    document.getElementById('gallery-view-meta').textContent = meta;

                    showGalleryView();
                    fetchGalleryPhotos();
                } catch {
                    errEl.textContent = 'Connection error. Please try again.';
                    errEl.style.display = 'block';
                } finally {
                    btn.disabled = false; btn.textContent = 'View My Gallery';
                }
            }

            function showGalleryView() {
                document.getElementById('gallery-step-1').style.display = 'none';
                document.getElementById('gallery-step-2').style.display = 'none';
                document.getElementById('gallery-view').style.display = 'block';
            }

            async function fetchGalleryPhotos() {
                const loadEl = document.getElementById('gallery-loading');
                const emptyEl = document.getElementById('gallery-empty');
                const gridEl = document.getElementById('gallery-photos-grid');

                loadEl.style.display = 'block';
                emptyEl.style.display = 'none';
                gridEl.innerHTML = '';

                try {
                    const res = await fetch('/api/gallery-photos', {
                        headers: { Authorization: `Bearer ${galleryToken}` },
                    });
                    const data = await res.json();

                    if (!res.ok) {
                        if (res.status === 401) { galleryLogout(); return; }
                        throw new Error(data.error);
                    }

                    loadEl.style.display = 'none';
                    const images = data.images || [];
                    lightboxImages = images.map(img => img.cloudinary_url);

                    if (!images.length) { emptyEl.style.display = 'block'; return; }

                    gridEl.innerHTML = images.map((img, i) => {
                        const thumb = img.cloudinary_url.replace('/upload/', '/upload/w_600,c_fill,q_auto/');
                        return `<div class="gallery-photo-item" onclick="openLightbox(${i})">
        <img src="${thumb}" alt="Photo ${i + 1}" loading="lazy">
      </div>`;
                    }).join('');

                    // Block right-click on all gallery images
                    gridEl.addEventListener('contextmenu', e => e.preventDefault());
                } catch (e) {
                    loadEl.textContent = 'Failed to load photos. Please refresh and try again.';
                }
            }

            function galleryLogout() {
                galleryToken = ''; gallerySlug = '';
                sessionStorage.removeItem('mk_gallery_token');
                sessionStorage.removeItem('mk_gallery_slug');
                document.getElementById('gallery-step-1').style.display = 'block';
                document.getElementById('gallery-step-2').style.display = 'none';
                document.getElementById('gallery-view').style.display = 'none';
                document.getElementById('gallery-slug-input').value = '';
                document.getElementById('gallery-password-input').value = '';
            }

            // ── Lightbox ──────────────────────────────────────────────────────────────────
            function openLightbox(index) {
                lightboxIndex = index;
                const lb = document.getElementById('gallery-lightbox');
                lb.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                showLightboxImage();
                lb.addEventListener('contextmenu', e => e.preventDefault());
            }
            function closeLightbox() {
                document.getElementById('gallery-lightbox').style.display = 'none';
                document.body.style.overflow = '';
            }
            function showLightboxImage() {
                const url = lightboxImages[lightboxIndex].replace('/upload/', '/upload/w_1400,q_auto/');
                document.getElementById('lightbox-img').src = url;
                document.getElementById('lightbox-counter').textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
            }
            function lightboxPrev() { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; showLightboxImage(); }
            function lightboxNext() { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; showLightboxImage(); }

            // Keyboard navigation for lightbox
            document.addEventListener('keydown', e => {
                if (document.getElementById('gallery-lightbox').style.display === 'flex') {
                    if (e.key === 'ArrowLeft') lightboxPrev();
                    if (e.key === 'ArrowRight') lightboxNext();
                    if (e.key === 'Escape') closeLightbox();
                }
            });

            // Swipe support for mobile lightbox
            let touchStartX = 0;
            document.getElementById('gallery-lightbox').addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
            document.getElementById('gallery-lightbox').addEventListener('touchend', e => {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) { diff > 0 ? lightboxNext() : lightboxPrev(); }
            });



            // Contact Form — tries /api/contact first, falls back to WhatsApp
            document.getElementById('contact-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const success = document.getElementById('form-success');
                const error = document.getElementById('form-error');
                const submitBtn = form.querySelector('.form-submit');
                const originalText = submitBtn.textContent;

                error.style.display = 'none';
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                // Collect form data
                const fd = new FormData(form);
                const payload = Object.fromEntries(fd.entries());
                const { name, email, phone, event_date, service, message, _honeypot } = payload;

                // Honeypot check
                if (_honeypot) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    return;
                }

                // ── Try API first ──────────────────────────────────────────────
                let apiOk = false;
                try {
                    const res = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify(payload),
                    });
                    if (res.ok) apiOk = true;
                } catch { /* offline or API not ready — fall through to WhatsApp */ }

                if (apiOk) {
                    success.style.display = 'block';
                    form.reset();
                    setTimeout(() => success.style.display = 'none', 6000);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    return;
                }

                // ── Fallback: open WhatsApp with details pre-filled ───────────
                const wa = CONFIG.contact.whatsapp.replace(/[^0-9]/g, '');
                const lines = [
                    `Hello MK Photography, I'd like to book a session.`,
                    ``,
                    `*Name:* ${name || '—'}`,
                    `*Email:* ${email || '—'}`,
                    `*Phone:* ${phone || '—'}`,
                    `*Service:* ${service || '—'}`,
                    `*Event Date:* ${event_date || '—'}`,
                    ``,
                    `*Message:*`,
                    message || '—',
                ];
                const waUrl = `https://wa.me/${wa}?text=${encodeURIComponent(lines.join('\n'))}`;

                // Show success message then open WhatsApp
                success.textContent = '✓ Opening WhatsApp to complete your booking...';
                success.style.display = 'block';
                form.reset();

                setTimeout(() => {
                    window.open(waUrl, '_blank');
                    success.textContent = '✓ Message sent successfully! We\'ll get back to you within 24 hours.';
                    setTimeout(() => success.style.display = 'none', 5000);
                }, 800);

                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });

            // Theme toggle
            let theme = localStorage.getItem('theme') || 'dark';
            const themeBtns = document.querySelectorAll('.theme-toggle');
            const updateTheme = () => {
                document.documentElement.setAttribute('data-theme', theme);
                themeBtns.forEach(btn => {
                    const sun = btn.querySelector('.sun');
                    const moon = btn.querySelector('.moon');
                    if (theme === 'dark') { sun.style.display = 'none'; moon.style.display = 'block'; }
                    else { sun.style.display = 'block'; moon.style.display = 'none'; }
                });
            };
            updateTheme();
            themeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    theme = theme === 'dark' ? 'light' : 'dark';
                    localStorage.setItem('theme', theme);
                    updateTheme();
                });
            });

            // Mobile menu
            const burger = document.querySelector('.burger');
            const menu = document.querySelector('.nav-menu');
            burger.addEventListener('click', () => {
                burger.classList.toggle('open');
                menu.classList.toggle('open');
            });

            // Hide header on scroll
            let lastScroll = 0;
            const header = document.querySelector('.header');
            window.addEventListener('scroll', () => {
                const scroll = window.pageYOffset;
                if (scroll > lastScroll && scroll > 100) header.classList.add('hide');
                else header.classList.remove('hide');
                lastScroll = scroll <= 0 ? 0 : scroll;
            });

            // Page navigation
            const pages = ['home', 'portfolio', 'services', 'pricing', 'blog', 'gallery', 'contact'];
            const go = (name) => {
                pages.forEach(p => {
                    const el = document.getElementById(`page-${p}`);
                    if (el) el.classList.toggle('active', p === name);
                });
                document.querySelectorAll('.nav-menu a, .nav-cta').forEach(a => a.classList.toggle('active', a.dataset.page === name));
                window.scrollTo({ top: 0, behavior: 'smooth' });
                menu.classList.remove('open');
                burger.classList.remove('open');
                // Init gallery auth state when navigating to gallery page
                if (name === 'gallery') initGalleryPage();
            };

            document.addEventListener('click', e => {
                const t = e.target.closest('[data-page]');
                if (!t) return;
                e.preventDefault();
                go(t.dataset.page);
            });

            document.getElementById('year').textContent = new Date().getFullYear();
        })();
    </script>