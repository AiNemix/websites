document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initStatsCounter();
  initBeforeAfterSlider();
  initFaqAccordion();
  initLightbox();
  initStickyCta();
  initCookieBanner();
  initContactForm();
});

/* Navigation (Sticky Header & Mobile Drawer) */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.querySelector('.drawer-close');
  const backdrop = document.querySelector('.drawer-backdrop');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  });

  // Mobile Drawer Toggle
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      drawer.setAttribute('aria-hidden', expanded);
      if (!expanded) {
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  function closeDrawer() {
    if (drawer) {
      toggle.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      toggle.focus();
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // ESC Key to close Drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.getAttribute('aria-hidden') === 'false') {
      closeDrawer();
    }
  });
}

/* Scroll Reveal using Intersection Observer */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* Stats Counter Animation */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  stats.forEach(stat => observer.observe(stat));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    let current = 0;
    const duration = 1500; // ms
    const stepTime = Math.max(Math.floor(duration / target), 15);
    
    const timer = setInterval(() => {
      current += Math.ceil(target / (duration / stepTime));
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, stepTime);
  }
}

/* Before/After Slider */
function initBeforeAfterSlider() {
  const slider = document.getElementById('before-after-slider');
  const beforeLayer = document.getElementById('before-image-layer');
  const handle = document.getElementById('slider-handle');

  if (!slider || !beforeLayer || !handle) return;

  let isDragging = false;

  function move(x) {
    const rect = slider.getBoundingClientRect();
    let position = ((x - rect.left) / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;

    beforeLayer.style.width = `${position}%`;
    handle.style.left = `${position}%`;
  }

  // Mouse Events
  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    move(e.clientX);
  });

  // Touch Events
  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    move(e.touches[0].clientX);
  });
}

/* FAQ Accordion */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = trigger.nextElementSibling;

      // Close other panels
      triggers.forEach(other => {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
          other.nextElementSibling.setAttribute('aria-hidden', 'true');
        }
      });

      trigger.setAttribute('aria-expanded', !expanded);
      panel.setAttribute('aria-hidden', expanded);

      if (!expanded) {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      } else {
        panel.style.maxHeight = null;
      }
    });
  });
}

/* Global Lightbox System */
function initLightbox() {
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const triggers = document.querySelectorAll('.km-lightbox-trigger');

  if (!lightbox || !lightboxImg) return;

  let currentIndex = 0;
  const images = Array.from(triggers);

  function openLightbox(index) {
    currentIndex = index;
    const img = images[currentIndex];
    // Absolute URL mapping
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    images[currentIndex].focus();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox(currentIndex);
  }

  images.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') openLightbox(index);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

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

/* Sticky Context CTA */
function initStickyCta() {
  const cta = document.getElementById('sticky-context-cta');
  if (!cta) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      cta.classList.add('visible');
    } else {
      cta.classList.remove('visible');
    }
  });
}

/* Cookie Banner */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (!banner) return;

  const consent = localStorage.getItem('cookie-consent');
  if (!consent) {
    setTimeout(() => {
      banner.classList.add('visible');
      banner.setAttribute('aria-hidden', 'false');
    }, 1000);
  }

  function handleConsent(status) {
    localStorage.setItem('cookie-consent', status);
    banner.classList.remove('visible');
    banner.setAttribute('aria-hidden', 'true');
  }

  if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
  if (rejectBtn) rejectBtn.addEventListener('click', () => handleConsent('rejected'));
}

/* Contact Form Validation & Simulation */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successBox = document.getElementById('form-success-message');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        group.classList.add('invalid');
        isValid = false;
      } else if (field.type === 'email' && !validateEmail(field.value)) {
        group.classList.add('invalid');
        isValid = false;
      } else {
        group.classList.remove('invalid');
      }
    });

    if (isValid) {
      form.style.display = 'none';
      if (successBox) {
        successBox.style.display = 'block';
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Real-time validation cleanup
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (input.value.trim()) {
        group.classList.remove('invalid');
      }
    });
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}