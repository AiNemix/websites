document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Sticky Header --- //
  const header = document.querySelector('.km-header');
  if (header) {
    let lastScrollY = window.scrollY;
    const updateHeader = () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check
  }

  // --- Mobile Menu Drawer --- //
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuDrawer = document.querySelector('.mobile-menu-drawer');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu-nav a');

  const toggleMobileMenu = () => {
    const isOpen = mobileMenuDrawer.classList.toggle('is-active');
    mobileMenuOverlay.classList.toggle('is-active', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);

    if (isOpen) {
      mobileMenuClose.focus(); // Focus first interactive element
      // Trap focus inside the drawer
      mobileMenuDrawer.addEventListener('keydown', trapFocus);
    } else {
      mobileMenuDrawer.removeEventListener('keydown', trapFocus);
    }
  };

  const closeMobileMenu = () => {
    mobileMenuDrawer.classList.remove('is-active');
    mobileMenuOverlay.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
    mobileMenuToggle.focus(); // Return focus to toggle button
    mobileMenuDrawer.removeEventListener('keydown', trapFocus);
  };

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuDrawer.classList.contains('is-active')) {
      closeMobileMenu();
    }
  });

  // Focus trap for mobile menu
  function trapFocus(e) {
    const focusableElements = mobileMenuDrawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  }

  // --- Scroll Reveal Animation --- //
  if (!prefersReducedMotion) {
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('is-visible');
          // Apply staggered delay to children if present
          Array.from(target.children).forEach((child, index) => {
            child.style.setProperty('--stagger-delay', `${index * 100}ms`);
          });
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    scrollRevealElements.forEach(el => observer.observe(el));
  }

  // --- Parallax Effect for Hero Background --- //
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      document.documentElement.style.setProperty('--scroll', window.scrollY);
    });
  }

  // --- FAQ Accordion --- //
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      question.setAttribute('aria-expanded', !isExpanded);
      answer.classList.toggle('is-open', !isExpanded);
      answer.style.maxHeight = !isExpanded ? `${answer.scrollHeight}px` : '0';
    });
  });

  // --- Lightbox System --- //
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.querySelector('.km-lightbox-img');
  const lightboxClose = document.querySelector('.km-lightbox-close');
  const lightboxPrev = document.querySelector('.km-lightbox-prev');
  const lightboxNext = document.querySelector('.km-lightbox-next');
  let currentImages = [];
  let currentIndex = 0;

  function openLightbox(imgSrc, allImages) {
    if (prefersReducedMotion) {
      lightbox.style.transition = 'none';
    }
    currentImages = allImages;
    currentIndex = currentImages.indexOf(imgSrc);
    lightboxImg.src = imgSrc;
    lightbox.classList.add('is-active');
    document.body.classList.add('no-scroll');
    lightboxClose.focus(); // Focus close button
    updateLightboxNav();
  }

  function closeLightbox() {
    if (prefersReducedMotion) {
      lightbox.style.transition = 'none';
    }
    lightbox.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
    // Clear image source to prevent content flash on next open
    lightboxImg.src = '';
  }

  function navigateLightbox(direction) {
    currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex];
    updateLightboxNav();
  }

  function updateLightboxNav() {
    if (currentImages.length <= 1) {
      lightboxPrev.style.display = 'none';
      lightboxNext.style.display = 'none';
    } else {
      lightboxPrev.style.display = 'flex';
      lightboxNext.style.display = 'flex';
    }
  }

  if (lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) { // Click on backdrop
        closeLightbox();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('is-active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
      }
    });
  }

  document.querySelectorAll('.km-gallery-item img, .km-carousel-item img').forEach(img => {
    img.addEventListener('click', (e) => {
      const clickedSrc = e.target.getAttribute('data-km-image');
      const galleryImages = Array.from(e.target.closest('.km-gallery, .km-carousel-inner').querySelectorAll('img')).map(el => el.getAttribute('data-km-image'));
      openLightbox(clickedSrc, galleryImages);
    });
  });

  // --- Carousel Functionality --- //
  document.querySelectorAll('.km-carousel').forEach(carousel => {
    const inner = carousel.querySelector('.km-carousel-inner');
    const items = carousel.querySelectorAll('.km-carousel-item');
    const prevBtn = carousel.querySelector('.km-carousel-prev');
    const nextBtn = carousel.querySelector('.km-carousel-next');
    const dotsContainer = carousel.querySelector('.km-carousel-dots');
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;

    if (!inner || items.length === 0) return; // Exit if no items or inner container

    // Create dots
    if (dotsContainer) {
      items.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('km-carousel-dot');
        dot.setAttribute('aria-label', `Gehe zu Folie ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    }
    const dots = carousel.querySelectorAll('.km-carousel-dot');

    function goToSlide(index) {
      if (prefersReducedMotion) {
        inner.style.transition = 'none';
      } else {
        inner.style.transition = `transform var(--motion-duration-base) var(--motion-easing-smooth)`;
      }
      currentIndex = index;
      inner.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function handleTouchStart(e) {
      isDragging = true;
      startX = e.touches[0].clientX;
      if (prefersReducedMotion) {
        inner.style.transition = 'none';
      }
    }

    function handleTouchMove(e) {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      inner.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diffX}px))`;
    }

    function handleTouchEnd() {
      isDragging = false;
      const currentX = event.changedTouches[0].clientX;
      const diffX = currentX - startX;
      if (diffX > 50) { // Swipe right
        goToSlide(Math.max(0, currentIndex - 1));
      } else if (diffX < -50) { // Swipe left
        goToSlide(Math.min(items.length - 1, currentIndex + 1));
      } else {
        goToSlide(currentIndex); // Snap back
      }
    }

    inner.addEventListener('touchstart', handleTouchStart);
    inner.addEventListener('touchmove', handleTouchMove);
    inner.addEventListener('touchend', handleTouchEnd);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(Math.max(0, currentIndex - 1)));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(Math.min(items.length - 1, currentIndex + 1)));
    }

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToSlide(Math.max(0, currentIndex - 1));
      } else if (e.key === 'ArrowRight') {
        goToSlide(Math.min(items.length - 1, currentIndex + 1));
      }
    });

    goToSlide(0); // Initialize carousel
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  const declineCookiesBtn = document.getElementById('decline-cookies');

  if (cookieBanner) {
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');

    if (!hasAcceptedCookies) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000); // Show after 1 second
    }

    if (acceptCookiesBtn) {
      acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
      });
    }

    if (declineCookiesBtn) {
      declineCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'false'); // Or handle specific declines
        cookieBanner.classList.remove('show');
      });
    }
  }

  // --- Sticky Context CTA Bar --- //
  const stickyCtaBar = document.querySelector('.sticky-cta-bar');
  if (stickyCtaBar && !prefersReducedMotion) {
    const toggleVisibility = () => {
      if (window.scrollY > window.innerHeight / 2) { // Show after scrolling half viewport height
        stickyCtaBar.classList.add('is-visible');
      } else {
        stickyCtaBar.classList.remove('is-visible');
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); // Initial check
  }

  // --- Back to Top with Progress Ring (Optional, respects reduced motion) --- //
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn && !prefersReducedMotion) {
    const progressRing = backToTopBtn.querySelector('circle:nth-child(2)');
    const radius = progressRing.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = circumference;

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight);
      const offset = circumference - progress * circumference;
      progressRing.style.strokeDashoffset = offset;

      if (window.scrollY > window.innerHeight / 2) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    };

    window.addEventListener('scroll', updateProgress);
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    updateProgress(); // Initial check
  }

});
