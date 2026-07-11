document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.getElementById('mobile-menu');
    const body = document.body;

    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('is-open');
        menuToggle.classList.toggle('is-active');
        body.classList.toggle('no-scroll');
        if (navList.classList.contains('is-open')) {
            navList.setAttribute('aria-expanded', 'true');
            // Focus the first link in the opened menu for accessibility
            navList.querySelector('a').focus();
        } else {
            navList.setAttribute('aria-expanded', 'false');
        }
    });

    // Close mobile menu when a link is clicked
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('is-open');
            menuToggle.classList.remove('is-active');
            body.classList.remove('no-scroll');
            navList.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (event) => {
        if (!navList.contains(event.target) && !menuToggle.contains(event.target) && navList.classList.contains('is-open')) {
            navList.classList.remove('is-open');
            menuToggle.classList.remove('is-active');
            body.classList.remove('no-scroll');
            navList.setAttribute('aria-expanded', 'false');
        }
    });

    // Close mobile menu on ESC key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navList.classList.contains('is-open')) {
            navList.classList.remove('is-open');
            menuToggle.classList.remove('is-active');
            body.classList.remove('no-scroll');
            navList.setAttribute('aria-expanded', 'false');
            menuToggle.focus(); // Return focus to the toggle button
        }
    });

    // Sticky Header with Shrink Effect
    const header = document.querySelector('.site-header');
    const heroSection = document.querySelector('.hero-section');
    const heroHeight = heroSection ? heroSection.offsetHeight : 200; // Fallback height

    const handleScroll = () => {
        if (window.scrollY > heroHeight / 2) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }

        // Sticky CTA Bar visibility
        const stickyCtaBar = document.querySelector('.sticky-cta-bar');
        if (stickyCtaBar) {
            if (window.scrollY > heroHeight) {
                stickyCtaBar.classList.add('show');
            } else {
                stickyCtaBar.classList.remove('show');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load

    // Scroll Reveal Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });

    // Carousel Functionality
    const carouselContainers = document.querySelectorAll('.carousel-container');

    carouselContainers.forEach(container => {
        const track = container.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = container.querySelector('.carousel-button.next');
        const prevButton = container.querySelector('.carousel-button.prev');
        const dotsContainer = container.querySelector('.carousel-dots');
        let slideWidth = slides[0].getBoundingClientRect().width;
        let slideIndex = 0;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        const updateSlidePosition = () => {
            track.style.transform = 'translateX(-' + slideIndex * slideWidth + 'px)';
        };

        const updateDots = () => {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[slideIndex].classList.add('active');
        };

        const moveToSlide = (index) => {
            slideIndex = index;
            updateSlidePosition();
            updateDots();
        };

        nextButton.addEventListener('click', () => {
            if (slideIndex < slides.length - 1) {
                moveToSlide(slideIndex + 1);
            } else {
                moveToSlide(0); // Loop back to start
            }
        });

        prevButton.addEventListener('click', () => {
            if (slideIndex > 0) {
                moveToSlide(slideIndex - 1);
            } else {
                moveToSlide(slides.length - 1); // Loop to end
            }
        });

        // Handle touch swipe
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        container.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        });

        container.addEventListener('touchend', () => {
            if (touchStartX - touchEndX > 50) { // Swiped left
                nextButton.click();
            } else if (touchEndX - touchStartX > 50) { // Swiped right
                prevButton.click();
            }
            touchStartX = 0;
            touchEndX = 0;
        });

        // Keyboard navigation
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                nextButton.click();
            } else if (e.key === 'ArrowLeft') {
                prevButton.click();
            }
        });

        // Recalculate slide width on resize
        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            updateSlidePosition();
        });
    });

    // KM Lightbox System
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = lightbox.querySelector('.km-lightbox-image');
    const lightboxClose = lightbox.querySelector('.km-lightbox-close');
    const lightboxPrev = lightbox.querySelector('.km-lightbox-prev');
    const lightboxNext = lightbox.querySelector('.km-lightbox-next');
    const lightboxBackdrop = lightbox.querySelector('.km-lightbox-backdrop');
    let currentGalleryItems = [];
    let currentIndex = 0;

    const openLightbox = (imgSrc, imgAlt) => {
        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt;
        lightbox.classList.add('is-open');
        body.classList.add('no-scroll');
        lightbox.setAttribute('aria-hidden', 'false');
        lightbox.focus(); // Focus lightbox for keyboard navigation
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        body.classList.remove('no-scroll');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = ''; // Clear image to prevent content flashing
        lightboxImage.alt = '';
        // Remove event listeners to prevent duplication (handled by re-adding on open)
        lightboxPrev.removeEventListener('click', showPrevImage);
        lightboxNext.removeEventListener('click', showNextImage);
        lightboxBackdrop.removeEventListener('click', closeLightbox);
        document.removeEventListener('keydown', handleKeydown);
    };

    const showPrevImage = () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentGalleryItems.length - 1;
        updateLightboxImage();
    };

    const showNextImage = () => {
        currentIndex = (currentIndex < currentGalleryItems.length - 1) ? currentIndex + 1 : 0;
        updateLightboxImage();
    };

    const updateLightboxImage = () => {
        const item = currentGalleryItems[currentIndex];
        lightboxImage.src = item.dataset.kmLightboxImg;
        lightboxImage.alt = item.dataset.kmLightboxAlt;
    };

    const handleKeydown = (event) => {
        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowLeft') {
            showPrevImage();
        } else if (event.key === 'ArrowRight') {
            showNextImage();
        }
    };

    document.querySelectorAll('[data-km-lightbox-img]').forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            currentGalleryItems = Array.from(document.querySelectorAll('[data-km-lightbox-img]'));
            currentIndex = currentGalleryItems.indexOf(item);
            openLightbox(item.dataset.kmLightboxImg, item.dataset.kmLightboxAlt);

            // Add event listeners for navigation and close
            lightboxPrev.addEventListener('click', showPrevImage);
            lightboxNext.addEventListener('click', showNextImage);
            lightboxBackdrop.addEventListener('click', closeLightbox);
            document.addEventListener('keydown', handleKeydown);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    // Cookie Banner Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const declineCookiesBtn = document.getElementById('decline-cookies');

    const showCookieBanner = () => {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('show');
        }
    };

    const hideCookieBanner = () => {
        cookieBanner.classList.remove('show');
    };

    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        hideCookieBanner();
    });

    declineCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'necessary');
        hideCookieBanner();
    });

    showCookieBanner();
});
