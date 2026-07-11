document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header Shrink on Scroll
  const header = document.querySelector('.km-nav');
  if (header) {
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 50) {
        header.classList.add('shrink');
      } else if (scrollTop < lastScrollTop || scrollTop <= 50) {
        header.classList.remove('shrink');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });
  }

  // Mobile Menu
  const mobileMenuToggle = document.querySelector('.km-nav-menu-toggle');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuDrawer = document.querySelector('.mobile-menu-drawer');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');

  function openMobileMenu() {
    mobileMenuOverlay.classList.add('open');
    mobileMenuDrawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent scroll
    mobileMenuClose.focus();
  }

  function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('open');
    mobileMenuDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileMenu);
  }
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });
  }
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Scroll Reveal Animation
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const isActive = button.classList.toggle('active');
      answer.classList.toggle('open', isActive);
      answer.style.maxHeight = isActive ? answer.scrollHeight + 'px' : '0';
    });
  });

  // Lightbox System
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.querySelector('.km-lightbox-img');
  const lightboxClose = document.querySelector('.km-lightbox-close');
  const lightboxPrev = document.querySelector('.km-lightbox-prev');
  const lightboxNext = document.querySelector('.km-lightbox-next');
  let currentImages = [];
  let currentIndex = 0;

  function openLightbox(imgSrc, imagesArray, index) {
    lightboxImg.src = imgSrc;
    currentImages = imagesArray;
    currentIndex = index;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = ''; // Clear image source
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex];
  }

  function showPrevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex];
  }

  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    const img = item.querySelector('img');
    const allImagesInGallery = Array.from(item.closest('.gallery-grid').querySelectorAll('img')).map(el => el.getAttribute('data-km-image'));
    item.addEventListener('click', () => openLightbox(img.getAttribute('data-km-image'), allImagesInGallery, index));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    } else if (e.key === 'ArrowRight' && lightbox.classList.contains('open')) {
      showNextImage();
    } else if (e.key === 'ArrowLeft' && lightbox.classList.contains('open')) {
      showPrevImage();
    }
  });

  // Cookie Banner
  const cookieBanner = document.querySelector('.cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  const declineCookiesBtn = document.getElementById('decline-cookies');

  if (cookieBanner) {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }

    if (acceptCookiesBtn) {
      acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
      });
    }

    if (declineCookiesBtn) {
      declineCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
        // Optionally, disable non-essential cookies here
      });
    }
  }

  // Sticky Context CTA
  const stickyCtaBar = document.querySelector('.sticky-cta-bar');
  if (stickyCtaBar && !prefersReducedMotion) {
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300 && window.scrollY < lastScrollY) { // Show on scroll up after initial scroll
        stickyCtaBar.classList.add('show');
      } else if (window.scrollY > lastScrollY || window.scrollY <= 300) { // Hide on scroll down or near top
        stickyCtaBar.classList.remove('show');
      }
      lastScrollY = window.scrollY;
    });
  }

  // Magnetic Hover Effect for Buttons (example for .btn-primary)
  document.querySelectorAll('.btn-primary, .service-card, .usp-pillar').forEach(el => {
    if (prefersReducedMotion) return;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const moveX = (x - centerX) / centerX * 5; // max 5px movement
      const moveY = (y - centerY) / centerY * 5; // max 5px movement

      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
      el.style.boxShadow = `0 ${18 + Math.abs(moveY)}px ${44 + Math.abs(moveY) * 2}px rgba(0,0,0,0.45)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.boxShadow = '';
    });
  });
});
