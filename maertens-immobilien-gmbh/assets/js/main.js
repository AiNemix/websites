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
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.querySelector('.mobile-nav-menu');
  if (mobileNavToggle && mobileNavMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isOpen);
      mobileNavToggle.classList.toggle('is-active');
      mobileNavMenu.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll');
    });
  }

  // --- Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-up, .reveal-stagger');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-stagger')) {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, index * 100);
          } else {
            entry.target.classList.add('is-visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('km-cookie-banner');
  const acceptBtn = document.getElementById('km-cookie-accept');
  const declineBtn = document.getElementById('km-cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('is-visible');
    }, 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('is-visible');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('is-visible');
    });
  }

  // --- Global Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.km-lightbox-img');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    let currentIndex = 0;
    let imageSources = [];

    const galleryItems = document.querySelectorAll('.gallery-item, [data-km-image]');

    const openLightbox = (index) => {
      currentIndex = index;
      lightboxImg.src = imageSources[currentIndex];
      lightbox.style.display = 'flex';
      setTimeout(() => lightbox.classList.add('is-visible'), 10);
      document.body.classList.add('no-scroll');
      addLightboxListeners();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-visible');
      setTimeout(() => {
          lightbox.style.display = 'none';
          lightboxImg.src = '';
      }, 300);
      document.body.classList.remove('no-scroll');
      removeLightboxListeners();
    };

    const showPrev = () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : imageSources.length - 1;
      lightboxImg.src = imageSources[currentIndex];
    };

    const showNext = () => {
      currentIndex = (currentIndex < imageSources.length - 1) ? currentIndex + 1 : 0;
      lightboxImg.src = imageSources[currentIndex];
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    const addLightboxListeners = () => {
      closeBtn.addEventListener('click', closeLightbox);
      prevBtn.addEventListener('click', showPrev);
      nextBtn.addEventListener('click', showNext);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
      document.addEventListener('keydown', handleKeydown);
    };

    const removeLightboxListeners = () => {
        document.removeEventListener('keydown', handleKeydown);
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const galleryContainer = item.closest('.gallery-container') || document.body;
        const galleryImages = galleryContainer.querySelectorAll('.gallery-item, [data-km-image]');
        imageSources = Array.from(galleryImages).map(img => img.src);
        const clickedIndex = Array.from(galleryImages).indexOf(item);
        openLightbox(clickedIndex);
      });
    });
  }

  // --- Sticky CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
      const heroSection = document.querySelector('.hero');
      const heroHeight = heroSection ? heroSection.offsetHeight : 400;
      
      window.addEventListener('scroll', () => {
          if (window.scrollY > heroHeight) {
              stickyCta.classList.add('is-visible');
          } else {
              stickyCta.classList.remove('is-visible');
          }
      });
  }

});