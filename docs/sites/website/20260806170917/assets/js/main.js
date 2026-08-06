document.addEventListener('DOMContentLoaded', () => {
  // --- Header Shrink on Scroll ---
  const header = document.querySelector('.km-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    });
  }

  // --- Mobile Navigation Drawer ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');

  if (navToggle && mobileDrawer) {
    const openDrawer = () => {
      mobileDrawer.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      mobileDrawer.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        closeDrawer();
      }
    });
  }

  // --- Sticky Context CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        stickyCta.classList.add('active');
      } else {
        stickyCta.classList.remove('active');
      }
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const denyBtn = document.getElementById('cookie-deny');

  if (cookieBanner) {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      cookieBanner.classList.add('active');
      cookieBanner.setAttribute('aria-hidden', 'false');
    }

    const setConsent = (status) => {
      localStorage.setItem('cookie-consent', status);
      cookieBanner.classList.remove('active');
      cookieBanner.setAttribute('aria-hidden', 'true');
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => setConsent('all'));
    if (denyBtn) denyBtn.addEventListener('click', () => setConsent('essential'));
  }

  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --- FAQ Accordion ---
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const content = trigger.nextElementSibling;

      // Close all other items
      faqTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherTrigger.nextElementSibling.style.maxHeight = null;
          otherTrigger.nextElementSibling.setAttribute('aria-hidden', 'true');
        }
      });

      trigger.setAttribute('aria-expanded', !expanded);
      if (!expanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.setAttribute('aria-hidden', 'false');
      } else {
        content.style.maxHeight = null;
        content.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // --- FAQ Client-side Search ---
  const faqSearch = document.getElementById('faq-search');
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqSearch && faqItems.length > 0) {
    faqSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question').textContent.toLowerCase();
        const answer = item.querySelector('.faq-content').textContent.toLowerCase();
        if (question.includes(query) || answer.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // --- Global Lightbox Modal ---
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentImages = [];
  let currentIndex = 0;

  const setupLightbox = () => {
    const images = document.querySelectorAll('img[data-km-image]');
    currentImages = Array.from(images);

    currentImages.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        currentIndex = index;
        openLightbox(img);
      });
    });
  };

  const openLightbox = (imgElement) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = imgElement.src;
    if (lightboxCaption) lightboxCaption.textContent = imgElement.alt || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    const nextImg = currentImages[currentIndex];
    if (lightboxImg) lightboxImg.src = nextImg.src;
    if (lightboxCaption) lightboxCaption.textContent = nextImg.alt || '';
  };

  const showPrev = () => {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    const prevImg = currentImages[currentIndex];
    if (lightboxImg) lightboxImg.src = prevImg.src;
    if (lightboxCaption) lightboxCaption.textContent = prevImg.alt || '';
  };

  if (lightbox) {
    setupLightbox();
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
      }
    });
  }

  // --- Contact Form Validation ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');
      const successStatus = document.getElementById('form-status-success');

      // Simple validation
      if (nameInput) {
        if (!nameInput.value.trim()) {
          nameInput.parentElement.classList.add('has-error');
          isValid = false;
        } else {
          nameInput.parentElement.classList.remove('has-error');
        }
      }

      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          emailInput.parentElement.classList.add('has-error');
          isValid = false;
        } else {
          emailInput.parentElement.classList.remove('has-error');
        }
      }

      if (messageInput) {
        if (!messageInput.value.trim()) {
          messageInput.parentElement.classList.add('has-error');
          isValid = false;
        } else {
          messageInput.parentElement.classList.remove('has-error');
        }
      }

      if (isValid) {
        // Show success status
        if (successStatus) {
          successStatus.style.display = 'flex';
          contactForm.reset();
        }
      }
    });
  }
});