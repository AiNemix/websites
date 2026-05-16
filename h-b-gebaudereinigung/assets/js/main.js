document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
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

  // --- Mobile Menu ---
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // --- Scroll Animations ---
  const animatedElements = document.querySelectorAll('.animate-in');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));
  }

  // --- Before/After Slider ---
  const slider = document.querySelector('.before-after-slider');
  if (slider) {
    const sliderInput = slider.querySelector('.slider-input');
    const afterImg = slider.querySelector('.after-img');
    const handle = slider.querySelector('.slider-handle');
    sliderInput.addEventListener('input', (e) => {
      const value = e.target.value + '%';
      afterImg.style.width = value;
      handle.style.left = value;
    });
  }

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const slides = document.querySelectorAll('.testimonial-slide');
    let currentIndex = 0;

    const updateCarousel = () => {
        const slideWidth = slides[0].clientWidth;
        carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        if(currentIndex > slides.length - (window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3)) {
            currentIndex = 0;
        }
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });
    window.addEventListener('resize', updateCarousel);
  }

  // --- Accordion for Services Page ---
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });

  // --- Contact Form ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const formStatus = document.getElementById('form-status');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // This is a dummy submission handler. In a real project, this would send data to a server.
      formStatus.textContent = 'Vielen Dank! Ihre Nachricht wurde gesendet.';
      formStatus.className = 'form-status success';
      contactForm.reset();
      setTimeout(() => { formStatus.textContent = ''; }, 5000);
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('visible');
    }, 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }
  
  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 400) {
              stickyCTA.classList.add('visible');
          } else {
              stickyCTA.classList.remove('visible');
          }
      });
  }

});