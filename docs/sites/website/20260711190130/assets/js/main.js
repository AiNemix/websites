document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skip Link
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = skipLink.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
        targetElement.removeAttribute('tabindex');
      }
    });
  }

  // Sticky Header
  const header = document.querySelector('.km-nav');
  if (header) {
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Optional: Hide on scroll down, show on scroll up (for a more dynamic header)
      // if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
      //   header.style.transform = 'translateY(-100%)';
      // } else {
      //   header.style.transform = 'translateY(0)';
      // }
      // lastScrollTop = scrollTop;
    });
  }

  // Mobile Menu
  const mobileMenuToggle = document.querySelector('.km-nav-menu-toggle');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu-nav a');

  const openMobileMenu = () => {
    mobileMenuOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // Prevent scrolling body
    mobileMenuClose.focus(); // Focus the close button for accessibility
  };

  const closeMobileMenu = () => {
    mobileMenuOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileMenu);
  }
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Scroll Reveal Animation
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
  if (!prefersReducedMotion && scrollRevealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.dataset.stagger) {
            Array.from(entry.target.children).forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('is-revealed');
              }, index * 90); // Stagger delay
            });
          } else {
            entry.target.classList.add('is-revealed');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    scrollRevealElements.forEach(el => observer.observe(el));
  }

  // Lightbox System
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImage = document.querySelector('.km-lightbox-image');
  const lightboxClose = document.querySelector('.km-lightbox-close');
  const lightboxPrev = document.querySelector('.km-lightbox-prev');
  const lightboxNext = document.querySelector('.km-lightbox-next');
  let currentImages = [];
  let currentIndex = 0;

  const openLightbox = (images, startIndex) => {
    currentImages = images;
    currentIndex = startIndex;
    updateLightboxImage();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    lightboxImage.src = ''; // Clear image source
    lightboxImage.alt = '';
  };

  const updateLightboxImage = () => {
    if (currentImages.length > 0) {
      const image = currentImages[currentIndex];
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
    }
  };

  const showNextImage = () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightboxImage();
  };

  const showPrevImage = () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightboxImage();
  };

  if (lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      } else if (e.key === 'ArrowRight' && lightbox.classList.contains('is-open')) {
        showNextImage();
      } else if (e.key === 'ArrowLeft' && lightbox.classList.contains('is-open')) {
        showPrevImage();
      }
    });
  }

  // Attach lightbox functionality to gallery items
  document.querySelectorAll('.image-gallery').forEach(gallery => {
    const images = Array.from(gallery.querySelectorAll('.image-gallery-item img')).map(img => ({
      src: img.dataset.kmImage, // Use data-km-image for full resolution
      alt: img.alt
    }));
    gallery.querySelectorAll('.image-gallery-item').forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(images, index));
    });
  });

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  const declineCookiesBtn = document.getElementById('decline-cookies');

  if (cookieBanner) {
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }

    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('show');
    });

    declineCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'false'); // Or handle specific declines
      cookieBanner.classList.remove('show');
    });
  }

  // Sticky Context CTA
  const stickyCtaBar = document.getElementById('sticky-cta-bar');
  if (stickyCtaBar) {
    let lastScrollY = window.scrollY;
    const showThreshold = 300; // Show after scrolling 300px

    window.addEventListener('scroll', () => {
      if (window.scrollY > showThreshold && window.scrollY < lastScrollY) {
        stickyCtaBar.classList.add('show');
      } else if (window.scrollY < showThreshold || window.scrollY > lastScrollY) {
        stickyCtaBar.classList.remove('show');
      }
      lastScrollY = window.scrollY;
    });
  }

  // Accordion (FAQ)
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      header.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });

  // Magnetic Hover Effect (for specific elements, e.g., main CTA in hero)
  document.querySelectorAll('.magnetic-hover').forEach(el => {
    if (prefersReducedMotion) return; // Skip if reduced motion is preferred

    const strength = 15; // How far the element moves
    const children = el.children; // Apply effect to children to avoid text selection issues

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = (x - centerX) / centerX * strength;
      const moveY = (y - centerY) / centerY * strength;

      for (let i = 0; i < children.length; i++) {
        children[i].style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      for (let i = 0; i < children.length; i++) {
        children[i].style.transform = `translate(0, 0)`;
      }
    });
  });

  // Parallax background for hero
  const heroBackground = document.querySelector('.hero-background');
  if (heroBackground && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBackground.style.transform = `translateY(${scrollY * 0.3}px)`;
    });
  }
});