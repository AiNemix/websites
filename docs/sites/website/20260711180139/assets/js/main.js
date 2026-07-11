document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth Scroll for Skip Link
  document.querySelector('.skip-link').addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    document.querySelector(targetId).scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
    document.querySelector(targetId).focus();
  });

  // Header Shrink on Scroll
  const header = document.querySelector('.km-nav');
  const headerHeight = header.offsetHeight;
  const shrinkThreshold = 50;

  function checkHeaderShrink() {
    if (window.scrollY > shrinkThreshold) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  }

  window.addEventListener('scroll', checkHeaderShrink);
  checkHeaderShrink(); // Initial check

  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.km-nav-menu-toggle');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuDrawer = document.querySelector('.mobile-menu-drawer');
  const mobileMenuCloseBtn = document.querySelector('.mobile-menu-close-btn');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-nav a');

  function openMobileMenu() {
    mobileMenuOverlay.classList.add('open');
    mobileMenuDrawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    mobileMenuCloseBtn.focus(); // Focus first element
  }

  function closeMobileMenu() {
    mobileMenuOverlay.classList.remove('open');
    mobileMenuDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileMenuToggle.addEventListener('click', openMobileMenu);
  mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
  mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
      closeMobileMenu();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('open')) {
      closeMobileMenu();
    }
  });
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Scroll Reveal Animation
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!prefersReducedMotion) {
          const delay = parseInt(entry.target.dataset.scrollDelay || '0');
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
        } else {
          entry.target.classList.add('visible'); // Just show it instantly
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  scrollRevealElements.forEach(el => {
    observer.observe(el);
  });

  // FAQ Accordion
  document.querySelectorAll('.faq-question-button').forEach(button => {
    button.addEventListener('click', () => {
      const answer = button.nextElementSibling;
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      button.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
        answer.classList.remove('open');
      }
    });
  });

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  const declineCookiesBtn = document.getElementById('decline-cookies');

  if (!localStorage.getItem('cookieConsent')) {
    cookieBanner.classList.add('show');
  }

  acceptCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.classList.remove('show');
  });

  declineCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieBanner.classList.remove('show');
  });

  // Lightbox System
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.getElementById('km-lightbox-img');
  const lightboxClose = document.getElementById('km-lightbox-close');
  const lightboxPrev = document.getElementById('km-lightbox-prev');
  const lightboxNext = document.getElementById('km-lightbox-next');
  let currentImages = [];
  let currentIndex = 0;

  function openLightbox(imgSrc, altText, allImages) {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = altText;
    currentImages = allImages;
    currentIndex = allImages.findIndex(img => img.src === imgSrc);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateLightboxNav();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = ''; // Clear image source
    lightboxImg.alt = '';
    currentImages = [];
    currentIndex = 0;
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex].src;
    lightboxImg.alt = currentImages[currentIndex].alt;
    updateLightboxNav();
  }

  function showPrevImage() {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex].src;
    lightboxImg.alt = currentImages[currentIndex].alt;
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

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxNext.addEventListener('click', showNextImage);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    }
  });

  // Attach lightbox functionality to gallery items
  document.querySelectorAll('.gallery-item img, .carousel-slide img').forEach(img => {
    img.addEventListener('click', (e) => {
      const allImages = Array.from(document.querySelectorAll('.gallery-item img, .carousel-slide img')).map(el => ({
        src: el.dataset.kmImage, // Use data-km-image for full path
        alt: el.alt
      }));
      openLightbox(e.target.dataset.kmImage, e.target.alt, allImages);
    });
  });

  // Carousel functionality
  document.querySelectorAll('.carousel-container').forEach(container => {
    const track = container.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    const dotsContainer = container.querySelector('.carousel-dots');
    let currentSlide = 0;
    let startX = 0;
    let isDragging = false;

    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Gehe zu Slide ${index + 1}`);
      dot.addEventListener('click', () => moveToSlide(index));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    function updateCarousel() {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function moveToSlide(index) {
      currentSlide = index;
      updateCarousel();
    }

    prevBtn.addEventListener('click', () => {
      moveToSlide((currentSlide - 1 + slides.length) % slides.length);
    });

    nextBtn.addEventListener('click', () => {
      moveToSlide((currentSlide + 1) % slides.length);
    });

    // Keyboard navigation
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        moveToSlide((currentSlide - 1 + slides.length) % slides.length);
      } else if (e.key === 'ArrowRight') {
        moveToSlide((currentSlide + 1) % slides.length);
      }
    });

    // Touch/Drag functionality
    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      track.style.cursor = 'grabbing';
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const diff = e.clientX - startX;
      track.style.transform = `translateX(calc(-${currentSlide * 100}% + ${diff}px))`;
    });

    track.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = 'grab';
      const endX = e.clientX;
      const diff = endX - startX;
      if (diff > 50) { // Swipe right
        moveToSlide((currentSlide - 1 + slides.length) % slides.length);
      } else if (diff < -50) { // Swipe left
        moveToSlide((currentSlide + 1) % slides.length);
      } else {
        updateCarousel(); // Snap back if not enough swipe
      }
    });

    track.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        track.style.cursor = 'grab';
        updateCarousel();
      }
    });

    track.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diff = e.touches[0].clientX - startX;
      track.style.transform = `translateX(calc(-${currentSlide * 100}% + ${diff}px))`;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (diff > 50) { // Swipe right
        moveToSlide((currentSlide - 1 + slides.length) % slides.length);
      } else if (diff < -50) { // Swipe left
        moveToSlide((currentSlide + 1) % slides.length);
      } else {
        updateCarousel(); // Snap back if not enough swipe
      }
    });

    updateCarousel(); // Initial update
  });

  // Sticky CTA Bar
  const stickyCtaBar = document.querySelector('.sticky-cta-bar');
  const footer = document.querySelector('.footer');

  function checkStickyCtaVisibility() {
    const footerRect = footer.getBoundingClientRect();
    if (footerRect.top < window.innerHeight - stickyCtaBar.offsetHeight) {
      stickyCtaBar.classList.remove('show');
    } else if (window.scrollY > window.innerHeight / 2) {
      stickyCtaBar.classList.add('show');
    } else {
      stickyCtaBar.classList.remove('show');
    }
  }

  window.addEventListener('scroll', checkStickyCtaVisibility);
  checkStickyCtaVisibility(); // Initial check

});
