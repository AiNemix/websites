document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');

  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      mobileDrawer.classList.toggle('open');
      mobileDrawer.setAttribute('aria-hidden', expanded);
      document.body.style.overflow = expanded ? '' : 'hidden';
    });
  }

  const closeDrawer = () => {
    if (navToggle && mobileDrawer) {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  // ESC key to close drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  // Sticky Header
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('shrink');
    } else {
      header.classList.remove('shrink');
    }
  });

  // Scroll Reveal
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealItems.forEach(item => revealObserver.observe(item));

  // Counter Animation
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        let count = 0;
        const speed = target / 100;

        const updateCount = () => {
          if (count < target) {
            count += speed;
            counter.innerText = Math.ceil(count);
            setTimeout(updateCount, 15);
          } else {
            counter.innerText = target;
          }
        };
        updateCount();
        counterObserver.unobserve(counter);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => counterObserver.observe(counter));

  // FAQ Accordion
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = trigger.nextElementSibling;
      
      // Close all other panels
      faqTriggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherTrigger.nextElementSibling.setAttribute('aria-hidden', 'true');
          otherTrigger.nextElementSibling.style.maxHeight = null;
        }
      });

      trigger.setAttribute('aria-expanded', !expanded);
      panel.setAttribute('aria-hidden', expanded);
      
      if (!expanded) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = null;
      }
    });
  });

  // FAQ Search
  const faqSearch = document.getElementById('faq-search');
  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question').innerText.toLowerCase();
        const answer = item.querySelector('.faq-answer').innerText.toLowerCase();
        
        if (question.includes(query) || answer.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Carousel
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextBtn = document.querySelector('.carousel-btn.next');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (track && slides.length > 0) {
    let currentIndex = 0;

    // Create Dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Gehe zu Bild ${index + 1}`);
      dotsContainer.appendChild(dot);
    });

    const dots = Array.from(document.querySelectorAll('.carousel-dot'));

    const updateCarousel = (index) => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      currentIndex = index;
    };

    nextBtn.addEventListener('click', () => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      updateCarousel(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) prevIndex = slides.length - 1;
      updateCarousel(prevIndex);
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => updateCarousel(index));
    });

    // Touch Swipe Support
    let startX = 0;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (diff > 50) {
        nextBtn.click();
      } else if (diff < -50) {
        prevBtn.click();
      }
    });
  }

  // Global Lightbox Modal
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const galleryImages = document.querySelectorAll('img[data-km-image]');

  if (lightbox && galleryImages.length > 0) {
    let currentImgIndex = 0;
    const imageSources = Array.from(galleryImages).map(img => img.src);

    const openLightbox = (index) => {
      lightboxImg.src = imageSources[index];
      lightbox.style.display = 'flex';
      currentImgIndex = index;
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    };

    galleryImages.forEach((img, index) => {
      const parent = img.closest('.gallery-item') || img.closest('.service-img-wrapper') || img.closest('.image-frame') || img.closest('.hero-image-wrapper') || img.closest('.portfolio-teaser-img-box');
      if (parent) {
        parent.style.cursor = 'pointer';
        parent.addEventListener('click', (e) => {
          e.preventDefault();
          openLightbox(index);
        });
      }
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      let nextIndex = currentImgIndex + 1;
      if (nextIndex >= imageSources.length) nextIndex = 0;
      lightboxImg.src = imageSources[nextIndex];
      currentImgIndex = nextIndex;
    });

    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      let prevIndex = currentImgIndex - 1;
      if (prevIndex < 0) prevIndex = imageSources.length - 1;
      lightboxImg.src = imageSources[prevIndex];
      currentImgIndex = prevIndex;
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') lightboxNext.click();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
      }
    });
  }

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieBanner && cookieAccept && cookieDecline) {
    if (!localStorage.getItem('cookie-consent')) {
      cookieBanner.style.display = 'block';
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      cookieBanner.style.display = 'none';
    });

    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'declined');
      cookieBanner.style.display = 'none';
    });
  }

  // Sticky Context CTA
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('project-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = contactForm.querySelector('.form-success-message');
      if (successMsg) {
        successMsg.style.display = 'block';
        contactForm.reset();
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }
    });
  }
});