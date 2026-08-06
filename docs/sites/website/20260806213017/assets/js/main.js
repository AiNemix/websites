document.addEventListener('DOMContentLoaded', () => {
  // 1. STICKY HEADER SHRINK
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('header-shrink');
      } else {
        header.classList.remove('header-shrink');
      }
    });
  }

  // 2. MOBILE DRAWER NAVIGATION
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay');

  if (menuToggle && mobileDrawer && drawerOverlay) {
    const toggleMenu = () => {
      const isOpen = mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open');
      drawerOverlay.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    };

    menuToggle.addEventListener('click', toggleMenu);
    drawerOverlay.addEventListener('click', toggleMenu);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleMenu();
      }
    });
  }

  // 3. SCROLL REVEAL ANIMATION
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealOnScroll = () => {
      reveals.forEach((reveal) => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once initially
  }

  // 4. FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-content').style.maxHeight = null;
          }
        });

        item.classList.toggle('active');
        if (!isActive) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = null;
        }
      });
    }
  });

  // 5. CAROUSEL / SLIDER
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');

  if (track && prevBtn && nextBtn) {
    let index = 0;
    const slides = Array.from(track.children);
    
    const updateCarousel = () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = 24; // matches CSS gap
      track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;
    };

    nextBtn.addEventListener('click', () => {
      const maxIndex = slides.length - Math.floor(track.parentElement.clientWidth / slides[0].clientWidth);
      if (index < maxIndex) {
        index++;
        updateCarousel();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (index > 0) {
        index--;
        updateCarousel();
      }
    });

    window.addEventListener('resize', updateCarousel);
  }

  // 6. GLOBAL LIGHTBOX SYSTEM
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  const galleryImages = document.querySelectorAll('[data-km-image]');

  if (lightbox && lightboxImg && galleryImages.length > 0) {
    let currentImageIndex = 0;
    const imageList = Array.from(galleryImages);

    const openLightbox = (idx) => {
      currentImageIndex = idx;
      const src = imageList[idx].getAttribute('src');
      lightboxImg.setAttribute('src', src);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    const showNext = () => {
      currentImageIndex = (currentImageIndex + 1) % imageList.length;
      openLightbox(currentImageIndex);
    };

    const showPrev = () => {
      currentImageIndex = (currentImageIndex - 1 + imageList.length) % imageList.length;
      openLightbox(currentImageIndex);
    };

    imageList.forEach((img, idx) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLightbox(idx));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

  // 7. COOKIE BANNER
  const cookieBanner = document.querySelector('.cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && acceptBtn && declineBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.style.display = 'flex';
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.style.display = 'none';
    });

    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.style.display = 'none';
    });
  }

  // 8. CONTACT FORM SIMULATION
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet...';

      setTimeout(() => {
        submitBtn.textContent = 'Erfolgreich gesendet!';
        submitBtn.style.backgroundColor = '#10b981';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          submitBtn.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    });
  }
});
