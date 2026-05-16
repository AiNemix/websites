document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY FUNCTIONS ---
    const select = (selector, scope = document) => scope.querySelector(selector);
    const selectAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    // --- STICKY HEADER ---
    const handleStickyHeader = () => {
        const header = select('#site-header');
        if (!header) return;

        const scrollHandler = () => {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    };

    // --- MOBILE NAVIGATION ---
    const handleMobileNav = () => {
        const toggleBtn = select('.mobile-nav-toggle');
        const menuWrapper = select('#main-menu');
        if (!toggleBtn || !menuWrapper) return;

        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !document.body.classList.contains('nav-open');
            document.body.classList.toggle('nav-open', open);
            menuWrapper.classList.toggle('open', open);
            toggleBtn.setAttribute('aria-expanded', open);
            document.body.classList.toggle('no-scroll', open);
        };

        toggleBtn.addEventListener('click', () => toggleMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
                toggleMenu(false);
            }
        });
    };

    // --- SCROLL REVEAL ANIMATIONS ---
    const handleScrollReveal = () => {
        const revealElements = selectAll('.reveal-fade');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay || '0', 10);
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- COOKIE BANNER ---
    const handleCookieBanner = () => {
        const banner = select('#cookie-banner');
        const acceptBtn = select('#cookie-accept');
        const declineBtn = select('#cookie-decline');
        if (!banner || !acceptBtn || !declineBtn) return;

        const cookieStatus = localStorage.getItem('cookie_status');

        if (!cookieStatus) {
            banner.style.display = 'block';
            setTimeout(() => banner.classList.add('show'), 100);
        }

        const hideBanner = () => banner.classList.remove('show');

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'accepted');
            hideBanner();
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'declined');
            hideBanner();
        });
    };

    // --- LIGHTBOX ---
    const handleLightbox = () => {
        const lightbox = select('#km-lightbox');
        if (!lightbox) return;

        const gallery = select('#gallery-grid');
        if (!gallery) return;

        const galleryImages = selectAll('img', gallery);
        if (galleryImages.length === 0) return;

        const imageSources = galleryImages.map(img => img.src);
        const lightboxImg = select('img', lightbox);
        const closeBtn = select('.lightbox-close', lightbox);
        const prevBtn = select('.lightbox-prev', lightbox);
        const nextBtn = select('.lightbox-next', lightbox);
        const backdrop = select('.lightbox-backdrop', lightbox);

        let currentIndex = 0;

        const showImage = (index) => {
            currentIndex = index;
            lightboxImg.src = imageSources[index];
            prevBtn.style.display = index === 0 ? 'none' : 'block';
            nextBtn.style.display = index === imageSources.length - 1 ? 'none' : 'block';
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('show');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight' && currentIndex < imageSources.length - 1) showImage(currentIndex + 1);
            if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
        };

        gallery.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                const index = galleryImages.indexOf(e.target);
                if (index > -1) {
                    openLightbox(index);
                }
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    };

    // --- ACCORDION ---
    const handleAccordion = () => {
        const accordionItems = selectAll('.accordion-item');
        if (accordionItems.length === 0) return;

        accordionItems.forEach(item => {
            const header = select('.accordion-header', item);
            const content = select('.accordion-content', item);

            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                content.style.display = isExpanded ? 'none' : 'block';
            });
        });
    };
    
    // --- BACK TO TOP BUTTON ---
    const handleBackToTop = () => {
        const button = select('#back-to-top');
        if (!button) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
            }
        }, { passive: true });

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // --- BEFORE/AFTER COMPARISON SLIDER ---
    const handleComparisonSlider = () => {
        const slider = select('#comparison-slider');
        if (!slider) return;

        const afterImage = select('.comparison-image.after', slider);
        const handle = select('.comparison-handle', slider);

        let isDragging = false;

        const moveSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let pos = (x - rect.left) / rect.width;
            pos = Math.max(0, Math.min(1, pos));
            afterImage.style.clipPath = `inset(0 0 0 ${pos * 100}%)`;
            handle.style.left = `${pos * 100}%`;
        };

        slider.addEventListener('mousedown', () => isDragging = true);
        slider.addEventListener('touchstart', () => isDragging = true, { passive: true });

        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('touchend', () => isDragging = false);

        document.addEventListener('mousemove', (e) => {
            if (isDragging) moveSlider(e.clientX);
        });
        document.addEventListener('touchmove', (e) => {
            if (isDragging) moveSlider(e.touches[0].clientX);
        }, { passive: true });
    };

    // --- TESTIMONIAL CAROUSEL ---
    const handleTestimonialCarousel = () => {
        const carousel = select('#testimonial-carousel');
        if (!carousel) return;

        const slides = selectAll('.testimonial-slide', carousel);
        const prevBtn = select('.carousel-btn.prev');
        const nextBtn = select('.carousel-btn.next');
        const dotsContainer = select('.carousel-dots');
        if (slides.length <= 1) return;

        let currentIndex = 0;
        let intervalId;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => {
                goToSlide(i);
                stopAutoplay();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = selectAll('button', dotsContainer);

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const startAutoplay = () => {
            intervalId = setInterval(() => goToSlide(currentIndex + 1), 5000);
        };

        const stopAutoplay = () => clearInterval(intervalId);

        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            stopAutoplay();
        });
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            stopAutoplay();
        });

        goToSlide(0);
        startAutoplay();
    };

    // --- INITIALIZE ALL MODULES ---
    handleStickyHeader();
    handleMobileNav();
    handleScrollReveal();
    handleCookieBanner();
    handleLightbox();
    handleAccordion();
    handleBackToTop();
    handleComparisonSlider();
    handleTestimonialCarousel();
});