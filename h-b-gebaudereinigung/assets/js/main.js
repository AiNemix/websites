document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('open');
            document.body.classList.add('scroll-locked');
        }
    };

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('scroll-locked');
        }
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
    }
    if (menuClose && mobileMenu) {
        menuClose.addEventListener('click', closeMenu);
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.scroll-reveal');
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

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    const handleCookieConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
        }
    };

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => handleCookieConsent('accepted'));
    }
    if (declineCookies) {
        declineCookies.addEventListener('click', () => handleCookieConsent('declined'));
    }

    // --- 5. Sticky Context CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- 6. Before/After Slider --- //
    const slider = document.getElementById('comparison-slider');
    if(slider) {
        const resizer = document.getElementById('comparison-resizer');
        const divisor = slider.querySelector('.comparison-divisor');
        const range = document.getElementById('comparison-range');

        const moveDivisor = () => {
            const value = range.value + '%';
            if (divisor) divisor.style.width = value;
            if (resizer) resizer.style.left = value;
        };

        if(range) {
            range.addEventListener('input', moveDivisor);
        }
    }

    // --- 7. Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.km-lightbox-img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.km-lightbox-close') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.km-lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.km-lightbox-next') : null;
    const gallery = document.getElementById('image-gallery');
    let galleryImages = [];
    let imageSources = [];
    let currentIndex = 0;

    if (gallery) {
        galleryImages = Array.from(gallery.querySelectorAll('.gallery-image'));
        imageSources = galleryImages.map(img => img.src); 

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });
    }

    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('visible');
        document.body.classList.add('scroll-locked');
        addLightboxEventListeners();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('visible');
        document.body.classList.remove('scroll-locked');
        removeLightboxEventListeners();
    }

    function updateLightboxImage() {
        if (lightboxImg) {
            lightboxImg.src = imageSources[currentIndex];
        }
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % imageSources.length;
        updateLightboxImage();
    }
    
    function handleKeydown(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    }

    function addLightboxEventListeners() {
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
        if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
        if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', handleKeydown);
    }

    function removeLightboxEventListeners() {
        if (lightboxClose) lightboxClose.removeEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.removeEventListener('click', showPrevImage);
        if (lightboxNext) lightboxNext.removeEventListener('click', showNextImage);
        if (lightbox) lightbox.removeEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.removeEventListener('keydown', handleKeydown);
    }
});