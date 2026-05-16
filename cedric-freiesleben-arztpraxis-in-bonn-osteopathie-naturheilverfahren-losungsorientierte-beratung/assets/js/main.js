document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu --- //
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    function openMenu() {
        if (mobileMenuDrawer) {
            mobileMenuDrawer.classList.add('open');
            document.body.classList.add('no-scroll');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
        }
    }

    function closeMenu() {
        if (mobileMenuDrawer) {
            mobileMenuDrawer.classList.remove('open');
            document.body.classList.remove('no-scroll');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', openMenu);
    }
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (index === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }

        // Touch swipe
        let touchstartX = 0;
        let touchendX = 0;
        
        carousel.addEventListener('touchstart', function(event) {
            touchstartX = event.changedTouches[0].screenX;
        }, false);

        carousel.addEventListener('touchend', function(event) {
            touchendX = event.changedTouches[0].screenX;
            handleSwipe();
        }, false); 

        function handleSwipe() {
            if (touchendX < touchstartX) {
                nextButton.click();
            }
            if (touchendX > touchstartX) {
                prevButton.click();
            }
        }

        updateDots();
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.km-lightbox-close') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.km-lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.km-lightbox-next') : null;
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex = 0;
    let imageSources = [];

    function openLightbox(index) {
        if (!lightbox) return;
        currentImageIndex = index;
        lightboxImg.src = imageSources[currentImageIndex];
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('open'), 10);
        document.body.classList.add('no-scroll');
        addLightboxEventListeners();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('open');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
        }, 300);
        document.body.classList.remove('no-scroll');
        removeLightboxEventListeners();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : imageSources.length - 1;
        lightboxImg.src = imageSources[currentImageIndex];
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex < imageSources.length - 1) ? currentImageIndex + 1 : 0;
        lightboxImg.src = imageSources[currentImageIndex];
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    }

    function addLightboxEventListeners() {
        document.addEventListener('keydown', handleKeydown);
    }

    function removeLightboxEventListeners() {
        document.removeEventListener('keydown', handleKeydown);
    }

    if (galleryImages.length > 0) {
        imageSources = Array.from(galleryImages).map(img => img.src);
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }
    
    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            statusEl.textContent = 'Vielen Dank! Ihre Nachricht wird gesendet...';
            statusEl.style.color = 'var(--color-text)';
            
            // Simulate form submission
            setTimeout(() => {
                statusEl.textContent = 'Nachricht erfolgreich gesendet!';
                statusEl.style.color = 'var(--color-primary)';
                contactForm.reset();
            }, 1500);
        });
    }
});