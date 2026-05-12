document.addEventListener('DOMContentLoaded', function() {

    // Sticky Header
    const header = document.querySelector('.sticky-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Navigation
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNavDrawer) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavDrawer.classList.add('open');
            document.body.classList.add('no-scroll');
        });

        const closeNav = () => {
            mobileNavDrawer.classList.remove('open');
            document.body.classList.remove('no-scroll');
        };

        mobileNavClose.addEventListener('click', closeNav);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
                closeNav();
            }
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
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

    // Testimonial Carousel
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('show');
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
    
    // Lightbox
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex = 0;
    let imageSources = [];

    if (lightbox && galleryImages.length > 0) {
        imageSources = Array.from(galleryImages).map(img => img.src);

        const openLightbox = (index) => {
            currentImageIndex = index;
            lightboxImg.src = imageSources[currentImageIndex];
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
            addLightboxEventListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            removeLightboxEventListeners();
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        };

        function addLightboxEventListeners() {
            lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
            lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
            lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
            document.addEventListener('keydown', handleKeydown);
        }

        function removeLightboxEventListeners() {
             document.removeEventListener('keydown', handleKeydown);
        }
    }

    // Sticky CTA Bar
    const stickyCta = document.querySelector('.sticky-cta-bar');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('show');
                } else {
                    stickyCta.classList.remove('show');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // Valuation Tool Interaction
    const optionGroups = document.querySelectorAll('.options-group');
    optionGroups.forEach(group => {
        const buttons = group.querySelectorAll('.option-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    });

});