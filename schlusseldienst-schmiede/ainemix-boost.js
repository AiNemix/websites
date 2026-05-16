/* AiNemix Design Boost v2 - generic, self-contained (no external deps) */
(function(){
  'use strict';
  var CFG = {"email":"info@schluesseldienst-schmiede.de","wrongEmails":["paul@ainemix.com","vanessa@ainemix.com","noreply@ainemix.com","test@example.com"],"isRealEstate":false,"listings":[],"phone":"0351 48205831","company":"Schlüsseldienst Schmiede"};
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

  function heroEl(){
    return doc.querySelector('.hero,[class*="hero"],header+section,main>section:first-child');
  }
  function siteDepth(){
    var s=doc.querySelector('script[src*="ainemix-boost.js"]');
    var src=s?(s.getAttribute('src')||''):'';
    var m=src.match(/^(\.\.\/)+/);
    return m?m[0].length/3:0;
  }

  function markElements(){
    doc.querySelectorAll('article,.card,[class*="card"],[class*="feature"],[class*="service"],[class*="tile"]').forEach(function(el){
      if(el.closest('#ml-immo')) return;
      el.classList.add('ml-lift');
      if(!reduce) el.classList.add('ml-tilt');
    });
    doc.querySelectorAll('section,[class*="section"]').forEach(function(sec){
      if(sec.closest('#ml-immo')) return;
      var t=sec.querySelectorAll('h1,h2,h3,p,article,.card,[class*="card"],img,.btn,a[class*="btn"],ul,form,blockquote');
      var c=0;
      t.forEach(function(el){
        if(el.closest('#ml-immo')||el.classList.contains('ml-reveal')) return;
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
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
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
          card.style.transform='perspective(900px) rotateX('+(-py*6)+'deg) rotateY('+(px*6)+'deg) translateY(-6px)';
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
        b.style.transform='translate('+((ev.clientX-r.left-r.width/2)*.18)+'px,'+((ev.clientY-r.top-r.height/2)*.22)+'px)';
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
          var p=Math.min(1,(now-t0)/1500);
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

  function injectAurora(){
    var h=heroEl(); if(!h) return;
    if(getComputedStyle(h).position==='static') h.style.position='relative';
    h.classList.add('ml-hero-host');
    if(!h.querySelector('.ml-aurora')){
      var a=doc.createElement('div'); a.className='ml-aurora';
      a.innerHTML='<i></i><i></i><i></i>';
      h.insertBefore(a,h.firstChild);
    }
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

  /* ---- canvas-2D particle/constellation hero (self-contained, bounded) ---- */
  function initParticleHero(rgb){
    if(reduce) return;
    var host=heroEl(); if(!host) return;
    if(host.querySelector('.ml-hero-canvas')) return;
    var cv=doc.createElement('canvas'); cv.className='ml-hero-canvas';
    if(getComputedStyle(host).position==='static') host.style.position='relative';
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
      var n=Math.max(26,Math.min(74,Math.round(W*H/24000)));
      parts=[];
      for(var i=0;i<n;i++){
        var z=Math.random()*0.7+0.3;
        parts.push({ x:Math.random()*W, y:Math.random()*H,
          vx:(Math.random()-0.5)*0.24*z, vy:(Math.random()-0.5)*0.24*z, z:z });
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
      if(ts-last<33) return;            /* ~30 fps hard cap */
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
      var ox=mx*26, oy=my*26;
      ctx.lineWidth=1;
      for(i=0;i<parts.length;i++){
        p=parts[i];
        for(j=i+1;j<parts.length;j++){
          q=parts[j];
          dx=p.x-q.x; dy=p.y-q.y; d2=dx*dx+dy*dy;
          if(d2<15000){
            var a=(1-d2/15000)*0.22*Math.min(p.z,q.z);
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
        ctx.fillStyle='rgba('+col+','+(0.32+0.42*p.z).toFixed(3)+')';
        ctx.beginPath();
        ctx.arc(p.x+ox*p.z,p.y+oy*p.z,1.4+2.3*p.z,0,6.2832);
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

  /* ---- light scroll parallax (rAF-throttled, passive) ---- */
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
          if(aur) aur.style.transform='translateY('+(y*0.28).toFixed(1)+'px)';
          if(cv)  cv.style.transform='translateY('+(y*0.15).toFixed(1)+'px)';
        }
        ticking=false;
      });
    }
    window.addEventListener('scroll',onScroll,{passive:true});
  }

  function init(){
    var rgb;
    try{ rgb=detectTheme(); }catch(e){ rgb=[59,108,255]; }
    try{ fixEmails(); }catch(e){}
    try{ injectAurora(); }catch(e){}
    try{ markElements(); }catch(e){}
    try{ injectImmo(); }catch(e){}
    try{ initReveal(); }catch(e){}
    try{ initTilt(); }catch(e){}
    try{ initMagnetic(); }catch(e){}
    try{ initCounters(); }catch(e){}
    try{ initSmoothScroll(); }catch(e){}
    try{ initCookie(); }catch(e){}
    try{ fixBrokenImages(); }catch(e){}
    try{ initParticleHero(rgb); }catch(e){}
    try{ initScrollParallax(); }catch(e){}
    setTimeout(function(){
      doc.querySelectorAll('.ml-reveal:not(.is-visible)').forEach(function(e){e.classList.add('is-visible');});
    },4200);
  }
  if(doc.readyState==='loading') doc.addEventListener('DOMContentLoaded',init);
  else init();
})();
