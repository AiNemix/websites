document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (navToggle && mobileNav) {
    const closeBtn = mobileNav.querySelector('.mobile-nav-close');
    const openNav = () => {
        mobileNav.classList.add('open');
        mobileNav.setAttribute('aria-hidden', 'false');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
    };
    const closeNav = () => {
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    };

    navToggle.addEventListener('click', openNav);
    closeBtn.addEventListener('click', closeNav);
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeNav();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeNav();
    });
  }

  // --- Scroll Animations --- //
  const animatedElements = document.querySelectorAll('.animate-in');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));
  }

  // --- Accordion for FAQ --- //
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
    });
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  const cookieConsent = localStorage.getItem('cookie_consent');

  if (!cookieConsent && cookieBanner) {
    cookieBanner.classList.add('show');
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        stickyCTA.classList.add('show');
      } else {
        stickyCTA.classList.remove('show');
      }
    });
  }

  // --- Global Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const galleryImages = document.querySelectorAll('.gallery-image');
  let currentImageIndex = 0;
  let imageSources = [];

  if (lightbox && galleryImages.length > 0) {
    const lightboxImg = lightbox.querySelector('.km-lightbox-content img');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    
    imageSources = Array.from(galleryImages).map(img => img.src);

    const openLightbox = (index) => {
        currentImageIndex = index;
        lightboxImg.src = imageSources[currentImageIndex];
        lightbox.classList.add('open');
        document.body.classList.add('no-scroll');
        document.addEventListener('keydown', handleLightboxKeydown);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleLightboxKeydown);
    };

    const showImage = (index) => {
        if (index < 0) index = imageSources.length - 1;
        if (index >= imageSources.length) index = 0;
        currentImageIndex = index;
        lightboxImg.src = imageSources[currentImageIndex];
    };

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

    const handleLightboxKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
    };
  }

});