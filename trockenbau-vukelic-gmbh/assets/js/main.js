document.addEventListener('DOMContentLoaded', () => {

    // --- Globals ---
    const siteHeader = document.getElementById('site-header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const backToTopButton = document.querySelector('.back-to-top');
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    const cookieBanner = document.getElementById('cookie-banner');
    const lightbox = document.getElementById('km-lightbox');
    let lightboxImageSources = [];
    let currentLightboxIndex = 0;

    // --- Functions ---

    const handleScroll = () => {
        // Sticky Header
        if (window.scrollY > 80) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }

        // Back to Top & Sticky CTA
        const showPosition = window.innerHeight * 0.8;
        if (window.scrollY > showPosition) {
            backToTopButton.classList.add('show');
            stickyCtaBar.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
            stickyCtaBar.classList.remove('show');
        }
    };

    const toggleMobileNav = () => {
        mobileNavToggle.classList.toggle('open');
        mobileNav.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
        mobileNav.setAttribute('aria-hidden', !mobileNav.classList.contains('open'));
        mobileNavToggle.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-in, .reveal-stagger');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const initBeforeAfterSlider = () => {
        document.querySelectorAll('.before-after-slider').forEach(slider => {
            const handle = slider.querySelector('.ba-handle');
            const afterImage = slider.querySelector('.after-image');
            let isDragging = false;

            const moveHandler = (x) => {
                const rect = slider.getBoundingClientRect();
                let pos = (x - rect.left) / rect.width;
                pos = Math.max(0, Math.min(1, pos));
                handle.style.left = `${pos * 100}%`;
                afterImage.style.clipPath = `inset(0 0 0 ${pos * 100}%)`;
            };

            handle.addEventListener('mousedown', () => isDragging = true);
            document.addEventListener('mouseup', () => isDragging = false);
            document.addEventListener('mousemove', e => isDragging && moveHandler(e.clientX));
            handle.addEventListener('touchstart', () => isDragging = true);
            document.addEventListener('touchend', () => isDragging = false);
            document.addEventListener('touchmove', e => isDragging && moveHandler(e.touches[0].clientX));
        });
    };

    const initTestimonialCarousel = () => {
        const carousel = document.getElementById('testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            document.querySelectorAll('.carousel-dots .dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        updateCarousel();
    };

    const initCookieBanner = () => {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    };

    const openLightbox = (galleryImages, index) => {
        lightboxImageSources = Array.from(galleryImages).map(img => img.src);
        currentLightboxIndex = index;
        updateLightboxImage();
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('show'), 10);
        document.body.classList.add('no-scroll');
        document.addEventListener('keydown', handleLightboxKeys);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('show');
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleLightboxKeys);
        setTimeout(() => lightbox.style.display = 'none', 300);
    };

    const updateLightboxImage = () => {
        const lightboxImg = lightbox.querySelector('.lightbox-content');
        lightboxImg.src = lightboxImageSources[currentLightboxIndex];
    };

    const showNextImage = () => {
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImageSources.length;
        updateLightboxImage();
    };

    const showPrevImage = () => {
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImageSources.length) % lightboxImageSources.length;
        updateLightboxImage();
    };

    const handleLightboxKeys = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    };

    const initLightbox = () => {
        if (!lightbox) return;

        document.querySelectorAll('.gallery-grid').forEach(gallery => {
            const galleryImages = gallery.querySelectorAll('.gallery-img');
            galleryImages.forEach((img, index) => {
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(galleryImages, index);
                });
            });
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
        lightbox.querySelector('.next-lightbox').addEventListener('click', showNextImage);
        lightbox.querySelector('.prev-lightbox').addEventListener('click', showPrevImage);
    };


    // --- Event Listeners & Initializations ---

    window.addEventListener('scroll', handleScroll);
    mobileNavToggle.addEventListener('click', toggleMobileNav);
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
        this.reset();
    });

    initScrollReveal();
    initBeforeAfterSlider();
    initTestimonialCarousel();
    initCookieBanner();
    initLightbox();
});