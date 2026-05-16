document.addEventListener('DOMContentLoaded', () => {

    // --- HEADER SCROLL --- //
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE MENU --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('open');
            mobileNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    // --- SCROLL REVEAL --- //
    const revealSections = document.querySelectorAll('.reveal-section');
    const revealOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Animate child items if any
                const revealItems = entry.target.querySelectorAll('.reveal-item');
                revealItems.forEach(item => item.classList.add('visible'));
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    revealSections.forEach(section => revealObserver.observe(section));
    
    // For hero items that are immediately visible
    const heroItems = document.querySelectorAll('.hero .reveal-item');
    heroItems.forEach(item => item.classList.add('visible'));

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-controls .prev');
        const nextButton = document.querySelector('.carousel-controls .next');
        const dotsContainer = document.querySelector('.carousel-controls .dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.ariaLabel = `Go to slide ${index + 1}`;
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const showNext = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        };

        nextButton.addEventListener('click', showNext);
        prevButton.addEventListener('click', showPrev);

        // Touch swipe
        let touchstartX = 0;
        let touchendX = 0;
        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) showNext();
            if (touchendX > touchstartX) showPrev();
        });

        updateCarousel();
    }

    // --- ACCORDION --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
        });
    });

    // --- COOKIE BANNER --- //
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

    // --- LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        let currentImageIndex;
        let imageSources = [];

        const openLightbox = (gallery, index) => {
            const galleryImages = Array.from(gallery.querySelectorAll('img[data-open-lightbox]'));
            imageSources = galleryImages.map(img => img.src);
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('show');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleLightboxKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleLightboxKeydown);
        };

        const updateLightboxImage = () => {
            lightboxImg.src = imageSources[currentImageIndex];
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            updateLightboxImage();
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            updateLightboxImage();
        };

        const handleLightboxKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        };

        document.querySelectorAll('[data-open-lightbox]').forEach((el, index) => {
            el.addEventListener('click', (e) => {
                const gallery = e.target.closest('.image-gallery');
                if (gallery) {
                    const galleryImages = Array.from(gallery.querySelectorAll('img[data-open-lightbox]'));
                    const clickedIndex = galleryImages.indexOf(e.target);
                    openLightbox(gallery, clickedIndex);
                }
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        nextBtn.addEventListener('click', showNextImage);
        prevBtn.addEventListener('click', showPrevImage);
    }

    // --- BACK TO TOP & STICKY CTA --- //
    const backToTop = document.getElementById('back-to-top');
    const stickyCTA = document.querySelector('.sticky-cta');
    if (backToTop) {
        const progressRing = backToTop.querySelector('.progress-ring-fg');
        const circumference = 2 * Math.PI * 45;
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            const offset = circumference - (scrollPercent / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;

            if (scrollTop > 300) {
                backToTop.classList.add('show');
                if (stickyCTA) stickyCTA.classList.add('show');
            } else {
                backToTop.classList.remove('show');
                 if (stickyCTA) stickyCTA.classList.remove('show');
            }
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});