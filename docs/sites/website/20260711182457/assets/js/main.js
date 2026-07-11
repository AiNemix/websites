document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileMenuDrawer = document.querySelector('.mobile-menu-drawer');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-list a');
  const faqButtons = document.querySelectorAll('.faq-question-button');
  const cookieBanner = document.querySelector('.cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  const declineCookiesBtn = document.getElementById('decline-cookies');
  const stickyCtaBar = document.querySelector('.sticky-cta-bar');
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImage = document.querySelector('.km-lightbox-image');
  const lightboxClose = document.querySelector('.km-lightbox-close');
  const lightboxPrev = document.querySelector('.km-lightbox-prev');
  const lightboxNext = document.querySelector('.km-lightbox-next');
  let currentImageIndex = 0;
  let galleryImages = [];

  // Header shrink on scroll
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      if (stickyCtaBar && !localStorage.getItem('cookiesAccepted')) {
        stickyCtaBar.classList.add('show');
      }
    } else {
      header.classList.remove('scrolled');
      if (stickyCtaBar) {
        stickyCtaBar.classList.remove('show');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // Mobile Menu Toggle
  const toggleMobileMenu = () => {
    const isOpen = mobileMenuOverlay.classList.toggle('is-open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) {
      mobileMenuDrawer.focus();
    }
  };

  navToggle.addEventListener('click', toggleMobileMenu);
  mobileMenuClose.addEventListener('click', toggleMobileMenu);
  mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
      toggleMobileMenu();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('is-open')) {
      toggleMobileMenu();
    }
  });
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
  });

  // FAQ Accordion
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true' || false;
      button.setAttribute('aria-expanded', !expanded);
      const answer = button.nextElementSibling;
      if (!expanded) {
        answer.classList.add('is-open');
      } else {
        answer.classList.remove('is-open');
      }
    });
  });

  // Cookie Banner
  const showCookieBanner = () => {
    if (!localStorage.getItem('cookiesAccepted')) {
      cookieBanner.classList.add('show');
    }
  };

  const hideCookieBanner = () => {
    cookieBanner.classList.remove('show');
  };

  acceptCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    hideCookieBanner();
    if (stickyCtaBar && window.scrollY > 50) {
      stickyCtaBar.classList.add('show');
    }
  });

  declineCookiesBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'false');
    hideCookieBanner();
  });

  showCookieBanner();

  // Scroll Reveal Animation
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 90); // Stagger effect
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  scrollRevealElements.forEach(el => observer.observe(el));

  // Lightbox System
  const openLightbox = (index) => {
    currentImageIndex = index;
    const image = galleryImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    updateLightboxButtons();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    lightboxImage.src = ''; // Clear image src
  };

  const showNextImage = () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    const image = galleryImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    updateLightboxButtons();
  };

  const showPrevImage = () => {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    const image = galleryImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    updateLightboxButtons();
  };

  const updateLightboxButtons = () => {
    lightboxPrev.style.display = galleryImages.length > 1 ? 'flex' : 'none';
    lightboxNext.style.display = galleryImages.length > 1 ? 'flex' : 'none';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxNext.addEventListener('click', showNextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
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

  // Collect gallery images (run on each page load)
  const collectGalleryImages = () => {
    galleryImages = [];
    document.querySelectorAll('.image-gallery-item img').forEach((img, index) => {
      galleryImages.push({ src: img.getAttribute('data-km-image'), alt: img.alt });
      img.closest('.image-gallery-item').addEventListener('click', () => openLightbox(index));
    });
  };
  collectGalleryImages();

  // Form validation (basic example)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;

      this.querySelectorAll('input, textarea').forEach(input => {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup ? formGroup.querySelector('.form-error-message') : null;

        if (input.hasAttribute('required') && input.value.trim() === '') {
          isValid = false;
          formGroup.classList.add('has-error');
          if (errorMessage) errorMessage.textContent = 'Dieses Feld ist erforderlich.';
        } else if (input.type === 'email' && input.value.trim() !== '' && !/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(input.value)) {
          isValid = false;
          formGroup.classList.add('has-error');
          if (errorMessage) errorMessage.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        } else {
          formGroup.classList.remove('has-error');
          if (errorMessage) errorMessage.textContent = '';
        }
      });

      if (isValid) {
        alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
        this.reset();
      } else {
        alert('Bitte überprüfen Sie Ihre Eingaben.');
      }
    });
  }

});
