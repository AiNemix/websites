document.addEventListener('DOMContentLoaded', () => {

  // Mobile Navigation
  const mobileMenuToggle = document.querySelector('.km-nav-menu-toggle');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileNavCloseBtn = document.querySelector('.mobile-nav-close-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-drawer .mobile-nav-link');
  const body = document.body;

  function openMobileNav() {
    mobileNavOverlay.classList.add('open');
    mobileNavDrawer.classList.add('open');
    body.classList.add('no-scroll');
    document.addEventListener('keydown', handleEscapeKey);
  }

  function closeMobileNav() {
    mobileNavOverlay.classList.remove('open');
    mobileNavDrawer.classList.remove('open');
    body.classList.remove('no-scroll');
    document.removeEventListener('keydown', handleEscapeKey);
  }

  function handleEscapeKey(event) {
    if (event.key === 'Escape') {
      closeMobileNav();
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openMobileNav);
  }
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', (e) => {
      if (e.target === mobileNavOverlay) {
        closeMobileNav();
      }
    });
  }
  if (mobileNavCloseBtn) {
    mobileNavCloseBtn.addEventListener('click', closeMobileNav);
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Sticky Header Shrink
  const nav = document.querySelector('.km-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('shrink');
      } else {
        nav.classList.remove('shrink');
      }
    });
  }

  // Scroll Reveal
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.scrollDelay || '0');
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  scrollRevealElements.forEach(el => {
    observer.observe(el);
  });

  // Lightbox System
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.km-lightbox-close') : null;
  const lightboxPrev = lightbox ? lightbox.querySelector('.km-lightbox-prev') : null;
  const lightboxNext = lightbox ? lightbox.querySelector('.km-lightbox-next') : null;
  let currentImages = [];
  let currentIndex = 0;

  function openLightbox(imgSrc, imagesArray, index) {
    if (!lightbox || !lightboxImg) return;
    currentImages = imagesArray;
    currentIndex = index;
    lightboxImg.src = imgSrc;
    lightbox.classList.add('open');
    body.classList.add('no-scroll');
    document.addEventListener('keydown', handleLightboxEscape);
    updateLightboxNav();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    body.classList.remove('no-scroll');
    document.removeEventListener('keydown', handleLightboxEscape);
    // Clear image src to prevent loading issues
    if (lightboxImg) lightboxImg.src = '';
  }

  function handleLightboxEscape(event) {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  }

  function showNextImage() {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    if (lightboxImg) lightboxImg.src = currentImages[currentIndex].src;
    updateLightboxNav();
  }

  function showPrevImage() {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    if (lightboxImg) lightboxImg.src = currentImages[currentIndex].src;
    updateLightboxNav();
  }

  function updateLightboxNav() {
    if (lightboxPrev) lightboxPrev.style.display = currentImages.length > 1 ? 'flex' : 'none';
    if (lightboxNext) lightboxNext.style.display = currentImages.length > 1 ? 'flex' : 'none';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      const galleryItems = Array.from(document.querySelectorAll('.gallery-item img')).map(img => ({ src: img.src }));
      const currentItemIndex = galleryItems.findIndex(img => img.src === imgSrc);
      openLightbox(imgSrc, galleryItems, currentItemIndex);
    });
  });

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  const declineCookiesBtn = document.getElementById('decline-cookies');

  if (cookieBanner) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }

    if (acceptCookiesBtn) {
      acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
      });
    }

    if (declineCookiesBtn) {
      declineCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
      });
    }
  }

  // Sticky Context CTA
  const stickyCtaBar = document.querySelector('.sticky-cta-bar');
  if (stickyCtaBar) {
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > window.innerHeight / 2) {
        // Scrolling down and past half viewport height
        stickyCtaBar.classList.add('show');
      } else if (scrollTop < lastScrollTop || scrollTop <= window.innerHeight / 2) {
        // Scrolling up or near the top
        stickyCtaBar.classList.remove('show');
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.icon');

      // Close other open accordions
      document.querySelectorAll('.accordion-header.active').forEach(activeHeader => {
        if (activeHeader !== header) {
          activeHeader.classList.remove('active');
          activeHeader.nextElementSibling.classList.remove('open');
          activeHeader.nextElementSibling.style.maxHeight = '0';
          activeHeader.querySelector('.icon').style.transform = 'rotate(0deg)';
        }
      });

      header.classList.toggle('active');
      content.classList.toggle('open');
      if (content.classList.contains('open')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(45deg)';
      } else {
        content.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
      }
    });
  });

});
