/* AiNemix Design Boost v5 - real 3D, generic, self-contained */
(function(){
  'use strict';
  var CFG = {"email":"paul@ainemix.com","wrongEmails":["paul@ainemix.com","vanessa@ainemix.com","noreply@ainemix.com","test@example.com"],"isRealEstate":true,"listings":[{"title":"RESERVIERT: Wohnerlebnis in Bielefeld-Quelle: 3,5 Zimmer mit Balkon","link":"https://www.maertens-immobilien.com/de/0__225_1_3_/bielefeld-reserviert-wohnerlebnis-in-bielefeld-quelle-35-zimmer-mit-balkon.html","image":"https://www.maertens-immobilien.com/de/upload/4829-225-5-g.jpg","status":"RESERVIERT","price":"220.000 €","wohnflaeche":"88 m²","grundstueck":null,"zimmer":"3,5","location":null},{"title":"Und am Ende der Straße steht ein Bungalow...","link":"https://www.maertens-immobilien.com/de/0__219_2_3_/hannover-und-am-ende-der-strasse-steht-ein-bungalow.html","image":"https://www.maertens-immobilien.com/de/upload/4745-219-7-g.jpg","status":"VERKAUFT","price":"399.000 €","wohnflaeche":"102 m²","grundstueck":"327 m²","zimmer":"4","location":null},{"title":"- RESERVIERT - Bungalow in Wolfsburg - Mörse#verkaufen wir","link":"https://www.maertens-immobilien.com/de/0__220_2_3_/wolfsburg-reserviert-bungalow-in-wolfsburg-moerseverkaufen-wir.html","image":"https://www.maertens-immobilien.com/de/upload/4762-220-5-g.jpg","status":"VERKAUFT","price":"299.000 €","wohnflaeche":"125 m²","grundstueck":"713 m²","zimmer":"4","location":null},{"title":"Ein Zuhause mit Geschichte - bereit für neue Ideen","link":"https://www.maertens-immobilien.com/de/0__227_2_3_/braunschweig-ein-zuhause-mit-geschichte-bereit-fuer-neue-ideen.html","image":"https://www.maertens-immobilien.com/de/upload/immobilie4875-ansicht-g.jpg","status":"#verkaufenwir","price":"350.000 €","wohnflaeche":"162 m²","grundstueck":"603 m²","zimmer":"6","location":null},{"title":"Ein- / Zweifamilienhaus in GF - Gamsen","link":"https://www.maertens-immobilien.com/de/0__222_2_3_/gifhorn-ein-zweifamilienhaus-in-gf-gamsen.html","image":"https://www.maertens-immobilien.com/de/upload/4804-222-8-g.jpg","status":"VERKAUFT","price":"299.000 €","wohnflaeche":"175 m²","grundstueck":"640 m²","zimmer":"7","location":null},{"title":"3-Zimmer-Wohnung in zentraler Citylage.","link":"https://www.maertens-immobilien.com/de/0__224_1_3_/braunschweig-3-zimmer-wohnung-in-zentraler-citylage.html","image":"https://www.maertens-immobilien.com/de/upload/4822-224-1-g.jpg","status":"#verkaufenwir","price":"175.000 €","wohnflaeche":"62 m²","grundstueck":null,"zimmer":"3","location":null}],"phone":"+49 170 5224355","company":"Maertens Immobilien GmbH"};
  var doc = document;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function parseRgb(str){
    if(!str) return null; str = String(str).trim();
    var m = str.match(/^#([0-9a-f]{3,8})$/i);
    if(m){ var h=m[1]; if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
      return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)]; }
    m = str.match(/rgba?\(([^)]+)\)/i);
    if(m){ var p=m[1].split(',').map(function(x){return parseFloat(x);});
      if(p.length>=3) return [p[0]|0,p[1]|0,p[2]|0]; }
    return null;
  }
  function luma(r){ return 0.2126*r[0]+0.7152*r[1]+0.0722*r[2]; }
  function detectTheme(){
    var cs = getComputedStyle(doc.documentElement);
    var vars=['--primary','--color-primary','--accent','--color-accent','--brand',
      '--brand-primary','--accent-1','--theme-color','--c-primary'];
    var rgb=null;
    for(var i=0;i<vars.length;i++){
      var r=parseRgb(cs.getPropertyValue(vars[i]));
      if(r && luma(r)<232 && (r[0]+r[1]+r[2])>14){ rgb=r; break; }
    }
    if(!rgb){
      var el=doc.querySelector('.btn-primary,.cta,.button-primary,[class*="btn-primary"]');
      if(el){ var r2=parseRgb(getComputedStyle(el).backgroundColor); if(r2 && luma(r2)<232) rgb=r2; }
    }
    if(!rgb) rgb=[59,108,255];
    var rs=doc.documentElement.style;
    rs.setProperty('--ml-accent','rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')');
    rs.setProperty('--ml-accent-rgb',rgb[0]+','+rgb[1]+','+rgb[2]);
    return rgb;
  }

  function fixEmails(){
    if(!CFG.email) return;
    var wrong=CFG.wrongEmails||[]; if(!wrong.length) return;
    var w=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT,null),n;
    while((n=w.nextNode())){
      var v=n.nodeValue;
      for(var i=0;i<wrong.length;i++){ if(v.indexOf(wrong[i])>-1) v=v.split(wrong[i]).join(CFG.email); }
      if(v!==n.nodeValue) n.nodeValue=v;
    }
    doc.querySelectorAll('a[href]').forEach(function(a){
      var h=a.getAttribute('href')||'';
      for(var i=0;i<wrong.length;i++){ if(h.indexOf(wrong[i])>-1) a.setAttribute('href',h.split(wrong[i]).join(CFG.email)); }
    });
    doc.querySelectorAll('input,textarea').forEach(function(el){
      ['value','placeholder'].forEach(function(at){
        var v=el.getAttribute(at)||'';
        for(var i=0;i<wrong.length;i++){ if(v.indexOf(wrong[i])>-1) el.setAttribute(at,v.split(wrong[i]).join(CFG.email)); }
      });
    });
  }

  var _hero=null;
  function heroEl(){
    if(_hero) return _hero;
    _hero=doc.querySelector('.hero,[class*="hero"],header+section,main>section:first-child');
    return _hero;
  }
  function heroContent(){
    var h=heroEl(); if(!h) return null;
    var c=h.querySelector('.container,[class*="hero-content"],[class*="hero__content"],[class*="hero__inner"],[class*="hero-inner"]');
    if(c) return c;
    var real=[];
    for(var i=0;i<h.children.length;i++){
      var ch=h.children[i];
      if(/ml-(aurora|hero-canvas|hero-scrim|spotlight|cube-wrap)/.test(ch.className||'')) continue;
      if(ch.tagName==='IMG') continue;
      real.push(ch);
    }
    return real.length===1 ? real[0] : null;
  }
  function siteDepth(){
    var s=doc.querySelector('script[src*="ainemix-boost.js"]');
    var src=s?(s.getAttribute('src')||''):'';
    var m=src.match(/^(\.\.\/)+/);
    return m?m[0].length/3:0;
  }

  function enhanceHeroReadability(){
    var h=heroEl(); if(!h) return;
    if(getComputedStyle(h).position==='static') h.style.position='relative';
    h.classList.add('ml-hero-host');
    var cs=getComputedStyle(h);
    var hasBg=cs.backgroundImage && cs.backgroundImage!=='none' && cs.backgroundImage.indexOf('url')>-1;
    var bigImg=null;
    h.querySelectorAll('img').forEach(function(im){
      var r=im.getBoundingClientRect();
      if(r.width>h.clientWidth*0.55 && r.height>h.clientHeight*0.45) bigImg=im;
    });
    if(!hasBg && !bigImg) return;
    if(bigImg){
      if(getComputedStyle(bigImg).position==='static') bigImg.style.position='relative';
      bigImg.style.zIndex='0';
    }
    if(!h.querySelector('.ml-hero-scrim')){
      var sc=doc.createElement('div'); sc.className='ml-hero-scrim';
      h.insertBefore(sc,h.firstChild);
    }
    h.classList.add('ml-hero-photo');
  }

  function injectAurora(){
    var h=heroEl(); if(!h) return;
    h.classList.add('ml-hero-host');
    if(!h.querySelector('.ml-aurora')){
      var a=doc.createElement('div'); a.className='ml-aurora';
      a.innerHTML='<i></i><i></i><i></i>';
      h.insertBefore(a,h.firstChild);
    }
  }

  function injectCube(){
    if(reduce) return;
    var h=heroEl(); if(!h) return;
    if(h.querySelector('.ml-cube-wrap')) return;
    if(h.clientWidth < 880) return;
    var wrap=doc.createElement('div'); wrap.className='ml-cube-wrap';
    wrap.innerHTML='<div class="ml-cube"><i></i><i></i><i></i><i></i><i></i><i></i></div>';
    h.insertBefore(wrap,h.firstChild);
  }

  function initSpotlight(){
    if(reduce) return;
    var h=heroEl(); if(!h) return;
    if(h.querySelector('.ml-spotlight')) return;
    var sp=doc.createElement('div'); sp.className='ml-spotlight';
    h.insertBefore(sp,h.firstChild);
    var raf;
    h.addEventListener('mousemove',function(e){
      var r=h.getBoundingClientRect();
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){
        sp.style.setProperty('--sx',(e.clientX-r.left)+'px');
        sp.style.setProperty('--sy',(e.clientY-r.top)+'px');
        sp.style.opacity='1';
      });
    });
    h.addEventListener('mouseleave',function(){ sp.style.opacity='0'; });
  }

  /* hero is a 3D stage: content plane tilts with the cursor */
  function init3DHero(){
    if(reduce) return;
    var h=heroEl(); if(!h) return;
    var c=heroContent(); if(!c) return;
    h.style.perspective='1300px';
    c.classList.add('ml-3d-stage');
    var wrap=h.querySelector('.ml-cube-wrap');
    var raf;
    h.addEventListener('mousemove',function(e){
      var r=h.getBoundingClientRect();
      var px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){
        c.style.transform='rotateY('+(px*6).toFixed(2)+'deg) rotateX('+(-py*4).toFixed(2)+'deg)';
        if(wrap) wrap.style.transform='translate3d('+(-px*40).toFixed(1)+'px,'+(-py*30).toFixed(1)+'px,0)';
      });
    });
    h.addEventListener('mouseleave',function(){
      cancelAnimationFrame(raf);
      c.style.transform='';
      if(wrap) wrap.style.transform='';
    });
  }

  function cinematicHeroEntrance(){
    if(reduce) return;
    var h=heroEl(); if(!h) return;
    var scope=heroContent()||h;
    var kids=scope.querySelectorAll('h1,h2,p,a.btn,a[class*="btn"],.btn,[class*="eyebrow"],[class*="kicker"],[class*="badge"],ul');
    var c=0;
    kids.forEach(function(el){
      if(el.closest('#ml-immo')||el.classList.contains('ml-hi')) return;
      if(c>=6) return;
      el.classList.add('ml-hi','ml-hi'+(c+1)); c++;
    });
  }

  function heroIsDark(){
    var h=heroEl(); if(!h) return false;
    var t=h.querySelector('h1,h2,.subline,p');
    if(t){ var c=parseRgb(getComputedStyle(t).color); if(c) return luma(c)>135; }
    var bg=parseRgb(getComputedStyle(h).backgroundColor);
    if(bg && (bg[0]+bg[1]+bg[2])>0) return luma(bg)<120;
    return false;
  }
  function gradientHeadline(dark){
    if(!dark) return;
    var h=heroEl(); if(!h) return;
    var h1=h.querySelector('h1'); if(!h1) return;
    h1.classList.add('ml-grad-head');
  }

  function markElements(){
    var h=heroEl();
    doc.querySelectorAll('article,.card,[class*="card"],[class*="feature"],[class*="service"],[class*="tile"]').forEach(function(el){
      if(el.closest('#ml-immo')) return;
      el.classList.add('ml-lift');
      if(!reduce) el.classList.add('ml-tilt');
    });
    doc.querySelectorAll('section,[class*="section"]').forEach(function(sec){
      if(sec.closest('#ml-immo')) return;
      if(h && (sec===h || h.contains(sec) || sec.contains(h))) return;
      var t=sec.querySelectorAll('h1,h2,h3,p,article,.card,[class*="card"],img,.btn,a[class*="btn"],ul,form,blockquote');
      var c=0;
      t.forEach(function(el){
        if(el.closest('#ml-immo')||el.classList.contains('ml-reveal')||el.classList.contains('ml-hi')) return;
        el.classList.add('ml-reveal');
        c++; if(c<=4) el.classList.add('ml-d'+c);
      });
    });
    if(!reduce) doc.querySelectorAll('.btn,[class*="btn"],button,.cta').forEach(function(b){
      if(b.closest('#ml-cookie')) return;
      b.classList.add('ml-mag');
    });
  }

  function initReveal(){
    if(reduce || !('IntersectionObserver' in window)){
      doc.querySelectorAll('.ml-reveal').forEach(function(e){e.classList.add('is-visible');});
      return;
    }
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target);} });
    },{threshold:.1,rootMargin:'0px 0px -7% 0px'});
    doc.querySelectorAll('.ml-reveal').forEach(function(e){io.observe(e);});
  }

  function initTilt(){
    if(reduce) return;
    doc.querySelectorAll('.ml-tilt').forEach(function(card){
      var raf;
      card.addEventListener('mousemove',function(ev){
        var r=card.getBoundingClientRect();
        var px=(ev.clientX-r.left)/r.width-.5, py=(ev.clientY-r.top)/r.height-.5;
        cancelAnimationFrame(raf);
        raf=requestAnimationFrame(function(){
          card.style.transform='perspective(800px) rotateX('+(-py*11)+'deg) rotateY('+(px*11)+'deg) translateY(-10px) scale(1.03)';
          card.style.setProperty('--gx',((px+.5)*100)+'%');
          card.style.setProperty('--gy',((py+.5)*100)+'%');
        });
      });
      card.addEventListener('mouseleave',function(){ cancelAnimationFrame(raf); card.style.transform=''; });
    });
  }

  function initMagnetic(){
    if(reduce) return;
    doc.querySelectorAll('.ml-mag').forEach(function(b){
      b.addEventListener('mousemove',function(ev){
        var r=b.getBoundingClientRect();
        b.style.transform='translate('+((ev.clientX-r.left-r.width/2)*.2)+'px,'+((ev.clientY-r.top-r.height/2)*.24)+'px)';
      });
      b.addEventListener('mouseleave',function(){ b.style.transform=''; });
    });
  }

  function initCounters(){
    if(!('IntersectionObserver' in window)) return;
    var els=[];
    doc.querySelectorAll('h2,h3,h4,strong,b,span,[class*="stat"],[class*="number"],[class*="count"]').forEach(function(el){
      if(el.children.length) return;
      var m=(el.textContent||'').trim().match(/^(\d{1,6})\s*([+%]?)$/);
      if(!m) return;
      var tgt=parseInt(m[1],10);
      if(tgt<5||tgt>1000000) return;
      el.setAttribute('data-ml-to',tgt); el.setAttribute('data-ml-sfx',m[2]||'');
      el.textContent='0'+(m[2]||'');
      els.push(el);
    });
    if(!els.length) return;
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var el=e.target, to=+el.getAttribute('data-ml-to'), sfx=el.getAttribute('data-ml-sfx')||'';
        if(reduce){ el.textContent=to+sfx; io.unobserve(el); return; }
        var t0=performance.now();
        function step(now){
          var p=Math.min(1,(now-t0)/1600);
          el.textContent=Math.round(to*(1-Math.pow(1-p,3)))+sfx;
          if(p<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step); io.unobserve(el);
      });
    },{threshold:.6});
    els.forEach(function(el){io.observe(el);});
  }

  function initSmoothScroll(){
    doc.addEventListener('click',function(e){
      var a=e.target.closest('a[href^="#"]');
      if(!a) return;
      var id=a.getAttribute('href');
      if(id.length<2) return;
      var t=doc.querySelector(id);
      if(!t) return;
      e.preventDefault();
      t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
    });
  }

  function initProgressBar(){
    if(doc.querySelector('.ml-progress')) return;
    var bar=doc.createElement('div'); bar.className='ml-progress';
    doc.body.appendChild(bar);
    var ticking=false;
    function upd(){
      if(ticking) return; ticking=true;
      requestAnimationFrame(function(){
        var de=doc.documentElement;
        var st=de.scrollTop||doc.body.scrollTop||0;
        var sh=(de.scrollHeight||0)-(de.clientHeight||0);
        bar.style.width=(sh>0?Math.min(100,st/sh*100):0)+'%';
        ticking=false;
      });
    }
    window.addEventListener('scroll',upd,{passive:true}); upd();
  }

  function initCookie(){
    if(doc.getElementById('ml-cookie')) return;
    if(localStorage.getItem('ml-cookie')) return;
    var b=doc.createElement('div');
    b.id='ml-cookie';
    b.innerHTML='<div class="ml-ck-txt">Diese Website verwendet nur technisch notwendige Cookies. '
      +'Keine Tracker, kein Marketing-Tracking. <a href="datenschutz/" rel="nofollow">Datenschutz</a>.</div>'
      +'<div class="ml-ck-act"><button type="button" data-ck="0">Nur notwendige</button>'
      +'<button type="button" class="ml-ck-primary" data-ck="1">Einverstanden</button></div>';
    doc.body.appendChild(b);
    requestAnimationFrame(function(){b.classList.add('show');});
    b.addEventListener('click',function(e){
      var t=e.target.closest('[data-ck]'); if(!t) return;
      localStorage.setItem('ml-cookie',t.getAttribute('data-ck')==='1'?'all':'necessary');
      b.classList.remove('show'); setTimeout(function(){b.remove();},250);
    });
  }

  function fixBrokenImages(){
    doc.querySelectorAll('img').forEach(function(img){
      img.addEventListener('error',function(){img.classList.add('ml-broken');});
      if(!img.getAttribute('src')) img.classList.add('ml-broken');
    });
  }

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function injectImmo(){
    if(!CFG.isRealEstate || !CFG.listings || !CFG.listings.length) return;
    if(doc.getElementById('ml-immo')) return;
    var depth=siteDepth();
    var onHome=depth===0;
    var onImmo=/\/(immobilien|objekte|angebote)(\/|$)/i.test(location.pathname);
    if(!onHome && !onImmo) return;
    var cards=CFG.listings.map(function(p){
      var st=(p.status||'').toLowerCase();
      var bc=st.indexOf('verkauf')>-1?'is-sold':(st.indexOf('reserv')>-1?'is-res':'');
      var meta=[];
      if(p.wohnflaeche) meta.push('<span>'+esc(p.wohnflaeche)+' Wohnfl.</span>');
      if(p.grundstueck) meta.push('<span>'+esc(p.grundstueck)+' Grundst.</span>');
      if(p.zimmer) meta.push('<span>'+esc(p.zimmer)+' Zi.</span>');
      return '<a class="ml-pcard ml-reveal" href="'+esc(p.link||'#')+'" target="_blank" rel="noopener">'
        +'<div class="ml-pcard-img">'
        +(p.image?'<img loading="lazy" src="'+esc(p.image)+'" alt="'+esc(p.title)+'">':'')
        +(p.status?'<span class="ml-pcard-badge '+bc+'">'+esc(p.status)+'</span>':'')
        +'</div><div class="ml-pcard-body">'
        +'<div class="ml-pcard-title">'+esc(p.title||'Objekt')+'</div>'
        +(p.location?'<div class="ml-pcard-loc">'+esc(p.location)+'</div>':'')
        +(meta.length?'<div class="ml-pcard-meta">'+meta.join('')+'</div>':'')
        +(p.price?'<div class="ml-pcard-price">'+esc(p.price)+'</div>':'')
        +'</div></a>';
    }).join('');
    var sec=doc.createElement('section');
    sec.id='ml-immo';
    sec.innerHTML='<h2>Aktuelle Objekte</h2>'
      +'<p class="ml-immo-sub">Aktuelle Angebote aus unserem Bestand</p>'
      +'<div id="ml-immo-grid">'+cards+'</div>';
    var placed=false;
    if(onImmo){
      var secs=doc.querySelectorAll('main section,section');
      for(var i=0;i<secs.length;i++){
        var tx=(secs[i].textContent||'').toLowerCase();
        if(secs[i].id!=='ml-immo' && tx.length<700
           && /vorbereitung|in k(.)?rze|coming soon|demn(.)?chst/i.test(tx)){
          secs[i].parentNode.replaceChild(sec,secs[i]); placed=true; break;
        }
      }
    }
    if(!placed){
      var ft=doc.querySelector('footer');
      if(ft) ft.parentNode.insertBefore(sec,ft); else doc.body.appendChild(sec);
    }
  }

  function initParticleHero(rgb){
    if(reduce) return;
    var host=heroEl(); if(!host) return;
    if(host.querySelector('.ml-hero-canvas')) return;
    var cv=doc.createElement('canvas'); cv.className='ml-hero-canvas';
    host.classList.add('ml-hero-host');
    host.insertBefore(cv,host.firstChild);
    var ctx=cv.getContext('2d'); if(!ctx){ cv.remove(); return; }
    var dpr=Math.min(window.devicePixelRatio||1,2);
    var W=0,H=0,parts=[],mx=0,my=0;
    function size(){
      W=host.clientWidth||window.innerWidth;
      H=host.clientHeight||window.innerHeight;
      cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
      cv.style.width=W+'px'; cv.style.height=H+'px';
    }
    function build(){
      var n=Math.max(34,Math.min(96,Math.round(W*H/18000)));
      parts=[];
      for(var i=0;i<n;i++){
        var z=Math.random()*0.7+0.3;
        parts.push({ x:Math.random()*W, y:Math.random()*H,
          vx:(Math.random()-0.5)*0.28*z, vy:(Math.random()-0.5)*0.28*z, z:z });
      }
    }
    size(); build();
    window.addEventListener('resize',function(){ size(); build(); });
    window.addEventListener('mousemove',function(e){
      mx=(e.clientX/window.innerWidth-0.5);
      my=(e.clientY/window.innerHeight-0.5);
    },{passive:true});
    var run=true,last=0,col=rgb[0]+','+rgb[1]+','+rgb[2];
    function frame(ts){
      if(!run) return;
      requestAnimationFrame(frame);
      if(ts-last<33) return;
      last=ts;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,W,H);
      var i,j,p,q,dx,dy,d2;
      for(i=0;i<parts.length;i++){
        p=parts[i];
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<-24)p.x=W+24; else if(p.x>W+24)p.x=-24;
        if(p.y<-24)p.y=H+24; else if(p.y>H+24)p.y=-24;
      }
      var ox=mx*36, oy=my*36;
      ctx.lineWidth=1;
      for(i=0;i<parts.length;i++){
        p=parts[i];
        for(j=i+1;j<parts.length;j++){
          q=parts[j];
          dx=p.x-q.x; dy=p.y-q.y; d2=dx*dx+dy*dy;
          if(d2<17000){
            var a=(1-d2/17000)*0.30*Math.min(p.z,q.z);
            ctx.strokeStyle='rgba('+col+','+a.toFixed(3)+')';
            ctx.beginPath();
            ctx.moveTo(p.x+ox*p.z,p.y+oy*p.z);
            ctx.lineTo(q.x+ox*q.z,q.y+oy*q.z);
            ctx.stroke();
          }
        }
      }
      for(i=0;i<parts.length;i++){
        p=parts[i];
        ctx.fillStyle='rgba('+col+','+(0.42+0.5*p.z).toFixed(3)+')';
        ctx.beginPath();
        ctx.arc(p.x+ox*p.z,p.y+oy*p.z,1.6+2.8*p.z,0,6.2832);
        ctx.fill();
      }
    }
    requestAnimationFrame(frame);
    requestAnimationFrame(function(){ cv.classList.add('is-on'); });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        var on=es[0].isIntersecting;
        if(on && !run){ run=true; last=0; requestAnimationFrame(frame); }
        else if(!on){ run=false; }
      },{threshold:0.01}).observe(host);
    }
  }

  /* background-layer parallax only (no content recede) */
  function initScrollParallax(){
    if(reduce) return;
    var host=heroEl(); if(!host) return;
    var aur=host.querySelector('.ml-aurora');
    var cv=host.querySelector('.ml-hero-canvas');
    if(!aur && !cv) return;
    var ticking=false;
    function onScroll(){
      if(ticking) return;
      ticking=true;
      requestAnimationFrame(function(){
        var y=window.scrollY||window.pageYOffset||0;
        var hh=host.offsetHeight||1;
        if(y<=hh){
          if(aur) aur.style.transform='translateY('+(y*0.3).toFixed(1)+'px)';
          if(cv)  cv.style.transform='translateY('+(y*0.16).toFixed(1)+'px)';
        }
        ticking=false;
      });
    }
    window.addEventListener('scroll',onScroll,{passive:true});
  }

  function init(){
    var rgb;
    try{ rgb=detectTheme(); }catch(e){ rgb=[59,108,255]; }
    var heroDark=false;
    try{ heroDark=heroIsDark(); }catch(e){}
    try{ fixEmails(); }catch(e){}
    try{ enhanceHeroReadability(); }catch(e){}
    try{ injectAurora(); }catch(e){}
    try{ injectCube(); }catch(e){}
    try{ initSpotlight(); }catch(e){}
    try{ markElements(); }catch(e){}
    try{ cinematicHeroEntrance(); }catch(e){}
    try{ gradientHeadline(heroDark); }catch(e){}
    try{ injectImmo(); }catch(e){}
    try{ initReveal(); }catch(e){}
    try{ initTilt(); }catch(e){}
    try{ initMagnetic(); }catch(e){}
    try{ initCounters(); }catch(e){}
    try{ initSmoothScroll(); }catch(e){}
    try{ initProgressBar(); }catch(e){}
    try{ initCookie(); }catch(e){}
    try{ fixBrokenImages(); }catch(e){}
    try{ initParticleHero(rgb); }catch(e){}
    try{ init3DHero(); }catch(e){}
    try{ initScrollParallax(); }catch(e){}
    setTimeout(function(){
      doc.querySelectorAll('.ml-reveal:not(.is-visible)').forEach(function(e){e.classList.add('is-visible');});
    },4500);
  }
  if(doc.readyState==='loading') doc.addEventListener('DOMContentLoaded',init);
  else init();
})();
