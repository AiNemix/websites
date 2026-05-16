document.addEventListener('DOMContentLoaded', function() {

  // Sticky Header
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

  // Mobile Navigation
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav-drawer');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Scroll Reveal
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

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  const declineCookies = document.getElementById('decline-cookies');
  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.classList.add('show');
  }
  if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }
  if (declineCookies) {
      declineCookies.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // Lightbox
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-content');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentImageIndex;
  let imageSources = [];

  if (galleryItems.length > 0) {
    imageSources = Array.from(galleryItems).map(item => item.src);

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    function openLightbox(index) {
      currentImageIndex = index;
      lightboxImg.src = imageSources[currentImageIndex];
      lightbox.style.display = 'block';
      document.body.classList.add('no-scroll');
      addLightboxListeners();
    }

    function closeLightbox() {
      lightbox.style.display = 'none';
      document.body.classList.remove('no-scroll');
      removeLightboxListeners();
    }

    function showNextImage() {
      currentImageIndex = (currentImageIndex + 1) % imageSources.length;
      lightboxImg.src = imageSources[currentImageIndex];
    }

    function showPrevImage() {
      currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
      lightboxImg.src = imageSources[currentImageIndex];
    }

    function handleKeydown(e) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    }

    function addLightboxListeners() {
      document.addEventListener('keydown', handleKeydown);
      lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
      lightbox.querySelector('.next-lightbox').addEventListener('click', showNextImage);
      lightbox.querySelector('.prev-lightbox').addEventListener('click', showPrevImage);
      lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    function removeLightboxListeners() {
      document.removeEventListener('keydown', handleKeydown);
    }
  }

  // Smooth scroll for anchor links
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