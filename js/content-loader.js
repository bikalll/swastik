/**
 * Swastik Interiors — Content Loader
 * Fetches CMS data from Supabase and dynamically renders it into the page.
 * Falls back to the existing hardcoded HTML if Supabase is unreachable or returns no data.
 */

(function () {
    'use strict';

    const client = window.SupabaseConfig?.getClient();
    if (!client) {
        console.warn('[ContentLoader] Supabase client not available — using static content.');
        return;
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────
    function esc(str) {
        if (!str) return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function stars(rating) {
        const r = Math.min(Math.max(Math.round(rating || 5), 0), 5);
        return Array.from({ length: 5 }, (_, i) =>
            `<span class="star" aria-hidden="true">${i < r ? '★' : '☆'}</span>`
        ).join('');
    }

    function formatPrice(price) {
        if (!price) return '';
        return '₨' + Number(price).toLocaleString('en-IN');
    }

    // ─── HERO SECTION (index.html) ────────────────────────────────────────────
    async function loadHero() {
        const titleEl = document.querySelector('.hero__title');
        const subtitleEl = document.querySelector('.hero__subtitle');
        const bgEl = document.querySelector('.hero__bg');
        if (!titleEl) return; // not on this page

        try {
            const { data, error } = await client
                .from('hero_sections')
                .select('*')
                .eq('page_slug', 'home')
                .single();

            if (error || !data) return;

            if (data.title) titleEl.textContent = data.title;
            if (data.subtitle) subtitleEl.textContent = data.subtitle;
            if (data.background_image && bgEl) bgEl.src = data.background_image;

            // Update CTA buttons if present
            if (data.cta_primary_text || data.cta_primary_link) {
                const ctaBtn = document.querySelector('.hero__actions .btn--primary');
                if (ctaBtn) {
                    if (data.cta_primary_text) ctaBtn.textContent = data.cta_primary_text;
                    if (data.cta_primary_link) ctaBtn.href = data.cta_primary_link;
                }
            }
        } catch (e) {
            console.warn('[ContentLoader] Hero fetch failed:', e.message);
        }
    }

    // ─── COLLECTIONS (index.html) ─────────────────────────────────────────────
    async function loadCollections() {
        const grid = document.querySelector('.collections__grid');
        if (!grid) return;

        try {
            const { data, error } = await client
                .from('collections')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error || !data || data.length === 0) return;

            grid.innerHTML = data.map(c => `
                <article class="collection-card${c.is_featured ? ' collection-card--featured' : ''}" data-category="${esc(c.category_slug || '')}">
                    <div class="collection-card__image-wrapper">
                        ${c.image_url ? `<img class="collection-card__img" src="${esc(c.image_url)}" alt="${esc(c.name)}" loading="lazy" />` : ''}
                        ${c.badge ? `<div class="collection-card__overlay"><div class="collection-card__badge">${esc(c.badge)}</div></div>` : ''}
                    </div>
                    <div class="collection-card__content">
                        <div class="collection-card__header">
                            <h3 class="collection-card__title">${esc(c.name)}</h3>
                            ${c.item_count ? `<p class="collection-card__count">${esc(c.item_count)}</p>` : ''}
                        </div>
                        ${c.description ? `<p class="collection-card__desc">${esc(c.description)}</p>` : ''}
                        <div class="collection-card__actions">
                            <button class="btn btn--collection" aria-label="Explore ${esc(c.name)}">
                                <span>Explore Collection</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                            </button>
                        </div>
                    </div>
                </article>
            `).join('');
        } catch (e) {
            console.warn('[ContentLoader] Collections fetch failed:', e.message);
        }
    }

    // ─── TESTIMONIALS (index.html) ────────────────────────────────────────────
    async function loadTestimonials() {
        const track = document.getElementById('testimonials-track');
        const indicators = document.querySelector('.testimonials__indicators');
        if (!track) return;

        try {
            const { data, error } = await client
                .from('testimonials')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error || !data || data.length === 0) return;

            track.innerHTML = data.map((t, i) => `
                <div class="testimonials__slide${i === 0 ? ' active' : ''}">
                    <div class="testimonials__slide-content">
                        <article class="testimonial${t.is_featured ? ' testimonial--featured' : ''}">
                            <div class="testimonial__backdrop"></div>
                            <div class="testimonial__quote-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="36" height="36"><path fill="currentColor" d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z"/></svg>
                            </div>
                            <div class="testimonial__content">
                                <blockquote class="testimonial__text">"${esc(t.quote)}"</blockquote>
                                <div class="testimonial__rating" aria-label="${t.rating || 5} out of 5 stars">
                                    <div class="stars">${stars(t.rating)}</div>
                                    ${t.rating_text ? `<span class="rating-text">${esc(t.rating_text)}</span>` : ''}
                                </div>
                                <div class="testimonial__author">
                                    <div class="testimonial__avatar">
                                        ${t.avatar_url
                    ? `<img src="${esc(t.avatar_url)}" alt="${esc(t.name)}" />`
                    : `<div style="width:48px;height:48px;border-radius:50%;background:var(--clr-accent,#7a5130);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:18px">${esc((t.name || '?')[0])}</div>`
                }
                                        <div class="avatar-glow"></div>
                                    </div>
                                    <div class="testimonial__author-info">
                                        <div class="testimonial__author-name">${esc(t.name)}</div>
                                        ${t.title ? `<div class="testimonial__author-title">${esc(t.title)}</div>` : ''}
                                        ${t.location ? `
                                        <div class="testimonial__location">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                            ${esc(t.location)}
                                        </div>` : ''}
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            `).join('');

            // Re-create indicators
            if (indicators) {
                indicators.innerHTML = data.map((_, i) =>
                    `<button class="testimonials__indicator${i === 0 ? ' active' : ''}" data-slide="${i}" aria-label="Go to testimonial ${i + 1}"></button>`
                ).join('');
            }
        } catch (e) {
            console.warn('[ContentLoader] Testimonials fetch failed:', e.message);
        }
    }

    // ─── FAQ (index.html) ─────────────────────────────────────────────────────
    async function loadFAQs() {
        const grid = document.querySelector('.faq__grid');
        if (!grid) return;

        try {
            const { data, error } = await client
                .from('faqs')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error || !data || data.length === 0) return;

            grid.innerHTML = data.map((f, i) => {
                const num = String(i + 1).padStart(2, '0');
                return `
                <article class="faq__card" data-faq="${i + 1}">
                    <button class="faq__question" aria-expanded="false" aria-controls="faq-answer-${i + 1}" tabindex="0">
                        <div class="faq__question-wrapper">
                            <div class="faq__question-number">${num}</div>
                            <h3 class="faq__question-text">${esc(f.question)}</h3>
                            <div class="faq__question-icon" aria-hidden="true">
                                <svg class="faq__icon-plus" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                <svg class="faq__icon-minus" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </div>
                        </div>
                    </button>
                    <div class="faq__answer" id="faq-answer-${i + 1}" aria-hidden="true" role="region" aria-labelledby="faq-question-${i + 1}">
                        <div class="faq__answer-wrapper">
                            <div class="faq__answer-content">
                                <p class="faq__answer-text">${esc(f.answer)}</p>
                            </div>
                        </div>
                    </div>
                </article>`;
            }).join('');

            // Re-attach FAQ toggle handlers (since we replaced the HTML)
            grid.querySelectorAll('.faq__question').forEach(btn => {
                btn.addEventListener('click', function () {
                    const card = this.closest('.faq__card');
                    const answer = card.querySelector('.faq__answer');
                    const isOpen = this.getAttribute('aria-expanded') === 'true';

                    // Close all
                    grid.querySelectorAll('.faq__card').forEach(c => {
                        c.querySelector('.faq__question')?.setAttribute('aria-expanded', 'false');
                        c.querySelector('.faq__answer')?.setAttribute('aria-hidden', 'true');
                        c.classList.remove('active');
                    });

                    if (!isOpen) {
                        this.setAttribute('aria-expanded', 'true');
                        answer.setAttribute('aria-hidden', 'false');
                        card.classList.add('active');
                    }
                });
            });
        } catch (e) {
            console.warn('[ContentLoader] FAQs fetch failed:', e.message);
        }
    }

    // ─── PARTNERS / CLIENTS (index.html) ──────────────────────────────────────
    async function loadPartners() {
        const marqueeInner = document.querySelector('.clients-marquee__inner');
        if (!marqueeInner) return;

        try {
            const { data, error } = await client
                .from('partners')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error || !data || data.length === 0) return;

            const itemsHTML = data.map(p => `
                <div class="client-modern">
                    <img class="client-logo" src="${esc(p.logo_url)}" alt="${esc(p.company_name)}">
                    <span class="client-name" style="display:none;">${esc(p.company_name)}</span>
                </div>
            `).join('');

            // Two groups for seamless marquee looping
            marqueeInner.innerHTML = `
                <div class="clients-marquee__group">${itemsHTML}</div>
                <div class="clients-marquee__group" aria-hidden="true">${itemsHTML}</div>
            `;
        } catch (e) {
            console.warn('[ContentLoader] Partners fetch failed:', e.message);
        }
    }

    // ─── PRODUCTS (products.html) ─────────────────────────────────────────────
    async function loadProducts() {
        const grid = document.querySelector('.products-grid');
        const filtersContainer = document.querySelector('.category-filters');
        if (!grid) return;

        try {
            // Fetch categories and products in parallel
            const [catRes, prodRes] = await Promise.all([
                client.from('product_categories').select('*').order('display_order'),
                client.from('products').select('*, product_categories(name, slug)').eq('is_active', true).order('display_order')
            ]);

            const categories = catRes.data || [];
            const products = prodRes.data || [];
            if (products.length === 0) return;

            // Render category filter buttons
            if (filtersContainer && categories.length > 0) {
                filtersContainer.innerHTML = `
                    <button class="filter-btn filter-btn--active" data-filter="all">All Products</button>
                    ${categories.map(c => `<button class="filter-btn" data-filter="${esc(c.slug)}">${esc(c.name)}</button>`).join('')}
                `;

                // Attach filter logic
                filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
                        this.classList.add('filter-btn--active');
                        const filter = this.dataset.filter;
                        grid.querySelectorAll('.product-card').forEach(card => {
                            card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
                        });
                    });
                });
            }

            // Render products
            grid.innerHTML = products.map(p => {
                const catSlug = p.product_categories?.slug || '';
                const features = Array.isArray(p.features) ? p.features : [];
                return `
                <article class="product-card" data-category="${esc(catSlug)}">
                    <div class="product-card__image">
                        ${p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" />` : ''}
                        <div class="product-card__overlay">
                            <div class="product-card__actions">
                                <button class="product-action-btn" aria-label="Quick View">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                                </button>
                                <button class="product-action-btn" aria-label="Add to Wishlist">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                </button>
                            </div>
                        </div>
                        ${p.badge ? `<div class="product-card__badge${p.badge.toLowerCase() === 'new' ? ' product-card__badge--new' : ''}">${esc(p.badge)}</div>` : ''}
                    </div>
                    <div class="product-card__content">
                        <h3 class="product-card__title">${esc(p.name)}</h3>
                        ${p.description ? `<p class="product-card__description">${esc(p.description)}</p>` : ''}
                        ${features.length ? `<div class="product-card__features">${features.map(f => `<span class="product-feature">${esc(f)}</span>`).join('')}</div>` : ''}
                        <div class="product-card__footer">
                            <div class="product-card__price">
                                ${p.price ? `<span class="price-current">${formatPrice(p.price)}</span>` : ''}
                                ${p.original_price ? `<span class="price-original">${formatPrice(p.original_price)}</span>` : ''}
                            </div>
                            <button class="btn btn--small btn--primary">View Details</button>
                        </div>
                    </div>
                </article>`;
            }).join('');
        } catch (e) {
            console.warn('[ContentLoader] Products fetch failed:', e.message);
        }
    }

    // ─── SERVICES (services.html) ─────────────────────────────────────────────
    async function loadServices() {
        const grid = document.querySelector('.services-grid');
        if (!grid) return;

        try {
            const { data, error } = await client
                .from('services')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error || !data || data.length === 0) return;

            grid.innerHTML = data.map(s => {
                const features = Array.isArray(s.features) ? s.features : [];
                return `
                <article class="service-card${s.is_featured ? ' service-card--featured' : ''}" data-service="${esc(s.title?.toLowerCase().replace(/\s+/g, '-') || '')}">
                    <div class="service-card__background"></div>
                    <div class="service-card__icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                    <div class="service-card__content">
                        <h3 class="service-card__title">${esc(s.title)}</h3>
                        ${s.description ? `<p class="service-card__description">${esc(s.description)}</p>` : ''}
                        ${features.length ? `<div class="service-card__features">${features.map(f => `<span class="service-feature">${esc(f)}</span>`).join('')}</div>` : ''}
                        ${s.starting_price ? `<div class="service-card__price">Starting from <span class="price">${esc(s.starting_price)}</span></div>` : ''}
                    </div>
                </article>`;
            }).join('');
        } catch (e) {
            console.warn('[ContentLoader] Services fetch failed:', e.message);
        }
    }

    // ─── INIT ─────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', async function () {
        // Detect page and load relevant content
        const path = window.location.pathname.toLowerCase();

        if (path.endsWith('products.html')) {
            loadProducts();
        } else if (path.endsWith('services.html')) {
            loadServices();
        } else {
            // Homepage (index.html or /)
            // Fire-and-forget for sections that don't need re-init
            loadHero();
            loadCollections();
            loadPartners();

            // Await sections that need their interactive components re-initialized
            await loadTestimonials();
            // Re-initialize testimonials carousel after DOM replacement
            // TestimonialsCarousel is defined in script.js
            if (typeof TestimonialsCarousel !== 'undefined') {
                try { new TestimonialsCarousel(); } catch (e) { /* ignore */ }
            }

            await loadFAQs();
            // Re-initialize FAQ accordion after DOM replacement
            // FAQAccordion is defined in script.js
            if (typeof FAQAccordion !== 'undefined') {
                try { new FAQAccordion(); } catch (e) { /* ignore */ }
            }
        }
    });

})();
