/* Maertens Fix v1 */
(function () {
  'use strict';
  function injectCookieBanner() {
    if (document.getElementById('ml-cookie-banner')) return;
    if (localStorage.getItem('ml-cookie-consent')) return;
    var b = document.createElement('div');
    b.id = 'ml-cookie-banner';
    b.innerHTML = '<div class="ml-text">Diese Website nutzt nur technisch notwendige Cookies. '
      + 'Wir verwenden keine Tracker und keine Marketing-Cookies. '
      + '<a href="datenschutz/" rel="nofollow">Mehr zum Datenschutz</a>.</div>'
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
  function injectImmoEmbed() {
    var isHome = /(?:^|\/)index\.html?$/.test(location.pathname) || /\/$/.test(location.pathname);
    if (!isHome) return;
    if (document.getElementById('ml-immo-embed')) return;
    var anchor = document.getElementById('immobilien')
      || document.querySelector('#objekte, section.immobilien, section.objekte');
    if (!anchor) {
      var foot = document.querySelector('footer');
      if (!foot) return;
      anchor = foot;
    }
    var wrap = document.createElement('section');
    wrap.id = 'ml-immo-embed';
    wrap.innerHTML = '<h2>Aktuelle Objekte</h2>'
      + '<p class="ml-sub">Live aus unserem Bestand &mdash; direkt von maertens-immobilien.com</p>'
      + '<iframe src="https://www.maertens-immobilien.com/de/0__2_1_0__/immobilien-haeuser.html" '
      + 'loading="lazy" referrerpolicy="no-referrer" title="Aktuelle Immobilien Maertens"></iframe>';
    if (anchor === document.querySelector('footer')) anchor.parentNode.insertBefore(wrap, anchor);
    else anchor.parentNode.insertBefore(wrap, anchor.nextSibling);
  }
  function fixTestimonials() {
    if (window.Swiper) return;
    var blocks = document.querySelectorAll('.testimonials, #testimonials, [data-testimonials], .swiper, .swiper-container');
    blocks.forEach(function (block) {
      var slides = block.querySelectorAll('.swiper-slide, .testimonial, blockquote, .ml-tslider-slide, article');
      if (slides.length < 2) return;
      if (block.classList.contains('ml-tslider-bound')) return;
      block.classList.add('ml-tslider', 'ml-tslider-bound');
      var track = document.createElement('div');
      track.className = 'ml-tslider-track';
      slides.forEach(function (s) { s.classList.add('ml-tslider-slide'); track.appendChild(s); });
      block.innerHTML = ''; block.appendChild(track);
      var nav = document.createElement('div'); nav.className = 'ml-tslider-nav';
      for (var i = 0; i < slides.length; i++) {
        (function (idx) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'ml-tslider-dot' + (idx === 0 ? ' active' : '');
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
        nav.querySelectorAll('.ml-tslider-dot')[cur].click();
      }, 5500);
    });
  }
  function fixBrokenImages() {
    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () { img.classList.add('ml-broken'); });
      if (!img.getAttribute('src') || img.getAttribute('src').trim() === '') img.classList.add('ml-broken');
    });
  }
  function init() {
    try { injectCookieBanner(); } catch (e) {}
    try { injectImmoEmbed(); } catch (e) {}
    try { fixTestimonials(); } catch (e) {}
    try { fixBrokenImages(); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
