/* Maertens Fix v4 — eigene Property Cards */
(function(){
  'use strict';
  var REAL_EMAIL='maertens-immobilien@t-online.de';
  var WRONG_EMAILS=['paul@ainemix.com','vanessa@ainemix.com','test@example.com'];
  var MAERTENS_BASE='https://www.maertens-immobilien.com';
  var MAERTENS_LISTINGS = [{"title":"Hannover: Und am Ende der Straße steht ein Bungalow...","link":"/de/0__219_2_3_/hannover-und-am-ende-der-strasse-steht-ein-bungalow.html","image":"/de/upload/4745-219-7-g.jpg","status":"VERKAUFT","price":"399.000 €","location":"30539 Hannover · Bemerode","wohnflaeche":"102 m²","grundstueck":"327 m²","zimmer":"4"},{"title":"Wolfsburg: - RESERVIERT - Bungalow in Wolfsburg - Mörse#verkaufen wir","link":"/de/0__220_2_3_/wolfsburg-reserviert-bungalow-in-wolfsburg-moerseverkaufen-wir.html","image":"/de/upload/4762-220-5-g.jpg","status":"VERKAUFT","price":"299.000 €","location":"38442 Wolfsburg · Mörse","wohnflaeche":"125 m²","grundstueck":"713 m²","zimmer":"4"},{"title":"Weddel: - RESERVIERT - Ein- bis Zweifamilienwohnhaus mit tollem Garten#verkaufen wir","link":"/de/0__221_2_3_/weddel-reserviert-ein-bis-zweifamilienwohnhaus-mit-tollem-gartenverkaufen-wir.html","image":"/de/upload/4789-221-13-g.jpg","status":"VERKAUFT","price":"269.000 €","location":"38162 Weddel · Weddel","wohnflaeche":"145 m²","grundstueck":"1.250 m²","zimmer":"6"},{"title":"Gifhorn: Ein- / Zweifamilienhaus in GF - Gamsen","link":"/de/0__222_2_3_/gifhorn-ein-zweifamilienhaus-in-gf-gamsen.html","image":"/de/upload/4804-222-8-g.jpg","status":"VERKAUFT","price":"299.000 €","location":"38518 Gifhorn · Gamsen","wohnflaeche":"175 m²","grundstueck":"640 m²","zimmer":"7"},{"title":"Braunschweig: Ein Zuhause mit Geschichte - bereit für neue Ideen","link":"/de/0__227_2_3_/braunschweig-ein-zuhause-mit-geschichte-bereit-fuer-neue-ideen.html","image":"/de/upload/immobilie4875-ansicht-g.jpg","status":"#verkaufenwir","price":"350.000 €","location":"38124 Braunschweig · Leiferde","wohnflaeche":"162 m²","grundstueck":"603 m²","zimmer":"6"},{"title":"Und am Ende der Straße steht ein Bungalow...","link":"/de/0__219_2_3_/hannover-und-am-ende-der-strasse-steht-ein-bungalow.html","image":"/de/upload/4745-219-7-g.jpg","status":"VERKAUFT","price":"399.000 €","location":null,"wohnflaeche":"102 m²","grundstueck":"327 m²","zimmer":"4"},{"title":"- RESERVIERT - Bungalow in Wolfsburg - Mörse#verkaufen wir","link":"/de/0__220_2_3_/wolfsburg-reserviert-bungalow-in-wolfsburg-moerseverkaufen-wir.html","image":"/de/upload/4762-220-5-g.jpg","status":"VERKAUFT","price":"299.000 €","location":null,"wohnflaeche":"125 m²","grundstueck":"713 m²","zimmer":"4"},{"title":"- RESERVIERT - Ein- bis Zweifamilienwohnhaus mit tollem Garten#verkaufen wir","link":"/de/0__221_2_3_/weddel-reserviert-ein-bis-zweifamilienwohnhaus-mit-tollem-gartenverkaufen-wir.html","image":"/de/upload/4789-221-13-g.jpg","status":"VERKAUFT","price":"269.000 €","location":null,"wohnflaeche":"145 m²","grundstueck":"1.250 m²","zimmer":"6"},{"title":"Ein- / Zweifamilienhaus in GF - Gamsen","link":"/de/0__222_2_3_/gifhorn-ein-zweifamilienhaus-in-gf-gamsen.html","image":"/de/upload/4804-222-8-g.jpg","status":"VERKAUFT","price":"299.000 €","location":null,"wohnflaeche":"175 m²","grundstueck":"640 m²","zimmer":"7"},{"title":"Ein Zuhause mit Geschichte - bereit für neue Ideen","link":"/de/0__227_2_3_/braunschweig-ein-zuhause-mit-geschichte-bereit-fuer-neue-ideen.html","image":"/de/upload/immobilie4875-ansicht-g.jpg","status":"#verkaufenwir","price":"350.000 €","location":null,"wohnflaeche":"162 m²","grundstueck":"603 m²","zimmer":"6"}];

  function fixEmails(){
    var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);
    var node;
    while((node=walker.nextNode())){
      var v=node.nodeValue;
      WRONG_EMAILS.forEach(function(w){if(v.indexOf(w)!==-1)v=v.split(w).join(REAL_EMAIL);});
      if(v!==node.nodeValue)node.nodeValue=v;
    }
    document.querySelectorAll('a[href]').forEach(function(a){
      var h=a.getAttribute('href')||'';
      WRONG_EMAILS.forEach(function(w){if(h.indexOf(w)!==-1)a.setAttribute('href',h.split(w).join(REAL_EMAIL));});
    });
    document.querySelectorAll('input,textarea').forEach(function(el){
      ['value','placeholder'].forEach(function(attr){
        var v=el.getAttribute(attr)||'';
        WRONG_EMAILS.forEach(function(w){if(v.indexOf(w)!==-1)el.setAttribute(attr,v.split(w).join(REAL_EMAIL));});
      });
    });
  }

  function injectCookieBanner(){
    if(document.getElementById('ml-cookie-banner'))return;
    if(localStorage.getItem('ml-cookie-consent'))return;
    var b=document.createElement('div');
    b.id='ml-cookie-banner';
    b.innerHTML='<div class="ml-text">Diese Website nutzt nur technisch notwendige Cookies. '
      +'Wir verwenden keine Tracker. <a href="datenschutz/" rel="nofollow">Datenschutz</a>.</div>'
      +'<div class="ml-actions">'
      +'<button type="button" class="ml-secondary" data-ml-cookie="decline">Nur notwendige</button>'
      +'<button type="button" class="ml-primary" data-ml-cookie="accept">Einverstanden</button>'
      +'</div>';
    document.body.appendChild(b);
    requestAnimationFrame(function(){b.classList.add('show');});
    b.addEventListener('click',function(e){
      var t=e.target.closest('[data-ml-cookie]');
      if(!t)return;
      localStorage.setItem('ml-cookie-consent',t.dataset.mlCookie==='accept'?'accepted':'declined');
      b.classList.remove('show');
      setTimeout(function(){b.remove();},250);
    });
  }

  function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });}
  function renderCard(p){
    var img = p.image ? (p.image.indexOf('http')===0 ? p.image : MAERTENS_BASE + p.image) : '';
    var link = p.link ? (p.link.indexOf('http')===0 ? p.link : MAERTENS_BASE + p.link) : '#';
    var badgeCls = (p.status||'').toLowerCase().indexOf('verkauft')>-1 ? 'verkauft'
                 : (p.status||'').toLowerCase().indexOf('reserv')>-1 ? 'reserviert' : '';
    var meta = [];
    if (p.wohnflaeche) meta.push('<span><strong>'+escapeHtml(p.wohnflaeche)+'</strong> Wohnfläche</span>');
    if (p.grundstueck) meta.push('<span><strong>'+escapeHtml(p.grundstueck)+'</strong> Grundstück</span>');
    if (p.zimmer)      meta.push('<span><strong>'+escapeHtml(p.zimmer)+'</strong> Zimmer</span>');
    return '<a href="'+escapeHtml(link)+'" target="_blank" rel="noopener" class="ml-card">'
      + '<div class="ml-card-img">'
      +   (img ? '<img loading="lazy" src="'+escapeHtml(img)+'" alt="'+escapeHtml(p.title||'')+'">' : '')
      +   (p.status ? '<span class="ml-card-badge '+badgeCls+'">'+escapeHtml(p.status)+'</span>' : '')
      + '</div>'
      + '<div class="ml-card-body">'
      +   '<div class="ml-card-title">'+escapeHtml(p.title||'Objekt')+'</div>'
      +   (p.location ? '<div class="ml-card-loc">📍 '+escapeHtml(p.location)+'</div>' : '')
      +   (meta.length ? '<div class="ml-card-meta">'+meta.join('')+'</div>' : '')
      +   (p.price ? '<div class="ml-card-price">'+escapeHtml(p.price)+'</div>' : '')
      +   '<div class="ml-card-cta">Details ansehen</div>'
      + '</div>'
      + '</a>';
  }
  function buildImmoSection(){
    var s=document.createElement('section');
    s.id='ml-immo-embed';
    s.className='ml-reveal';
    var cards = MAERTENS_LISTINGS && MAERTENS_LISTINGS.length
      ? '<div id="ml-immo-grid">' + MAERTENS_LISTINGS.map(renderCard).join('') + '</div>'
      : '<div class="ml-immo-empty">Aktuell keine Objekte verfügbar. Sprechen Sie uns gerne an.</div>';
    s.innerHTML='<h2>Aktuelle Objekte</h2>'
      +'<p class="ml-sub">Direkt aus unserem Bestand &mdash; immer aktuell</p>'
      + cards;
    return s;
  }

  function injectImmoEmbed(){
    if(document.getElementById('ml-immo-embed'))return;
    var path=location.pathname;
    var isHome=/(?:^|\/)index\.html?$/.test(path)||/\/maertens-immobilien-gmbh\/?$/.test(path)||/\/$/.test(path);
    var isImmoPage=/\/immobilien\/?/.test(path);

    if(isImmoPage){
      var sections=document.querySelectorAll('main section, main > div, section');
      var replaced=false;
      sections.forEach(function(sec){
        if(replaced)return;
        var txt=(sec.textContent||'').toLowerCase();
        if(/vorbereitung|in k(ü|u)rze|coming soon|demn(ä|a)chst|aktuell.*objekt/i.test(txt) && txt.length<800){
          var wrap=buildImmoSection();
          sec.parentNode.replaceChild(wrap,sec);
          replaced=true;
        }
      });
      if(!replaced){
        var main=document.querySelector('main')||document.body;
        var hero=main.querySelector('.hero,[class*="hero"],header + section');
        var wrap=buildImmoSection();
        if(hero&&hero.nextSibling)main.insertBefore(wrap,hero.nextSibling);
        else main.appendChild(wrap);
      }
      return;
    }
    if(!isHome)return;
    var anchor=document.getElementById('immobilien')
      ||document.querySelector('#objekte, section.immobilien, section.objekte, [data-section="immobilien"]');
    if(!anchor){var foot=document.querySelector('footer');if(!foot)return;anchor=foot;}
    var wrap=buildImmoSection();
    if(anchor===document.querySelector('footer'))anchor.parentNode.insertBefore(wrap,anchor);
    else anchor.parentNode.insertBefore(wrap,anchor.nextSibling);
  }

  function findTestimonialBlocks(){
    var hits=new Set();
    document.querySelectorAll(
      '.testimonials,#testimonials,[data-testimonials],.swiper,.swiper-container,.reviews,.kundenstimmen,.bewertungen'
    ).forEach(function(b){hits.add(b);});
    document.querySelectorAll('section,div').forEach(function(sec){
      if(hits.has(sec))return;
      for(var p of hits){if(p.contains(sec)||sec.contains(p))return;}
      var h=sec.querySelector('h1,h2,h3,h4');
      if(!h)return;
      var txt=(h.textContent||'').toLowerCase();
      if(/kundenstimme|bewertung|erfahrung|referen|so urteilen|das sagen/i.test(txt)){
        var slides=sec.querySelectorAll('blockquote,article,.testimonial,[class*="review"],figure');
        if(slides.length>=2)hits.add(sec);
      }
    });
    return Array.from(hits);
  }
  function buildCarousel(block){
    if(block.classList.contains('ml-tslider-bound'))return;
    var slides=Array.from(block.querySelectorAll(
      '.swiper-slide,.testimonial,blockquote,article,figure,.ml-tslider-slide,[class*="review"]'
    )).filter(function(s){return s.textContent.trim().length>20;});
    if(slides.length<2)return;
    var unique=[];
    slides.forEach(function(s){for(var u of unique)if(u.contains(s)||s.contains(u))return;unique.push(s);});
    slides=unique;
    if(slides.length<2)return;
    block.classList.add('ml-tslider','ml-tslider-bound');
    var heading=block.querySelector('h1,h2,h3,h4');
    var track=document.createElement('div');track.className='ml-tslider-track';
    slides.forEach(function(s){s.classList.add('ml-tslider-slide');track.appendChild(s);});
    block.innerHTML='';
    if(heading)block.appendChild(heading);
    block.appendChild(track);
    var nav=document.createElement('div');nav.className='ml-tslider-nav';
    for(var i=0;i<slides.length;i++){
      (function(idx){
        var dot=document.createElement('button');
        dot.type='button';
        dot.className='ml-tslider-dot'+(idx===0?' active':'');
        dot.setAttribute('aria-label','Slide '+(idx+1));
        dot.addEventListener('click',function(){
          track.style.transform='translateX(-'+(idx*100)+'%)';
          nav.querySelectorAll('.ml-tslider-dot').forEach(function(d,di){d.classList.toggle('active',di===idx);});
        });
        nav.appendChild(dot);
      })(i);
    }
    block.appendChild(nav);
    var cur=0;
    setInterval(function(){cur=(cur+1)%slides.length;var d=nav.querySelectorAll('.ml-tslider-dot')[cur];if(d)d.click();},5500);
  }
  function fixTestimonials(){findTestimonialBlocks().forEach(buildCarousel);}

  function setupReveal(){
    if(!('IntersectionObserver' in window))return;
    document.querySelectorAll('section,article,.card,[class*="card"],.stat,.feature').forEach(function(el){
      if(!el.classList.contains('ml-reveal'))el.classList.add('ml-reveal');
    });
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}});
    },{threshold:.1,rootMargin:'0px 0px -50px 0px'});
    document.querySelectorAll('.ml-reveal').forEach(function(el){io.observe(el);});
  }
  function setupCounters(){
    if(!('IntersectionObserver' in window))return;
    document.querySelectorAll('h2,h3,h4,strong,.stat,.stat-number,[class*="number"],[class*="counter"]').forEach(function(el){
      var txt=(el.textContent||'').trim();
      var m=txt.match(/^(\d+)([+%]?)$/);
      if(!m)return;
      var target=parseInt(m[1],10);
      if(target<5||target>100000)return;
      var suffix=m[2]||'';
      el.dataset.mlCount=target;el.dataset.mlSuffix=suffix;el.textContent='0'+suffix;
    });
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting)return;
        var el=e.target;var target=parseInt(el.dataset.mlCount,10);
        var suffix=el.dataset.mlSuffix||'';var dur=1400,start=performance.now();
        function step(now){var p=Math.min(1,(now-start)/dur);var eased=1-Math.pow(1-p,3);
          el.textContent=Math.round(target*eased)+suffix;if(p<1)requestAnimationFrame(step);}
        requestAnimationFrame(step);io.unobserve(el);
      });
    },{threshold:.6});
    document.querySelectorAll('[data-ml-count]').forEach(function(el){io.observe(el);});
  }
  function setupSmoothScroll(){
    document.addEventListener('click',function(e){
      var a=e.target.closest('a[href^="#"]');
      if(!a)return;
      var href=a.getAttribute('href');
      if(href.length<2)return;
      var t=document.querySelector(href);
      if(!t)return;
      e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
  function fixBrokenImages(){
    document.querySelectorAll('img').forEach(function(img){
      img.addEventListener('error',function(){img.classList.add('ml-broken');});
      if(!img.getAttribute('src')||img.getAttribute('src').trim()==='')img.classList.add('ml-broken');
    });
  }
  function init(){
    try{fixEmails();}catch(e){}
    try{injectCookieBanner();}catch(e){}
    try{injectImmoEmbed();}catch(e){}
    try{fixTestimonials();}catch(e){}
    try{setupReveal();}catch(e){}
    try{setupCounters();}catch(e){}
    try{setupSmoothScroll();}catch(e){}
    try{fixBrokenImages();}catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
