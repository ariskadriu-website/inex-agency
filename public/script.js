/*
  iNEX Logic - Premium Features
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Handling ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Icons
    const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('inex_theme', theme);
        if (themeIcon) {
            themeIcon.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
        }
    }

    // Init Theme
    const savedTheme = localStorage.getItem('inex_theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (systemDark ? 'dark' : 'light');
    setTheme(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(currentTheme);
        });
    }

    // --- Dynamic Greeting ---
    const heroTitle = document.getElementById('dynamic-hero-title');
    if (heroTitle) {
        const hour = new Date().getHours();
        let greeting = "";
        if (hour < 12) greeting = "Good Morning.";
        else if (hour < 18) greeting = "Good Afternoon.";
        else greeting = "Good Evening.";

        const currentLang = localStorage.getItem('inex_lang') || 'en';
        if (currentLang === 'en') {
            heroTitle.innerHTML = `${greeting} <br> We build future-proof websites.`;
        }
    }

    // --- Active Link Handling (FIXED) ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        // Remove previous active classes first to be safe
        link.classList.remove('active');

        // Exact match or Home default
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- Feature 7: Smart FAQ Search ---
    const faqSearch = document.getElementById('faq-search');
    if (faqSearch) {
        faqSearch.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            document.querySelectorAll('.accordion-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(val) ? 'block' : 'none';
            });
        });
    }

    // --- Feature 8: Before/After Slider Logic ---
    const sliderContainer = document.querySelector('.comparison-slider');
    if (sliderContainer) {
        const range = sliderContainer.querySelector('.slider-range');
        const afterImage = sliderContainer.querySelector('.after-image');

        const updateSlider = (e) => {
            const val = e.target.value;
            afterImage.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
        };

        range.addEventListener('input', updateSlider);
        range.addEventListener('change', updateSlider);
    }


    // --- Service Modal Logic (Existing) ---
    const modal = document.getElementById('service-modal');
    const modalBody = document.getElementById('modal-body');

    function showModal(modalEl) {
        modalEl.style.display = "flex";
    }

    window.closeModal = function (id) {
        document.getElementById(id).style.display = 'none';
    }

    // --- Portal Modal Logic ---
    const portalBtn = document.getElementById('portal-btn');
    const portalModal = document.getElementById('portal-modal');
    if (portalBtn && portalModal) {
        portalBtn.addEventListener('click', () => {
            portalModal.style.display = "flex";
            // Ensure content is there if dynamically cleared
            const content = portalModal.querySelector('.modal-content div');
            if (!content) {
                portalModal.querySelector('.modal-content').innerHTML = `
                    <span class="close-modal" style="position: absolute; right: 20px; top: 20px;" onclick="closeModal('portal-modal')">&times;</span>
                    <div style="text-align: center; padding: 40px;">
                        <h2 class="text-gradient">Client Portal Demo</h2>
                        <div style="padding: 40px; border: 1px dashed var(--color-border); margin-top: 20px; border-radius: 8px;">
                            <p style="opacity: 0.7;">Live Project Tracker Loading...</p>
                            <div style="margin-top: 20px; font-weight: 600; color: var(--color-primary);">[Dashboard Placeholder]</div>
                        </div>
                    </div>`;
            }
        });
    }

    const serviceDetails = {
        webdesign: { img: 'assets/images/ui-design.png', features: "Custom UI/UX, Responsive, Fast Loading, SEO Ready" },
        redesign: { img: 'assets/images/coding-detail.png', features: "Modern Tech Stack, Improved Speed, Better Conversion" },
        marketing: { img: 'assets/images/meeting.png', features: "Keyword Analysis, Content Strategy, Google Ads, Analytics" },
        ecommerce: { icon: '🛒', features: "Shopify/WooCommerce, Payment Integration, Inventory Logic" },
        branding: { icon: '✨', features: "Logo Design, Typography, Color Palettes, Brand Guidelines" },
        support: { icon: '🛡️', features: "24/7 Monitoring, Security Patches, Weekly Backups" },
        appdev: { icon: '📱', features: "Native iOS & Android, Flutter, React Native, App Store Optimization" },
        audit: { icon: '🔍', features: "Heuristic Analysis, User Flows, Heatmaps, Accessibility Check" },
        consulting: { icon: '💼', features: "Tech Stack Strategy, Hiring Assistance, Roadmap Planning" },
        databases: { icon: '🗄️', features: "SQL/NoSQL Design, Cloud Migration, Data Redundancy, Speed Optimization" }
    };

    if (modal) {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', () => {
                const serviceKey = card.dataset.service;
                const details = serviceDetails[serviceKey];
                const lang = localStorage.getItem('inex_lang') || 'en';
                // (Simplified translations fetch for brevity)
                const title = "Service Details";

                if (details) {
                    modalBody.innerHTML = `
                        <h2 class="text-gradient" style="margin-bottom: 16px; font-size: 2rem;">${title}</h2>
                        ${details.img ? `<img src="${details.img}" style="width:100%; max-height:250px; object-fit:cover; border-radius:8px; margin-bottom:20px;">` : ''}
                        ${details.icon ? `<div style="font-size:3rem; margin-bottom:20px;">${details.icon}</div>` : ''}
                        <p style="font-size: 1rem; opacity: 0.9; margin-bottom: 20px;">Full professional service suite.</p>
                        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; border: 1px solid var(--color-border); text-align: left;">
                            <strong style="color: var(--color-primary); display:block; margin-bottom:8px;">Includes:</strong>
                            <span style="opacity:0.8;">${details.features}</span>
                        </div>
                    `;
                    showModal(modal);
                }
            });
        });

        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) e.target.style.display = "none";
        });
    }

    // --- Translations (External File) ---
    // Ensure translations.js is loaded before this script in HTML, or check if it exists
    const langBtns = document.querySelectorAll('.lang-btn');
    let lang = localStorage.getItem('inex_lang') || 'en';

    function applyLanguage(selectedLang) {
        // Safe check for global object
        const t = window.translations ? window.translations[selectedLang] : null;

        if (!t) {
            console.warn("Translations not loaded yet");
            return;
        }

        // 1. Update text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (t[key]) {
                el.innerHTML = t[key];
            }
        });

        // 2. Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const phKey = el.getAttribute('data-i18n-placeholder');
            if (t[phKey]) {
                el.placeholder = t[phKey];
            }
        });

        // Update active class on lang btns
        langBtns.forEach(btn => {
            if (btn.dataset.lang === selectedLang) btn.style.fontWeight = "800";
            else btn.style.fontWeight = "400";
        });
    }

    // Initial Apply
    // Small delay to ensure translations.js loads if async, though script tag order usually handles it.
    setTimeout(() => applyLanguage(lang), 50);

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lang = btn.dataset.lang;
            localStorage.setItem('inex_lang', lang);
            applyLanguage(lang);
        });
    });

    // --- "We Speak Code" Interactive Demo ---
    const codeInput = document.getElementById('code-input');
    if (codeInput) {
        codeInput.addEventListener('input', (e) => {
            // Remove quotes for cleaner check
            const color = e.target.value.replace(/['";]/g, '').trim().toLowerCase();
            const h2 = e.target.closest('.section').querySelector('h2');

            // Allow hex or names
            try {
                h2.style.background = 'none';
                h2.style.webkitTextFillColor = 'initial'; // Override gradient text
                h2.style.color = color;
            } catch (err) { }
        });
    }

    // --- Contact Form Handler (Backend Supported) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const action = contactForm.getAttribute('action');

            // Check if user hasn't set up the backend yet
            if (action.includes('YOUR_FORM_ID')) {
                // Fallback to Mailto for demo purposes
                const name = contactForm.querySelector('input[name="name"]').value;
                const email = contactForm.querySelector('input[name="email"]').value;
                const message = contactForm.querySelector('textarea[name="message"]').value;
                const body = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
                // Open Gmail Compose Window (as requested)
                window.location.href = `https://mail.google.com/mail/?view=cm&fs=1&to=inex.agency@gmail.com&su=New Project Inquiry from ${name}&body=${encodeURIComponent(body)}`;
                alert('Redirecting to Gmail...');
                return;
            }

            // Real Backend Submission
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Sending...";
            btn.disabled = true;

            try {
                const response = await fetch(action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.style.display = 'block';
                    formStatus.style.color = 'var(--color-primary)';
                    formStatus.innerText = "Thanks! Message sent successfully.";
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send');
                }
            } catch (error) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#ef4444'; // Red
                formStatus.innerText = "Oops! Something went wrong. Please try again.";
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }

    // --- Time ---
    const timeDisplay = document.getElementById('prishtina-time');
    if (timeDisplay) {
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/Belgrade', hour: '2-digit', minute: '2-digit' });
            timeDisplay.textContent = timeString;
        }
        setInterval(updateTime, 1000);
        updateTime();
    }

    // --- Scroll & Accordion ---
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });
        });

        document.querySelectorAll('a, button, .service-card, .accordion-header, .marquee-logo, .time-slot').forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            document.querySelectorAll('.accordion-item').forEach(i => {
                if (i !== item) i.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // --- 3D Tilt ---
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // --- Sticky Book Button (Moved to LEFT) ---
    const stickyContainer = document.createElement('div');
    stickyContainer.innerHTML = `<a href="contact.html" class="btn btn-primary" style="padding: 12px 24px; box-shadow: 0 10px 30px rgba(234, 179, 8, 0.4); display:flex; align-items:center; gap:8px;">
        <svg style="width:18px;height:18px;stroke:black;" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        <span>Book Call</span>
    </a>`;
    stickyContainer.style.cssText = "position: fixed; bottom: 30px; left: 30px; z-index: 8000; transform: translateY(100px); transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);";
    document.body.appendChild(stickyContainer);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) stickyContainer.style.transform = 'translateY(0)';
        else stickyContainer.style.transform = 'translateY(100px)';
    });
});
