document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    if (mobileNavToggle && mobileNavDrawer) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNavToggle.classList.toggle('active');
            mobileNavDrawer.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 1500; // ms
        const stepTime = Math.abs(Math.floor(duration / target));
        let current = 0;
        const timer = setInterval(() => {
            current += 1;
            counter.innerText = current;
            if (current == target) {
                clearInterval(timer);
            }
        }, stepTime);
    };
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });
        counters.forEach(counter => counterObserver.observe(counter));
    }

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-controls .prev');
        const nextButton = document.querySelector('.carousel-controls .next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length > 0) {
            carousel.style.display = 'flex';
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
            const dots = dotsContainer.querySelectorAll('.dot');

            function updateCarousel() {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            }

            function goToSlide(index) {
                currentIndex = index;
                updateCarousel();
            }

            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });

            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }
    }

    // --- Cookie Banner ---
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

    // --- Sticky CTA Bar ---
    const stickyCta = document.getElementById('sticky-cta-bar');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('show');
                } else {
                    stickyCta.classList.remove('show');
                }
            });
        }, { rootMargin: '-200px 0px 0px 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const galleryItems = document.querySelectorAll('[data-gallery-item]');
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let currentIndex = 0;
        let imageSources = [];

        const openLightbox = (index) => {
            const galleryImages = Array.from(document.querySelectorAll('[data-gallery-item] img'));
            imageSources = galleryImages.map(img => img.src); // Use absolute src
            currentIndex = index;
            updateLightboxImage();
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.style.overflow = 'hidden';
            addLightboxEventListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.style.overflow = '';
            removeLightboxEventListeners();
        };

        const updateLightboxImage = () => {
            if (imageSources.length > 0) {
                lightboxImg.src = imageSources[currentIndex];
            }
        };

        const showPrevImage = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : imageSources.length - 1;
            updateLightboxImage();
        };

        const showNextImage = () => {
            currentIndex = (currentIndex < imageSources.length - 1) ? currentIndex + 1 : 0;
            updateLightboxImage();
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };

        function addLightboxEventListeners() {
            closeBtn.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', showPrevImage);
            nextBtn.addEventListener('click', showNextImage);
            lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
            document.addEventListener('keydown', handleKeyDown);
        }

        function removeLightboxEventListeners() {
            closeBtn.removeEventListener('click', closeLightbox);
            prevBtn.removeEventListener('click', showPrevImage);
            nextBtn.removeEventListener('click', showNextImage);
            lightbox.removeEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
            document.removeEventListener('keydown', handleKeyDown);
        }
    }
});