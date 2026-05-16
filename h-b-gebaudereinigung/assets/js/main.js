document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.querySelector('#mobile-menu');
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
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

    // --- Before/After Image Slider --- //
    const sliderContainer = document.querySelector('.image-comparison-slider');
    if (sliderContainer) {
        const overlay = sliderContainer.querySelector('.img-comp-overlay');
        const slider = sliderContainer.querySelector('.img-comp-slider');
        let isDragging = false;

        const moveSlider = (x) => {
            const rect = sliderContainer.getBoundingClientRect();
            let newX = x - rect.left;
            if (newX < 0) newX = 0;
            if (newX > rect.width) newX = rect.width;
            const percent = (newX / rect.width) * 100;
            overlay.style.width = percent + '%';
            slider.style.left = percent + '%';
        };

        const onMouseDown = (e) => {
            isDragging = true;
            e.preventDefault();
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            moveSlider(e.clientX);
        };

        const onTouchStart = (e) => {
            isDragging = true;
            e.preventDefault();
        };

        const onTouchMove = (e) => {
            if (!isDragging) return;
            moveSlider(e.touches[0].clientX);
        };

        slider.addEventListener('mousedown', onMouseDown);
        slider.addEventListener('touchstart', onTouchStart, { passive: false });

        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchend', onMouseUp);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove, { passive: false });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');

        if (!cookieConsent) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

});