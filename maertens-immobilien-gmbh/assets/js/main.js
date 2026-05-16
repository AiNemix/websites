document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

    function openMobileMenu() {
        mobileNavMenu.classList.add('open');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('scroll-locked');
    }

    function closeMobileMenu() {
        mobileNavMenu.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('scroll-locked');
    }

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);
        mobileNavBackdrop.addEventListener('click', closeMobileMenu);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

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

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('km-cookie-banner');
    const cookieAcceptBtn = document.getElementById('km-cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
        }
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Value Calculator Teaser --- //
    const valueCalculator = document.getElementById('value-calculator');
    if (valueCalculator) {
        const steps = valueCalculator.querySelectorAll('.form-step');
        const triggers = valueCalculator.querySelectorAll('[data-next-step]');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const currentStep = trigger.closest('.form-step');
                const nextStepId = trigger.dataset.nextStep;
                const nextStep = valueCalculator.querySelector(`[data-step='${nextStepId}']`);

                if (currentStep && nextStep) {
                    currentStep.classList.remove('active');
                    nextStep.classList.add('active');
                }
            });
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
        let currentIndex = 0;
        let imageSources = [];

        const galleryItems = document.querySelectorAll('[data-km-gallery-item]');

        function openLightbox(index) {
            currentIndex = index;
            lightbox.style.display = 'flex';
            document.body.classList.add('scroll-locked');
            updateLightboxImage();
        }

        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.classList.remove('scroll-locked');
        }

        function updateLightboxImage() {
            lightboxImg.src = imageSources[currentIndex];
            lightboxImg.alt = galleryItems[currentIndex].querySelector('img').alt;
        }

        function showPrev() {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : imageSources.length - 1;
            updateLightboxImage();
        }

        function showNext() {
            currentIndex = (currentIndex < imageSources.length - 1) ? currentIndex + 1 : 0;
            updateLightboxImage();
        }

        if (galleryItems.length > 0) {
            // IMPORTANT: Use the full `src` attribute which is an absolute URL.
            imageSources = Array.from(galleryItems).map(item => item.querySelector('img').src);

            galleryItems.forEach((item, index) => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(index);
                });
            });

            closeBtn.addEventListener('click', closeLightbox);
            backdrop.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', showPrev);
            nextBtn.addEventListener('click', showNext);

            document.addEventListener('keydown', (e) => {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'Escape') closeLightbox();
                    if (e.key === 'ArrowLeft') showPrev();
                    if (e.key === 'ArrowRight') showNext();
                }
            });
        }
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const showThreshold = heroSection ? heroSection.offsetHeight : 600;

        window.addEventListener('scroll', () => {
            if (window.scrollY > showThreshold) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }
});