document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER & STICKY CTA --- //
    const header = document.getElementById('site-header');
    const stickyCta = document.getElementById('sticky-cta');
    const scrollThreshold = 80;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
            if (stickyCta) stickyCta.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            if (stickyCta) stickyCta.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // --- MOBILE MENU --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuClose = document.querySelector('.mobile-menu-close');

    const openMenu = () => {
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- SCROLL REVEAL --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.dataset.reveal === 'stagger') {
                    Array.from(entry.target.children).forEach((child, index) => {
                        child.style.setProperty('--stagger-index', index);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ ACCORDION --- //
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

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-next');
        const prevButton = carousel.querySelector('.carousel-prev');
        const dotsNav = carousel.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
        };

        // Create dots
        slides.forEach((_, index) => {
            const button = document.createElement('button');
            button.classList.add('carousel-dot');
            button.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(button);
        });
        const dots = Array.from(dotsNav.children);

        const updateDots = (index) => {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        };

        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });

        moveToSlide(0); // Initial position
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        cookieBanner.classList.add('visible');
    }

    const handleConsent = (value) => {
        localStorage.setItem('cookieConsent', value);
        cookieBanner.classList.remove('visible');
    };

    acceptButton.addEventListener('click', () => handleConsent('accepted'));
    declineButton.addEventListener('click', () => handleConsent('declined'));

    // --- LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.km-lightbox-image');
        const closeButton = lightbox.querySelector('.km-lightbox-close');
        const prevButton = lightbox.querySelector('.km-lightbox-prev');
        const nextButton = lightbox.querySelector('.km-lightbox-next');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
        let currentImageIndex;
        let imageSources = [];

        const openLightbox = (index) => {
            currentImageIndex = index;
            lightboxImg.src = imageSources[currentImageIndex];
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleLightboxKeys);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleLightboxKeys);
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        };

        const handleLightboxKeys = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };

        document.addEventListener('click', (e) => {
            if (e.target.matches('.gallery-image')) {
                const galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
                imageSources = galleryImages.map(img => img.src); // Use absolute src URL
                const clickedIndex = galleryImages.findIndex(img => img === e.target);
                openLightbox(clickedIndex);
            }
        });

        closeButton.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', showPrevImage);
        nextButton.addEventListener('click', showNextImage);
    }
});