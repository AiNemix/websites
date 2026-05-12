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
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNav.classList.add('open');
            mobileNav.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        });

        const closeNav = () => {
            mobileNav.classList.remove('open');
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        };

        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                closeNav();
            }
        });
        if(mobileNavClose) mobileNavClose.addEventListener('click', closeNav);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                closeNav();
            }
        });
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Carousel --- //
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        const slides = Array.from(carousel.children);
        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
                dotsContainer.appendChild(dot);
            });
        };

        const updateDots = () => {
            const dots = dotsContainer.children;
            Array.from(dots).forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            carousel.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
            updateDots();
        };

        nextButton.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            goToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1;
            goToSlide(prevIndex);
        });

        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            goToSlide(currentIndex);
        });

        createDots();
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let currentImageIndex;
        let imageSources = [];

        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryImages = Array.from(galleryItems).map(item => item.querySelector('img'));
        imageSources = galleryImages.map(img => img.src);

        const openLightbox = (index) => {
            currentImageIndex = index;
            lightboxImg.src = imageSources[currentImageIndex];
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '-200px 0px 0px 0px' });

        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});