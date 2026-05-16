document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNavDrawer) {
        const openMenu = () => {
            mobileNavDrawer.classList.add('open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('body-no-scroll');
            document.addEventListener('keydown', handleEscKey);
            mobileNavDrawer.addEventListener('click', handleBackdropClick);
        };

        const closeMenu = () => {
            mobileNavDrawer.classList.remove('open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('body-no-scroll');
            document.removeEventListener('keydown', handleEscKey);
            mobileNavDrawer.removeEventListener('click', handleBackdropClick);
        };

        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        };
        
        const handleBackdropClick = (e) => {
            if (e.target === mobileNavDrawer) {
                closeMenu();
            }
        };

        mobileNavToggle.addEventListener('click', openMenu);
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMenu);
        }
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stagger animation for child elements
                    const staggerGroup = entry.target.querySelector('.stagger-group');
                    if (staggerGroup) {
                        Array.from(staggerGroup.children).forEach((child, index) => {
                            child.style.setProperty('--stagger-index', index);
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
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

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.km-lightbox-image') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.km-lightbox-close') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.km-lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.km-lightbox-next') : null;

    let currentImageIndex = 0;
    let imageSources = [];

    const openLightbox = (index) => {
        currentImageIndex = index;
        lightboxImg.src = imageSources[currentImageIndex];
        lightbox.classList.add('open');
        document.body.classList.add('body-no-scroll');
        addLightboxEventListeners();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.classList.remove('body-no-scroll');
        removeLightboxEventListeners();
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
        lightboxImg.src = imageSources[currentImageIndex];
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % imageSources.length;
        lightboxImg.src = imageSources[currentImageIndex];
    };

    const handleLightboxKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    };
    
    const handleLightboxBackdropClick = (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    };

    function addLightboxEventListeners() {
        document.addEventListener('keydown', handleLightboxKeydown);
        lightbox.addEventListener('click', handleLightboxBackdropClick);
    }

    function removeLightboxEventListeners() {
        document.removeEventListener('keydown', handleLightboxKeydown);
        lightbox.removeEventListener('click', handleLightboxBackdropClick);
    }

    const galleries = document.querySelectorAll('.lightbox-gallery');
    if (galleries.length > 0 && lightbox) {
        galleries.forEach(gallery => {
            const galleryImages = gallery.querySelectorAll('img.gallery-item');
            imageSources = Array.from(galleryImages).map(img => img.src); // Use absolute src

            galleryImages.forEach((img, index) => {
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(index);
                });
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);
    }
});