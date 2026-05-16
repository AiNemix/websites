document.addEventListener('DOMContentLoaded', () => {

  const App = {
    init() {
      this.setupEventListeners();
      this.setupIntersectionObserver();
      this.setupCookieBanner();
    },

    setupEventListeners() {
      // Sticky Header
      const header = document.getElementById('site-header');
      if (header) {
        window.addEventListener('scroll', () => {
          header.classList.toggle('scrolled', window.scrollY > 50);
        });
      }

      // Mobile Navigation
      const navToggle = document.querySelector('.mobile-nav-toggle');
      const mainNav = document.getElementById('main-nav-list');
      if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
          const isOpen = mainNav.classList.toggle('is-open');
          navToggle.setAttribute('aria-expanded', isOpen);
          document.body.classList.toggle('scroll-locked', isOpen);
          navToggle.parentElement.classList.toggle('nav-open', isOpen);
        });
      }

      // Testimonial Carousel
      const carousel = document.getElementById('testimonial-carousel');
      if (carousel) {
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const slideWidth = () => carousel.querySelector('.testimonial-slide').clientWidth;

        if (nextBtn) nextBtn.addEventListener('click', () => { carousel.scrollBy({ left: slideWidth(), behavior: 'smooth' }); });
        if (prevBtn) prevBtn.addEventListener('click', () => { carousel.scrollBy({ left: -slideWidth(), behavior: 'smooth' }); });
      }

      // Sticky CTA
      const stickyCTA = document.getElementById('sticky-cta');
      if (stickyCTA && window.location.pathname.indexOf('/kontakt') === -1) {
          window.addEventListener('scroll', () => {
              const isVisible = window.scrollY > 400 && (window.innerHeight + window.scrollY) < document.body.offsetHeight - 400;
              stickyCTA.classList.toggle('visible', isVisible);
          });
      }
      
      // Lightbox
      this.setupLightbox();
    },

    setupIntersectionObserver() {
      const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-up, .reveal-slide-left, .reveal-slide-right, .reveal-stagger');
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      revealElements.forEach(el => observer.observe(el));
    },

    setupCookieBanner() {
      const banner = document.getElementById('cookie-banner');
      const acceptBtn = document.getElementById('cookie-accept');
      const declineBtn = document.getElementById('cookie-decline');

      if (!banner) return;

      const consent = localStorage.getItem('cookieConsent');
      if (!consent) {
        banner.style.display = 'block';
      }

      if(acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.style.display = 'none';
        });
      }

      if(declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            banner.style.display = 'none';
        });
      }
    },
    
    setupLightbox() {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let currentImageIndex;
        let imageSources = [];

        const openLightbox = (e) => {
            const clickedImage = e.target.closest('[data-km-gallery-item]');
            if (!clickedImage) return;

            const gallery = clickedImage.closest('.km-gallery');
            const galleryImages = gallery.querySelectorAll('[data-km-gallery-item]');
            imageSources = Array.from(galleryImages).map(img => img.src);
            currentImageIndex = Array.from(galleryImages).indexOf(clickedImage);

            updateLightboxImage();
            lightbox.classList.add('visible');
            document.body.classList.add('scroll-locked');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('scroll-locked');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateLightboxImage = () => {
            lightboxImg.src = imageSources[currentImageIndex];
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            updateLightboxImage();
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            updateLightboxImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };

        document.body.addEventListener('click', openLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
    }
  };

  App.init();
});