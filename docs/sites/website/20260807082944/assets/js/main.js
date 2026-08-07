document.addEventListener('DOMContentLoaded', () => {
  /* STICKY HEADER SHRINK */
  const nav = document.querySelector('.km-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('shrink');
    } else {
      nav.classList.remove('shrink');
    }
  });

  /* MOBILE NAVIGATION DRAWER */
  const menuToggle = document.querySelector('.km-nav-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.querySelector('.mobile-menu-close');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  /* SCROLL REVEAL VIA INTERSECTION OBSERVER */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  /* FAQ ACCORDION */
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const panel = item.querySelector('.faq-panel');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other panels
      document.querySelectorAll('.faq-item').forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-panel').style.maxHeight = null;
          otherItem.querySelector('.faq-panel').setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current panel
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
        panel.setAttribute('aria-hidden', 'true');
        item.classList.remove('active');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.setAttribute('aria-hidden', 'false');
        item.classList.add('active');
      }
    });
  });

  /* FAQ SEARCH FILTER */
  const faqSearch = document.getElementById('faq-search');
  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const faqItems = document.querySelectorAll('.faq-item');

      faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        const keywords = item.getAttribute('data-keywords') || '';

        if (question.includes(query) || answer.includes(query) || keywords.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  /* COOKIE BANNER */
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const denyBtn = document.getElementById('cookie-deny');

  if (cookieBanner) {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      cookieBanner.style.display = 'flex';
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      cookieBanner.style.display = 'none';
    });

    denyBtn.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'denied');
      cookieBanner.style.display = 'none';
    });
  }

  /* GLOBAL LIGHTBOX SYSTEM */
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let currentGalleryItems = [];
  let currentImageIndex = 0;

  // Collect all images that should be klickable
  const clickableImages = document.querySelectorAll('[data-km-image]');
  clickableImages.forEach((img) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      const imagePath = img.getAttribute('data-km-image');
      // Find all images in the same gallery/page to enable prev/next
      currentGalleryItems = Array.from(document.querySelectorAll('[data-km-image]')).map(el => el.getAttribute('data-km-image'));
      currentImageIndex = currentGalleryItems.indexOf(imagePath);
      
      openLightbox(imagePath);
    });
  });

  function openLightbox(imagePath) {
    if (!lightbox || !lightboxImg) return;
    
    // Adjust image path if on subpage
    const isSubpage = window.location.pathname.includes('/leistungen/') || 
                      window.location.pathname.includes('/ueber-uns/') || 
                      window.location.pathname.includes('/faq/') || 
                      window.location.pathname.includes('/kontakt/') || 
                      window.location.pathname.includes('/impressum/') || 
                      window.location.pathname.includes('/datenschutz/');
    
    const finalPath = isSubpage ? '../' + imagePath : imagePath;
    
    lightboxImg.setAttribute('src', finalPath);
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showNextImage() {
    if (currentGalleryItems.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentGalleryItems.length;
    openLightbox(currentGalleryItems[currentImageIndex]);
  }

  function showPrevImage() {
    if (currentGalleryItems.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    openLightbox(currentGalleryItems[currentImageIndex]);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
  
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.style.display === 'none') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  /* STICKY CONTEXT CTA */
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        stickyCta.classList.add('visible');
        stickyCta.setAttribute('aria-hidden', 'false');
      } else {
        stickyCta.classList.remove('visible');
        stickyCta.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* INTERACTIVE CONTACT FORM */
  const contactForm = document.getElementById('interactive-contact-form');
  const successMessage = document.getElementById('form-success-message');

  if (contactForm && successMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate AJAX request
      contactForm.style.display = 'none';
      successMessage.style.display = 'block';
      
      // Scroll to success message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});