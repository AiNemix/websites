document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('open');
            document.body.classList.add('scroll-locked');
            menuToggle.setAttribute('aria-expanded', 'true');
        }
    };

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('scroll-locked');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
    }
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        let currentIndex = 0;

        const showSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
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
        let currentImageIndex;
        let imageSources = [];

        const galleries = document.querySelectorAll('.gallery-lightbox');

        galleries.forEach(gallery => {
            const galleryImages = gallery.querySelectorAll('img');
            const sources = Array.from(galleryImages).map(img => img.src);
            imageSources.push(...sources);
            
            galleryImages.forEach((img, index) => {
                img.addEventListener('click', () => {
                    const globalIndex = imageSources.indexOf(img.src);
                    openLightbox(globalIndex);
                });
            });
        });
        
        // Remove duplicates
        imageSources = [...new Set(imageSources)];

        const openLightbox = (index) => {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateLightboxImage = () => {
            lightboxImg.src = imageSources[currentImageIndex];
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            updateLightboxImage();
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            updateLightboxImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
    }
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});