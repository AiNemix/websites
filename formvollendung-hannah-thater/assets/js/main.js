document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Menu --- //
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuToggle && mobileMenu && mobileMenuClose) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.classList.add('scroll-locked');
        });
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('scroll-locked');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        if(nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }
        if(prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');
    const cookieConsent = localStorage.getItem('cookie_consent');

    if (!cookieConsent && cookieBanner) {
        setTimeout(() => cookieBanner.classList.add('show'), 500);
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }
    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const gallery = document.getElementById('image-gallery');
    let currentImageIndex = 0;
    let imageSources = [];

    if (gallery && lightbox) {
        const galleryImages = gallery.querySelectorAll('.gallery-image');
        imageSources = Array.from(galleryImages).map(img => img.src);

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageIndex = index;
                openLightbox(index);
            });
        });

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');

        function openLightbox(index) {
            if (index >= 0 && index < imageSources.length) {
                lightboxImg.src = imageSources[index];
                lightbox.classList.add('show');
                document.body.classList.add('scroll-locked');
                document.addEventListener('keydown', handleKeydown);
            }
        }

        function closeLightbox() {
            lightbox.classList.remove('show');
            document.body.classList.remove('scroll-locked');
            document.removeEventListener('keydown', handleKeydown);
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            openLightbox(currentImageIndex);
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            openLightbox(currentImageIndex);
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCta.classList.add('show');
            } else {
                stickyCta.classList.remove('show');
            }
        });
    }

});