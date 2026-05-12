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
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.querySelector('.close-menu-btn');

    if (menuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isOpen = mobileMenu.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', open);
            menuToggle.classList.toggle('open', open);
            mobileMenu.classList.toggle('open', open);
            document.body.classList.toggle('scroll-locked', open);
        };

        menuToggle.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
        if(closeMenuBtn) closeMenuBtn.addEventListener('click', () => toggleMenu(false));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('stagger-children')) {
                        const children = entry.target.children;
                        for (let i = 0; i < children.length; i++) {
                            children[i].style.setProperty('--stagger-index', i);
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('show');
            }
        }, 1000);

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('button');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            carousel.style.display = 'flex'; // Set display here to avoid layout shifts
            slides.forEach(s => s.style.display = 'block'); // Ensure slides are visible
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            updateCarousel();
        };

        if(nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        if(prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        
        // Initialize
        if(slides.length > 0) {
           goToSlide(0);
        }
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = document.getElementById('km-lightbox-img');
    const galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
    let currentImageIndex = 0;
    let imageSources = [];

    if (lightbox && lightboxImg && galleryImages.length > 0) {
        imageSources = galleryImages.map(img => img.src); // Use absolute src

        const openLightbox = (index) => {
            currentImageIndex = index;
            lightboxImg.src = imageSources[currentImageIndex];
            lightbox.classList.add('show');
            document.body.classList.add('scroll-locked');
            addLightboxListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('scroll-locked');
            removeLightboxListeners();
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            lightboxImg.src = imageSources[currentImageIndex];
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        };

        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');

        function addLightboxListeners() {
            document.addEventListener('keydown', handleKeydown);
            if(prevBtn) prevBtn.addEventListener('click', showPrevImage);
            if(nextBtn) nextBtn.addEventListener('click', showNextImage);
            if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        }

        function removeLightboxListeners() {
            document.removeEventListener('keydown', handleKeydown);
            if(prevBtn) prevBtn.removeEventListener('click', showPrevImage);
            if(nextBtn) nextBtn.removeEventListener('click', showNextImage);
            if(closeBtn) closeBtn.removeEventListener('click', closeLightbox);
            lightbox.removeEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        }
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        window.addEventListener('scroll', () => {
            const showAt = document.body.scrollHeight * 0.25; // Show after 25% scroll
            const hideAt = document.body.scrollHeight - window.innerHeight - 300; // Hide before footer
            if (window.scrollY > showAt && window.scrollY < hideAt) {
                stickyCTA.classList.add('show');
            } else {
                stickyCTA.classList.remove('show');
            }
        });
    }
});