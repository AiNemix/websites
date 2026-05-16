document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('is-open');
      const isOpen = mainNav.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on backdrop click
    mainNav.addEventListener('click', (e) => {
      if (e.target === mainNav) {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Before/After Image Slider --- //
  const sliderContainer = document.querySelector('.image-comparison-slider');
  if (sliderContainer) {
    const slider = sliderContainer.querySelector('.img-comp-slider');
    const overlay = sliderContainer.querySelector('.img-comp-overlay');

    function slide(x) {
      const rect = sliderContainer.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width * 100;
      if (pos < 0) pos = 0;
      if (pos > 100) pos = 100;
      overlay.style.width = pos + '%';
      slider.style.left = pos + '%';
    }

    let isDragging = false;
    slider.addEventListener('mousedown', () => isDragging = true);
    slider.addEventListener('touchstart', () => isDragging = true);
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('touchend', () => isDragging = false);
    document.addEventListener('mousemove', e => isDragging && slide(e.pageX));
    document.addEventListener('touchmove', e => isDragging && slide(e.touches[0].pageX));
  }

  // --- Scroll Reveal --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
           entry.target.classList.add('visible');
        }, index * 100); // Stagger effect
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookiesBtn) {
    if (!localStorage.getItem('cookiesAccepted')) {
      cookieBanner.classList.add('visible');
    }
    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const gallery = document.getElementById('image-gallery');
  if (lightbox && gallery) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    const galleryImages = Array.from(gallery.querySelectorAll('.gallery-img'));
    const imageSources = galleryImages.map(img => img.src); 
    let currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      lightboxImg.src = imageSources[currentIndex];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeydown);
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
    }

    function showImage(index) {
      currentIndex = (index + imageSources.length) % imageSources.length;
      lightboxImg.src = imageSources[currentIndex];
    }

    function handleKeydown(e) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    }

    galleryImages.forEach((img, index) => {
      img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  }

  // --- Sticky CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  const heroSection = document.querySelector('.hero');
  if (stickyCta && heroSection) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (!entry.isIntersecting) {
                  stickyCta.classList.add('visible');
              } else {
                  stickyCta.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });
      ctaObserver.observe(heroSection);
  }

});