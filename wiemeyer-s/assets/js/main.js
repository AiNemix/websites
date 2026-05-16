document.addEventListener('DOMContentLoaded', function() {

  // --- 1. STICKY HEADER --- //
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- 2. MOBILE MENU --- //
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const menuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  const openMenu = () => {
    if (mobileMenu) {
      mobileMenu.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    }
  };

  const closeMenu = () => {
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', openMenu);
  }
  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }
  
  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // --- 3. SCROLL REVEAL ANIMATION --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // --- 4. FAQ ACCORDION --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
    });
  });

  // --- 5. TESTIMONIAL CAROUSEL --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-controls .next');
    const prevButton = document.querySelector('.carousel-controls .prev');
    const dotsNav = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(i));
        dotsNav.appendChild(dot);
    });
    const dots = Array.from(dotsNav.children);

    const moveToSlide = (targetIndex) => {
        carousel.style.transform = 'translateX(-' + targetIndex * 100 + '%)';
        dots[currentIndex].classList.remove('active');
        dots[targetIndex].classList.add('active');
        currentIndex = targetIndex;
    };

    nextButton.addEventListener('click', () => {
        const newIndex = (currentIndex + 1) % slides.length;
        moveToSlide(newIndex);
    });

    prevButton.addEventListener('click', () => {
        const newIndex = (currentIndex - 1 + slides.length) % slides.length;
        moveToSlide(newIndex);
    });
  }

  // --- 6. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');

  if (cookieBanner && acceptCookiesBtn) {
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }

    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // --- 7. STICKY CTA & BACK TO TOP --- //
  const stickyCta = document.getElementById('sticky-cta');
  const backToTop = document.getElementById('back-to-top');

  if (stickyCta || backToTop) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 400) {
              if(stickyCta) stickyCta.classList.add('visible');
              if(backToTop) backToTop.classList.add('visible');
          } else {
              if(stickyCta) stickyCta.classList.remove('visible');
              if(backToTop) backToTop.classList.remove('visible');
          }
      });
  }

  if (backToTop) {
      backToTop.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  // --- 8. CONTACT FORM --- //
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formStatus = document.getElementById('form-status');
      formStatus.textContent = 'Funktion nicht implementiert. Dies ist eine Demo.';
      formStatus.style.color = 'blue';
    });
  }

});