document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Menu ---
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        mobileMenu.classList.add('open');
        document.body.classList.add('no-scroll');
      } else {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }
    });

    // Close on backdrop click (optional, requires a backdrop element)
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        menuToggle.click();
      }
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      });
    }
  });

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // --- Lightbox --- 
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = lightbox.querySelector('.km-lightbox-img');
  const closeBtn = lightbox.querySelector('.km-lightbox-close');
  const prevBtn = lightbox.querySelector('.km-lightbox-prev');
  const nextBtn = lightbox.querySelector('.km-lightbox-next');
  let currentImageIndex;
  let imageSources = [];

  function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = imageSources[currentImageIndex];
    lightbox.style.display = 'flex'; // Use flex to center
    setTimeout(() => lightbox.classList.add('open'), 10);
    document.body.classList.add('no-scroll');
    updateLightboxNav();
    addLightboxEventListeners();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
    }, 300);
    removeLightboxEventListeners();
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
    lightboxImg.src = imageSources[currentImageIndex];
    updateLightboxNav();
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % imageSources.length;
    lightboxImg.src = imageSources[currentImageIndex];
    updateLightboxNav();
  }

  function updateLightboxNav() {
    prevBtn.style.display = imageSources.length > 1 ? 'block' : 'none';
    nextBtn.style.display = imageSources.length > 1 ? 'block' : 'none';
  }

  const handleKeydown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  };

  function addLightboxEventListeners() {
    document.addEventListener('keydown', handleKeydown);
  }

  function removeLightboxEventListeners() {
    document.removeEventListener('keydown', handleKeydown);
  }

  // Event Delegation for galleries
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.property-gallery') && e.target.classList.contains('gallery-item')) {
      e.preventDefault();
      const gallery = e.target.closest('.property-gallery');
      const galleryImages = Array.from(gallery.querySelectorAll('.gallery-item'));
      imageSources = galleryImages.map(img => img.src); // Use absolute URL from src
      const clickedIndex = galleryImages.indexOf(e.target);
      openLightbox(clickedIndex);
    }
  });

  if (lightbox) {
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // --- Contact Form Placeholder ---
  const contactForm = document.querySelector('.contact-form');
  if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const button = this.querySelector('button[type="submit"]');
      button.textContent = 'Nachricht gesendet!';
      button.disabled = true;
      setTimeout(() => {
          this.reset();
          button.textContent = 'Nachricht senden';
          button.disabled = false;
      }, 3000);
    });
  }
});