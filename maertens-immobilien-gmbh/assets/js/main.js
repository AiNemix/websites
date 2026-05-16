document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header --- //
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

    // --- 2. Mobile Navigation --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- 4. Testimonial Carousel (Simple Slider) --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        let currentIndex = 0;

        function showSlide(index) {
            const offset = -index * 100;
            carousel.style.transform = `translateX(${offset}%)`;
            slides.forEach((slide, i) => {
                slide.style.opacity = i === index ? 1 : 0;
            });
        }
        
        function updateCarousel() {
             const totalWidth = Array.from(slides).reduce((acc, slide) => acc + slide.offsetWidth, 0);
             carousel.style.width = `${totalWidth}px`;
             carousel.style.display = 'flex';
             slides.forEach(slide => slide.style.width = `${carousel.parentElement.offsetWidth}px`);
             showSlide(currentIndex);
        }

        if (slides.length > 1) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                showSlide(currentIndex);
            });

            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                showSlide(currentIndex);
            });
            
            // Initial setup
            slides.forEach(slide => {
                slide.style.transition = 'opacity 0.5s ease';
            });
            carousel.style.transition = 'transform 0.5s ease';
            updateCarousel();
            window.addEventListener('resize', updateCarousel);
        }
    }

    // --- 5. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('show');
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

    // --- 6. Lightbox (Singleton) --- //
    // No gallery images on this site, but the JS logic is here as required.
    // The functionality is ready if any images are made clickable.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let currentImageIndex = -1;
        let imageSources = [];

        const openLightbox = (gallery, index) => {
            imageSources = Array.from(gallery).map(img => img.src); // Use absolute URL
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.style.display = 'flex';
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleEscKey);
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleEscKey);
        };

        const updateLightboxImage = () => {
            if (currentImageIndex >= 0 && currentImageIndex < imageSources.length) {
                lightboxImg.src = imageSources[currentImageIndex];
            }
            prevBtn.style.display = (currentImageIndex > 0) ? 'block' : 'none';
            nextBtn.style.display = (currentImageIndex < imageSources.length - 1) ? 'block' : 'none';
        };

        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        };

        document.querySelectorAll('[data-km-gallery]').forEach(galleryContainer => {
            const galleryImages = galleryContainer.querySelectorAll('img');
            galleryImages.forEach((img, index) => {
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => openLightbox(galleryImages, index));
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', () => { if (currentImageIndex > 0) { currentImageIndex--; updateLightboxImage(); } });
        nextBtn.addEventListener('click', () => { if (currentImageIndex < imageSources.length - 1) { currentImageIndex++; updateLightboxImage(); } });
    }

    // --- 7. Sticky Context CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollPosition > 400 && scrollPosition < pageHeight - 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- 8. Smooth scroll for anchor links --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});