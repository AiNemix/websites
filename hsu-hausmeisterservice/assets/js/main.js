document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavMenu.classList.add('open');
            document.body.classList.add('no-scroll');
            mobileNavMenu.setAttribute('aria-hidden', 'false');
        });

        const closeMenu = () => {
            mobileNavMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            mobileNavMenu.setAttribute('aria-hidden', 'true');
        };

        mobileNavClose.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Before/After Slider --- //
    const slider = document.getElementById('comparison-slider');
    if (slider) {
        const beforeImage = slider.querySelector('.before-image');
        const sliderInput = slider.querySelector('.slider-range');
        const handle = slider.querySelector('.slider-handle');

        sliderInput.addEventListener('input', (e) => {
            const value = e.target.value;
            beforeImage.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
            handle.style.left = `${value}%`;
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        cookieBanner.classList.add('visible');
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const ctaFooterSection = document.querySelector('.cta-footer-section');

    if (stickyCTA && ctaFooterSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show sticky CTA if the footer CTA is NOT in view and we've scrolled past the hero
                if (!entry.isIntersecting && window.scrollY > window.innerHeight * 0.8) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        ctaObserver.observe(ctaFooterSection);
    }

});