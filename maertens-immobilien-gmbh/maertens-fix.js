/* Maertens Fix v2 */
(function () {
  'use strict';

  var REAL_EMAIL = 'maertens-immobilien@t-online.de';
  var WRONG_EMAILS = ['paul@ainemix.com','vanessa@ainemix.com','test@example.com'];

  // ─── Email Replace ───────────────────────────────────────
  function fixEmails() {
    // Text nodes
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var v = node.nodeValue;
      WRONG_EMAILS.forEach(function (w) {
        if (v.indexOf(w) !== -1) v = v.split(w).join(REAL_EMAIL);
      });
      if (v !== node.nodeValue) node.nodeValue = v;
    }
    // Hrefs
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href') || '';
      WRONG_EMAILS.forEach(function (w) {
        if (h.indexOf(w) !== -1) a.setAttribute('href', h.split(w).join(REAL_EMAIL));
      });
    });
    // Inputs (value, placeholder)
    document.querySelectorAll('input,textarea').forEach(function (el) {
      ['value','placeholder'].forEach(function (attr) {
        var v = el.getAttribute(attr) || '';
        WRONG_EMAILS.forEach(function (w) {
          if (v.indexOf(w) !== -1) el.setAttribute(attr, v.split(w).join(REAL_EMAIL));
        });
      });
    });
  }

  // ─── Cookie Banner ───────────────────────────────────────
  function injectCookieBanner() {
    if (document.getElementById('ml-cookie-banner')) return;
    if (localStorage.getItem('ml-cookie-consent')) return;
    var b = document.createElement('div');
    b.id = 'ml-cookie-banner';
    b.innerHTML = '<div class="ml-text">Diese Website nutzt nur technisch notwendige Cookies. '
      + 'Wir verwenden keine Tracker. <a href="datenschutz/" rel="nofollow">Datenschutz</a>.</div>'
      + '<div class="ml-actions">'
      + '<button type="button" class="ml-secondary" data-ml-cookie="decline">Nur notwendige</button>'
      + '<button type="button" class="ml-primary" data-ml-cookie="accept">Einverstanden</button>'
      + '</div>';
    document.body.appendChild(b);
    requestAnimationFrame(function () { b.classList.add('show'); });
    b.addEventListener('click', function (e) {
      var t = e.target.closest('[data-ml-cookie]');
      if (!t) return;
      localStorage.setItem('ml-cookie-consent', t.dataset.mlCookie === 'accept' ? 'accepted' : 'declined');
      b.classList.remove('show');
      setTimeout(function(){ b.remove(); }, 250);
    });
  }

  // ─── Immo Embed (only home) ──────────────────────────────
  function injectImmoEmbed() {
    var isHome = /(?:^|\/)index\.html?$/.test(location.pathname) || /\/$/.test(location.pathname);
    if (!isHome) return;
    if (document.getElementById('ml-immo-embed')) return;
    var anchor = document.getElementById('immobilien')
      || document.querySelector('#objekte, section.immobilien, section.objekte, [data-section="immobilien"]');
    if (!anchor) {
      var foot = document.querySelector('footer');
      if (!foot) return;
      anchor = foot;
    }
    var wrap = document.createElement('section');
    wrap.id = 'ml-immo-embed';
    wrap.className = 'ml-reveal';
    wrap.innerHTML = '<h2>Aktuelle Objekte</h2>'
      + '<p class="ml-sub">Live aus unserem Bestand &mdash; direkt von maertens-immobilien.com</p>'
      + '<iframe src="https://www.maertens-immobilien.com/de/0__2_1_0__/immobilien-haeuser.html" '
      + 'loading="lazy" referrerpolicy="no-referrer" title="Aktuelle Immobilien Maertens"></iframe>';
    if (anchor === document.querySelector('footer')) anchor.parentNode.insertBefore(wrap, anchor);
    else anchor.parentNode.insertBefore(wrap, anchor.nextSibling);
  }

  // ─── Testimonials carousel ────────────────────────────────
  function findTestimonialBlocks() {
    var hits = new Set();
    // 1) Standard classes
    document.querySelectorAll(
      '.testimonials,#testimonials,[data-testimonials],.swiper,.swiper-container,.reviews,.kundenstimmen,.bewertungen'
    ).forEach(function (b) { hits.add(b); });
    // 2) Sections containing testimonial-keywords
    document.querySelectorAll('section,div').forEach(function (sec) {
      if (hits.has(sec)) return;
      // skip if already inside hit
      for (var p of hits) { if (p.contains(sec) || sec.contains(p)) return; }
      var h = sec.querySelector('h1,h2,h3,h4');
      if (!h) return;
      var txt = (h.textContent || '').toLowerCase();
      if (/kundenstimme|bewertung|erfahrung|referen|so urteilen|das sagen/i.test(txt)) {
        // must have at least 2 blockquote/article/.testimonial children
        var slides = sec.querySelectorAll('blockquote, article, .testimonial, [class*="review"], figure');
        if (slides.length >= 2) hits.add(sec);
      }
    });
    return Array.from(hits);
  }
  function buildCarousel(block) {
    if (block.classList.contains('ml-tslider-bound')) return;
    var slides = Array.from(block.querySelectorAll(
      '.swiper-slide,.testimonial,blockquote,article,figure,.ml-tslider-slide,[class*="review"]'
    )).filter(function(s){ return s.textContent.trim().length > 20; });
    if (slides.length < 2) return;
    // dedupe nested
    var unique = [];
    slides.forEach(function (s) {
      for (var u of unique) if (u.contains(s) || s.contains(u)) return;
      unique.push(s);
    });
    slides = unique;
    if (slides.length < 2) return;
    block.classList.add('ml-tslider','ml-tslider-bound');
    // preserve heading
    var heading = block.querySelector('h1,h2,h3,h4');
    var track = document.createElement('div');
    track.className = 'ml-tslider-track';
    slides.forEach(function (s) { s.classList.add('ml-tslider-slide'); track.appendChild(s); });
    block.innerHTML = '';
    if (heading) block.appendChild(heading);
    block.appendChild(track);
    var nav = document.createElement('div'); nav.className = 'ml-tslider-nav';
    for (var i = 0; i < slides.length; i++) {
      (function (idx) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'ml-tslider-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label','Slide ' + (idx+1));
        dot.addEventListener('click', function () {
          track.style.transform = 'translateX(-' + (idx * 100) + '%)';
          nav.querySelectorAll('.ml-tslider-dot').forEach(function (d, di) {
            d.classList.toggle('active', di === idx);
          });
        });
        nav.appendChild(dot);
      })(i);
    }
    block.appendChild(nav);
    var cur = 0;
    setInterval(function () {
      cur = (cur + 1) % slides.length;
      var d = nav.querySelectorAll('.ml-tslider-dot')[cur];
      if (d) d.click();
    }, 5500);
  }
  function fixTestimonials() {
    findTestimonialBlocks().forEach(buildCarousel);
  }

  // ─── Wow: Scroll reveal ───────────────────────────────────
  function setupReveal() {
    if (!('IntersectionObserver' in window)) return;
    // Auto-add reveal class to common sections
    document.querySelectorAll('section, article, .card, [class*="card"], .stat, .feature').forEach(function (el) {
      if (!el.classList.contains('ml-reveal')) el.classList.add('ml-reveal');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.ml-reveal').forEach(function (el) { io.observe(el); });
  }

  // ─── Wow: Animated counters ──────────────────────────────
  function setupCounters() {
    if (!('IntersectionObserver' in window)) return;
    document.querySelectorAll('h2,h3,h4,strong,.stat,.stat-number,[class*="number"],[class*="counter"]').forEach(function (el) {
      var txt = (el.textContent || '').trim();
      var m = txt.match(/^(\d+)([+%]?)$/);
      if (!m) return;
      var target = parseInt(m[1], 10);
      if (target < 5 || target > 100000) return; // skip unreasonable
      var suffix = m[2] || '';
      el.dataset.mlCount = target;
      el.dataset.mlSuffix = suffix;
      el.textContent = '0' + suffix;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.dataset.mlCount, 10);
        var suffix = el.dataset.mlSuffix || '';
        var dur = 1400, start = performance.now();
        function step(now) {
          var p = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-ml-count]').forEach(function (el) { io.observe(el); });
  }

  // ─── Wow: Smooth scroll for anchors ──────────────────────
  function setupSmoothScroll() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (href.length < 2) return;
      var t = document.querySelector(href);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ─── Image fallback ──────────────────────────────────────
  function fixBrokenImages() {
    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () { img.classList.add('ml-broken'); });
      if (!img.getAttribute('src') || img.getAttribute('src').trim() === '') img.classList.add('ml-broken');
    });
  }

  function init() {
    try { fixEmails(); } catch (e) {}
    try { injectCookieBanner(); } catch (e) {}
    try { injectImmoEmbed(); } catch (e) {}
    try { fixTestimonials(); } catch (e) {}
    try { setupReveal(); } catch (e) {}
    try { setupCounters(); } catch (e) {}
    try { setupSmoothScroll(); } catch (e) {}
    try { fixBrokenImages(); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
