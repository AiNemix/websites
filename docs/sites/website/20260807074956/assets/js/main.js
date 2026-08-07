document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-menu');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');

  if (navToggle && mobileDrawer) {
    const openMenu = () => {
      mobileDrawer.style.display = 'block';
      setTimeout(() => {
        mobileDrawer.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }, 10);
    };

    const closeMenu = () => {
      mobileDrawer.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        mobileDrawer.style.display = 'none';
      }, 300);
    };

    navToggle.addEventListener('click', openMenu);
    if (drawerClose) drawerClose.addEventListener('click', closeMenu);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMenu);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ==========================================================================
     STICKY HEADER SHRINK
     ========================================================================== */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('shrink');
      } else {
        header.classList.remove('shrink');
      }
    });
  }

  /* ==========================================================================
     STICKY CONTEXT CTA
     ========================================================================== */
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        stickyCta.classList.add('visible');
        stickyCta.setAttribute('aria-hidden', 'false');
      } else {
        stickyCta.classList.remove('visible');
        stickyCta.setAttribute('aria-hidden', 'true');
      }
    });
  }

  /* ==========================================================================
     REVEAL ANIMATION ON SCROLL
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-element');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('reveal-init');
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // Add CSS styles dynamically for reveal animation
  const style = document.createElement('style');
  style.innerHTML = `
    .reveal-init {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-init.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  /* ==========================================================================
     SIGNATURE WOOD EXPLORER
     ========================================================================== */
  const woodTabs = document.querySelectorAll('.wood-tab');
  const woodPanels = document.querySelectorAll('.wood-panel');

  if (woodTabs.length > 0) {
    woodTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetWood = tab.getAttribute('data-wood');

        woodTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        woodPanels.forEach(panel => {
          if (panel.id === `wood-panel-${targetWood}`) {
            panel.style.display = 'block';
            panel.classList.add('active');
          } else {
            panel.style.display = 'none';
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  /* ==========================================================================
     CAROUSEL SYSTEM (TOUCH, KEYBOARD, DOTS)
     ========================================================================== */
  const carousel = document.getElementById('project-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;

    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      updateCarousel();
    };

    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

    // Swipe gesture
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
        isDragging = false;
      }
    }, { passive: true });

    track.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  /* ==========================================================================
     FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          i.querySelector('.faq-content').style.maxHeight = '0';
          i.querySelector('.faq-content').setAttribute('aria-hidden', 'true');
        });

        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = `${content.scrollHeight}px`;
          content.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  /* ==========================================================================
     GLOBAL LIGHTBOX SYSTEM
     ========================================================================== */
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const galleryImages = document.querySelectorAll('.clickable-gallery-img');

  if (lightbox && lightboxImg && galleryImages.length > 0) {
    const imageSources = Array.from(galleryImages).map(img => img.src);
    let currentImgIndex = 0;

    const openLightbox = (index) => {
      currentImgIndex = index;
      lightboxImg.src = imageSources[currentImgIndex];
      lightbox.style.display = 'flex';
      setTimeout(() => {
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }, 10);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightbox.style.display = 'none';
      }, 300);
    };

    galleryImages.forEach((img, index) => {
      img.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    const navigateLightbox = (direction) => {
      currentImgIndex = (currentImgIndex + direction + imageSources.length) % imageSources.length;
      lightboxImg.src = imageSources[currentImgIndex];
    };

    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
      }
    });
  }

  /* ==========================================================================
     COOKIE BANNER
     ========================================================================== */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    const isCookieAccepted = localStorage.getItem('baumhaus_cookies_accepted');
    if (!isCookieAccepted) {
      setTimeout(() => {
        cookieBanner.classList.add('visible');
        cookieBanner.setAttribute('aria-hidden', 'false');
      }, 1500);
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('baumhaus_cookies_accepted', 'true');
      cookieBanner.classList.remove('visible');
      cookieBanner.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 300);
    });
  }

  /* ==========================================================================
     N8N CHAT WIDGET (SIGNATURE FEATURE)
     ========================================================================== */
  const chatWidget = document.getElementById('chat-widget');
  if (chatWidget) {
    const trigger = chatWidget.querySelector('.chat-trigger-btn');
    const windowEl = chatWidget.querySelector('.chat-window');
    const closeBtn = chatWidget.querySelector('.chat-close-btn');
    const form = chatWidget.querySelector('#chat-form');
    const input = chatWidget.querySelector('#chat-input-field');
    const messagesBox = chatWidget.querySelector('#chat-messages-box');

    trigger.addEventListener('click', () => {
      const isOpen = windowEl.classList.contains('open');
      if (isOpen) {
        windowEl.classList.remove('open');
        windowEl.setAttribute('aria-hidden', 'true');
        setTimeout(() => { windowEl.style.display = 'none'; }, 300);
      } else {
        windowEl.style.display = 'flex';
        setTimeout(() => {
          windowEl.classList.add('open');
          windowEl.setAttribute('aria-hidden', 'false');
        }, 10);
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('open');
        windowEl.setAttribute('aria-hidden', 'true');
        setTimeout(() => { windowEl.style.display = 'none'; }, 300);
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        // Append User Message
        const userMsg = document.createElement('div');
        userMsg.classList.add('chat-msg', 'user');
        userMsg.innerHTML = `<p>${text}</p>`;
        messagesBox.appendChild(userMsg);
        input.value = '';
        messagesBox.scrollTop = messagesBox.scrollHeight;

        // Simulate Bot Response (n8n Mock)
        setTimeout(() => {
          const botMsg = document.createElement('div');
          botMsg.classList.add('chat-msg', 'bot');
          botMsg.innerHTML = `<p>Vielen Dank für Ihre Nachricht! Ein Tischler aus unserer Werkstatt in Hannover wird sich in Kürze mit Ihnen in Verbindung setzen.</p>`;
          messagesBox.appendChild(botMsg);
          messagesBox.scrollTop = messagesBox.scrollHeight;
        }, 1000);
      });
    }
  }

  /* ==========================================================================
     PREMIUM CONTACT FORM SUCCESS STATE
     ========================================================================== */
  const contactForm = document.getElementById('project-contact-form');
  const successBox = document.getElementById('form-success-box');

  if (contactForm && successBox) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      successBox.style.display = 'block';
    });
  }

});