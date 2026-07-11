document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if (!prefersReducedMotion) {
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                document.querySelector(this.getAttribute('href')).scrollIntoView();
            }
        });
    });

    // Mobile Menu
    const navToggle = document.querySelector('.km-nav-menu-toggle');
    const mobileMenuOverlay = document.getElementById('km-mobile-menu-overlay');
    const mobileMenuDrawer = mobileMenuOverlay.querySelector('.km-mobile-menu-drawer');
    const mobileMenuClose = mobileMenuOverlay.querySelector('.km-mobile-menu-close');
    const mobileNavLinks = mobileMenuOverlay.querySelectorAll('.km-mobile-nav-link, .km-mobile-nav-cta');

    function openMobileMenu() {
        mobileMenuOverlay.classList.add('is-open');
        document.body.style.overflow = 'hidden'; // Lock scroll
        navToggle.setAttribute('aria-expanded', 'true');
        mobileMenuDrawer.focus();
    }

    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('is-open');
        document.body.style.overflow = ''; // Unlock scroll
        navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('is-open')) {
            closeMobileMenu();
        }
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Sticky Header Shrink
    const header = document.querySelector('.km-nav');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('km-nav--scrolled');
        } else {
            header.classList.remove('km-nav--scrolled');
        }

        // Show/hide sticky CTA on mobile
        const stickyCta = document.getElementById('km-sticky-cta');
        if (window.innerWidth <= 768) {
            if (window.scrollY > window.innerHeight / 2 && window.scrollY < document.body.scrollHeight - window.innerHeight - 100) {
                stickyCta.classList.add('is-visible');
            } else {
                stickyCta.classList.remove('is-visible');
            }
        }

        lastScrollY = window.scrollY;
    });

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.km-reveal-group');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!prefersReducedMotion) {
                    entry.target.classList.add('is-visible');
                } else {
                    // For reduced motion, just show it instantly
                    entry.target.querySelectorAll('.km-reveal-item').forEach(item => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.km-accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.closest('.km-accordion-item');
            const content = currentItem.querySelector('.km-accordion-content');
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Close all other open accordions in the same group
            accordionHeaders.forEach(otherHeader => {
                const otherItem = otherHeader.closest('.km-accordion-item');
                if (otherItem !== currentItem) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.km-accordion-content').classList.remove('is-open');
                }
            });

            // Toggle current accordion
            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.classList.remove('is-open');
            } else {
                header.setAttribute('aria-expanded', 'true');
                content.classList.add('is-open');
            }
        });
    });

    // Cookie Banner
    const cookieBanner = document.getElementById('km-cookie-banner');
    const acceptCookiesBtn = document.getElementById('km-accept-cookies');
    const declineCookiesBtn = document.getElementById('km-decline-cookies');
    const cookieName = 'cookieAccepted';

    function showCookieBanner() {
        if (!localStorage.getItem(cookieName)) {
            cookieBanner.classList.add('is-visible');
        }
    }

    function hideCookieBanner() {
        cookieBanner.classList.remove('is-visible');
    }

    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem(cookieName, 'true');
        hideCookieBanner();
    });

    declineCookiesBtn.addEventListener('click', () => {
        localStorage.setItem(cookieName, 'false'); // Or 'declined' if specific handling is needed
        hideCookieBanner();
    });

    // Show banner after a short delay to ensure CSS is loaded
    setTimeout(showCookieBanner, 1000);

    // Lightbox System
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = lightbox.querySelector('.km-lightbox-image');
    const lightboxCaption = lightbox.querySelector('.km-lightbox-caption');
    const lightboxClose = lightbox.querySelector('.km-lightbox-close');
    const lightboxPrev = lightbox.querySelector('.km-lightbox-prev');
    const lightboxNext = lightbox.querySelector('.km-lightbox-next');
    let currentImageIndex = 0;
    let galleryImages = [];

    function openLightbox(imgSrc, imgAlt, index, gallery) {
        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt;
        lightboxCaption.textContent = imgAlt;
        currentImageIndex = index;
        galleryImages = gallery;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        lightbox.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        lightboxImage.src = '';
        lightboxImage.alt = '';
        lightboxCaption.textContent = '';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        const nextImage = galleryImages[currentImageIndex];
        lightboxImage.src = nextImage.src;
        lightboxImage.alt = nextImage.alt;
        lightboxCaption.textContent = nextImage.alt;
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        const prevImage = galleryImages[currentImageIndex];
        lightboxImage.src = prevImage.src;
        lightboxImage.alt = prevImage.alt;
        lightboxCaption.textContent = prevImage.alt;
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('is-open')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });

    // Collect all images with data-km-image for the lightbox gallery
    const allKmImages = Array.from(document.querySelectorAll('img[data-km-image]')).map(img => ({
        src: img.src,
        alt: img.alt
    }));

    document.querySelectorAll('img[data-km-image]').forEach((img, index) => {
        img.style.cursor = 'pointer'; // Indicate clickability
        img.addEventListener('click', () => {
            // Use the full image path for lightbox, not the relative one if different
            const fullSrc = img.getAttribute('src').startsWith('..') ? img.src.replace('../', '') : img.src;
            openLightbox(fullSrc, img.alt, index, allKmImages);
        });
    });
});