document.addEventListener('DOMContentLoaded', () => {
  // 1. Canvas Background Animation
  initCanvasBackground();

  // 2. Navigation Shrink & Mobile Drawer
  initNavigation();

  // 3. Scroll Reveal
  initScrollReveal();

  // 4. Carousel (References)
  initCarousel();

  // 5. FAQ Accordion & Search
  initFAQ();

  // 6. Contact Form Validation
  initContactForm();

  // 7. Cookie Banner
  initCookieBanner();

  // 8. Sticky Context CTA & Lightbox
  initStickyCTAAndLightbox();
});

function initCanvasBackground() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animationFrameId;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const nodes = [];
  const maxNodes = window.innerWidth < 768 ? 30 : 70;
  const connectionDistance = 120;

  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00F5FF';
      ctx.fill();
    }
  }

  for (let i = 0; i < maxNodes; i++) {
    nodes.push(new Node());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();

      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 245, 255, ${1 - dist / connectionDistance})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

function initNavigation() {
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('header--shrink');
    } else {
      header.classList.remove('header--shrink');
    }
  });

  function toggleMenu() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    mobileDrawer.classList.toggle('active');
    backdrop.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }

  if (backdrop) {
    backdrop.addEventListener('click', toggleMenu);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      toggleMenu();
    }
  });
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => observer.observe(reveal));
}

function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const prevBtn = document.querySelector('.carousel-btn--prev');
  const nextBtn = document.querySelector('.carousel-btn--next');
  const slides = Array.from(track.children);
  let currentIndex = 0;

  function getSlidesPerView() {
    if (window.innerWidth < 480) return 1;
    if (window.innerWidth < 768) return 2;
    return 3;
  }

  function updateCarousel() {
    const slidesPerView = getSlidesPerView();
    const maxIndex = Math.max(0, slides.length - slidesPerView);
    currentIndex = Math.min(currentIndex, maxIndex);
    currentIndex = Math.max(0, currentIndex);

    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 24;
    const offset = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex++;
      updateCarousel();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex--;
      updateCarousel();
    });
  }

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearch = document.querySelector('.faq-search');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question').textContent.toLowerCase();
        const answerText = item.querySelector('.faq-answer-content').textContent.toLowerCase();
        if (questionText.includes(query) || answerText.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      status.className = 'form-status error';
      status.textContent = 'Bitte füllen Sie alle erforderlichen Felder aus.';
      return;
    }

    // Simulate API Call
    status.className = 'form-status success';
    status.textContent = 'Vielen Dank für Ihre Anfrage! Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.';
    form.reset();
  });
}

function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (!localStorage.getItem('cookies-accepted')) {
    setTimeout(() => {
      banner.classList.add('active');
    }, 1000);
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookies-accepted', 'true');
    banner.classList.remove('active');
  });

  declineBtn.addEventListener('click', () => {
    localStorage.setItem('cookies-accepted', 'false');
    banner.classList.remove('active');
  });
}

function initStickyCTAAndLightbox() {
  const stickyCta = document.querySelector('.sticky-cta');
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  // Sticky CTA Visibility on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      stickyCta.classList.add('active');
    } else {
      stickyCta.classList.remove('active');
    }
  });

  // Lightbox Logic
  const galleryImages = document.querySelectorAll('[data-km-image]');
  let currentImageIndex = 0;
  const imageList = Array.from(galleryImages).map(img => img.getAttribute('data-km-image'));

  galleryImages.forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      currentImageIndex = index;
      openLightbox(imageList[currentImageIndex]);
    });
  });

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    // Resolve relative path based on current page depth
    const isSubpage = window.location.pathname.includes('/leistungen/') || 
                      window.location.pathname.includes('/praxis/') || 
                      window.location.pathname.includes('/kontakt/') || 
                      window.location.pathname.includes('/faq/') || 
                      window.location.pathname.includes('/impressum/') || 
                      window.location.pathname.includes('/datenschutz/');
    
    const resolvedSrc = isSubpage ? '../' + src : src;
    lightboxImg.src = resolvedSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}