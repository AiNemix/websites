/* AiNemix Design Boost v6 - tasteful, self-contained */
(function(){
  'use strict';
  var CFG = {"email": "paulsaitest@gmail.com", "wrongEmails": ["paul@ainemix.com", "vanessa@ainemix.com", "noreply@ainemix.com", "test@example.com"], "isRealEstate": false, "listings": []};
  var doc = document;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function parseRgb(str){
    if(!str) return null; str=String(str).trim();
    var m=str.match(/^#([0-9a-f]{3,8})$/i);
    if(m){var h=m[1];if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
      return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
    m=str.match(/rgba?\(([^)]+)\)/i);
    if(m){var p=m[1].split(',').map(function(x){return parseFloat(x);});
      if(p.length>=3)return [p[0]|0,p[1]|0,p[2]|0];}
    return null;
  }
  function luma(r){return 0.2126*r[0]+0.7152*r[1]+0.0722*r[2];}
  function detectTheme(){
    var cs=getComputedStyle(doc.documentElement);
    var vars=['--color-primary','--primary','--color-accent','--accent','--brand','--c-primary'];
    for(var i=0;i<vars.length;i++){
      var r=parseRgb(cs.getPropertyValue(vars[i]));
      if(r && luma(r)<232 && (r[0]+r[1]+r[2])>14){
        doc.documentElement.style.setProperty('--ml-accent','rgb('+r[0]+','+r[1]+','+r[2]+')');
        return;
      }
    }
    var el=doc.querySelector('.btn-primary,.cta,.button-primary,[class*="btn-primary"]');
    if(el){var r2=parseRgb(getComputedStyle(el).backgroundColor);
      if(r2 && luma(r2)<232) doc.documentElement.style.setProperty('--ml-accent','rgb('+r2[0]+','+r2[1]+','+r2[2]+')');}
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

  function enhanceHeroReadability(){
    var h=heroEl(); if(!h) return;
    var cs=getComputedStyle(h);
    var hasBg=cs.backgroundImage && cs.backgroundImage!=='none' && cs.backgroundImage.indexOf('url')>-1;
    var bigImg=null;
    h.querySelectorAll('img').forEach(function(im){
      var r=im.getBoundingClientRect();
      if(r.width>h.clientWidth*0.55 && r.height>h.clientHeight*0.45) bigImg=im;
    });
    if(!hasBg && !bigImg) return;
    if(cs.position==='static') h.style.position='relative';
    h.classList.add('ml-hero-host');
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

  function markElements(){
    doc.querySelectorAll('article,.card,[class*="card"],[class*="feature"],[class*="service"],[class*="tile"]').forEach(function(el){
      if(el.closest('#ml-immo')) return;
      el.classList.add('ml-lift');
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
  }

  function initReveal(){
    if(reduce || !('IntersectionObserver' in window)){
      doc.querySelectorAll('.ml-reveal').forEach(function(e){e.classList.add('is-visible');});
      return;
    }
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target);} });
    },{threshold:.12,rootMargin:'0px 0px -7% 0px'});
    doc.querySelectorAll('.ml-reveal').forEach(function(e){io.observe(e);});
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

  function init(){
    try{ detectTheme(); }catch(e){}
    try{ fixEmails(); }catch(e){}
    try{ enhanceHeroReadability(); }catch(e){}
    try{ markElements(); }catch(e){}
    try{ injectImmo(); }catch(e){}
    try{ initReveal(); }catch(e){}
    try{ initCounters(); }catch(e){}
    try{ initSmoothScroll(); }catch(e){}
    try{ initProgressBar(); }catch(e){}
    try{ initCookie(); }catch(e){}
    try{ fixBrokenImages(); }catch(e){}
    setTimeout(function(){
      doc.querySelectorAll('.ml-reveal:not(.is-visible)').forEach(function(e){e.classList.add('is-visible');});
    },4000);
  }
  if(doc.readyState==='loading') doc.addEventListener('DOMContentLoaded',init);
  else init();
})();
