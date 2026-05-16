document.addEventListener('DOMContentLoaded', () => {

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
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.classList.add('no-scroll');
        });
    }

    if (menuClose && mobileMenu) {
        menuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const gallery = document.querySelector('.image-gallery');
    let galleryImages = [];
    let imageSources = [];
    let currentIndex = 0;

    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        currentIndex = index;
        lightboxImg.src = imageSources[currentIndex];
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('visible'), 10);
        document.body.classList.add('no-scroll');
        document.addEventListener('keydown', handleKeydown);
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('visible');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
        }, 300);
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleKeydown);
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % imageSources.length;
        lightboxImg.src = imageSources[currentIndex];
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
        lightboxImg.src = imageSources[currentIndex];
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    }

    if (gallery) {
        galleryImages = Array.from(gallery.querySelectorAll('.gallery-item'));
        imageSources = galleryImages.map(img => img.src); // Use absolute src for correct pathing

        gallery.addEventListener('click', e => {
            if (e.target.classList.contains('gallery-item')) {
                const index = galleryImages.indexOf(e.target);
                if (index > -1) {
                    openLightbox(index);
                }
            }
        });
    }

    if (lightbox) {
        lightbox.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.km-lightbox-next').addEventListener('click', showNextImage);
        lightbox.querySelector('.km-lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // --- Sticky Context CTA --- //
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        const showCtaThreshold = 400; // Pixels from top to show CTA
        window.addEventListener('scroll', () => {
            if (window.scrollY > showCtaThreshold) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        });
    }
});