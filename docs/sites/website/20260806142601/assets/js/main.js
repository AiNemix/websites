document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  const body = document.body;
  const mobileMenuOverlay = document.createElement('div');
  mobileMenuOverlay.classList.add('mobile-menu-overlay');
  document.body.appendChild(mobileMenuOverlay);

  function toggleMobileMenu() {
    navList.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active');
    mobileMenuOverlay.classList.toggle('is-open');
    body.classList.toggle('no-scroll');

    if (navList.classList.contains('is-open')) {
      // Trap focus inside the menu
      const focusableElements = navList.querySelectorAll('a, button');
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }

  menuToggle.addEventListener('click', toggleMobileMenu);
  mobileMenuOverlay.addEventListener('click', toggleMobileMenu); // Close on overlay click

  // Close menu on ESC key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navList.classList.contains('is-open')) {
      toggleMobileMenu();
    }
  });

  // Close menu when a nav link is clicked
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navList.classList.contains('is-open')) {
        toggleMobileMenu();
      }
    });
  });

  // Sticky Header
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;

  function handleScroll() {
    if (window.scrollY > 100) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }

    // Sticky CTA Bar visibility
    const stickyCtaBar = document.querySelector('.sticky-cta-bar');
    if (stickyCtaBar) {
      if (window.scrollY > window.innerHeight / 2) { // Show after scrolling past half viewport
        stickyCtaBar.classList.add('show');
      } else {
        stickyCtaBar.classList.remove('show');
      }
    }

    lastScrollY = window.scrollY;
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!prefersReducedMotion) {
          entry.target.classList.add('is-visible');
          // Stagger effect for children if needed
          const staggeredChildren = entry.target.querySelectorAll('.stagger-item');
          staggeredChildren.forEach((child, index) => {
            child.style.transitionDelay = `${index * 120}ms`;
            child.classList.add('is-visible');
          });
        } else {
          entry.target.classList.add('is-visible'); // Just show it without animation
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // Magnetic Hover Effect for Buttons
  const magneticButtons = document.querySelectorAll('.btn-magnetic');

  if (!prefersReducedMotion) {
    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const moveX = (x - centerX) / centerX * 5; // max 5px movement
        const moveY = (y - centerY) / centerY * 5;

        button.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });
  }

  // KM Lightbox System
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = lightbox.querySelector('.km-lightbox-image');
  const lightboxCaption = lightbox.querySelector('.km-lightbox-caption');
  const closeBtn = lightbox.querySelector('.km-lightbox-close');
  const prevBtn = lightbox.querySelector('.km-lightbox-prev');
  const nextBtn = lightbox.querySelector('.km-lightbox-next');
  let currentImages = [];
  let currentIndex = -1;

  function openLightbox(imgSrc, imgAlt) {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = imgAlt;
    lightboxCaption.textContent = imgAlt;
    lightbox.classList.add('is-open');
    body.classList.add('no-scroll');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    body.classList.remove('no-scroll');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = ''; // Clear image source
    lightboxImg.alt = '';
    lightboxCaption.textContent = '';
    currentImages = [];
    currentIndex = -1;
  }

  function showNextImage() {
    if (currentImages.length > 0) {
      currentIndex = (currentIndex + 1) % currentImages.length;
      const nextImage = currentImages[currentIndex];
      lightboxImg.src = nextImage.src;
      lightboxImg.alt = nextImage.alt;
      lightboxCaption.textContent = nextImage.alt;
    }
  }

  function showPrevImage() {
    if (currentImages.length > 0) {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      const prevImage = currentImages[currentIndex];
      lightboxImg.src = prevImage.src;
      lightboxImg.alt = prevImage.alt;
      lightboxCaption.textContent = prevImage.alt;
    }
  }

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrevImage);
  nextBtn.addEventListener('click', showNextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) { // Close when clicking on backdrop
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('is-open')) {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      }
    }
  });

  // Attach lightbox functionality to gallery items
  document.querySelectorAll('.gallery-item').forEach((item, index, array) => {
    const img = item.querySelector('img');
    if (img) {
      currentImages.push({ src: img.getAttribute('data-km-image-full'), alt: img.alt });
      item.addEventListener('click', () => {
        currentIndex = array.indexOf(item);
        openLightbox(img.getAttribute('data-km-image-full'), img.alt);
      });
    }
  });

  // Cookie Banner Logic
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  const declineCookiesBtn = document.getElementById('decline-cookies');
  const COOKIE_NAME = 'ainemix_cookies_accepted';

  function showCookieBanner() {
    if (!localStorage.getItem(COOKIE_NAME)) {
      cookieBanner.style.display = 'block';
      setTimeout(() => cookieBanner.classList.add('show'), 100); // Animate in
    }
  }

  function hideCookieBanner() {
    cookieBanner.classList.remove('show');
    setTimeout(() => cookieBanner.style.display = 'none', 500); // Hide after animation
  }

  acceptCookiesBtn.addEventListener('click', () => {
    localStorage.setItem(COOKIE_NAME, 'true');
    hideCookieBanner();
  });

  declineCookiesBtn.addEventListener('click', () => {
    localStorage.setItem(COOKIE_NAME, 'false'); // Or handle decline differently
    hideCookieBanner();
  });

  showCookieBanner();

  // Parallax Effect for .parallax-bg
  const parallaxBackgrounds = document.querySelectorAll('.parallax-bg');
  if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      parallaxBackgrounds.forEach(bg => {
        const scrollPosition = window.scrollY;
        const speed = parseFloat(bg.getAttribute('data-parallax-speed') || 0.5);
        bg.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    });
  }

});
