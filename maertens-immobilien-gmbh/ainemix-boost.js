/* AiNemix Design Boost v1 - generic */
(function(){
  'use strict';
  var CFG = {"email":"paul@ainemix.com","wrongEmails":["paul@ainemix.com","vanessa@ainemix.com","noreply@ainemix.com","test@example.com"],"isRealEstate":true,"listings":[{"title":"Ein Zuhause mit Geschichte - bereit für neue Ideen","link":"https://www.maertens-immobilien.com/de/0__227_2_3_/braunschweig-ein-zuhause-mit-geschichte-bereit-fuer-neue-ideen.html","image":"https://www.maertens-immobilien.com/de/upload/immobilie4875-ansicht-g.jpg","status":"#verkaufenwir","price":"350.000 €","wohnflaeche":"162 m²","grundstueck":"603 m²","zimmer":"6","location":null},{"title":"- RESERVIERT - Ein- bis Zweifamilienwohnhaus mit tollem Garten#verkaufen wir","link":"https://www.maertens-immobilien.com/de/0__221_2_3_/weddel-reserviert-ein-bis-zweifamilienwohnhaus-mit-tollem-gartenverkaufen-wir.html","image":"https://www.maertens-immobilien.com/de/upload/4789-221-13-g.jpg","status":"VERKAUFT","price":"269.000 €","wohnflaeche":"145 m²","grundstueck":"1.250 m²","zimmer":"6","location":null},{"title":"Ein- / Zweifamilienhaus in GF - Gamsen","link":"https://www.maertens-immobilien.com/de/0__222_2_3_/gifhorn-ein-zweifamilienhaus-in-gf-gamsen.html","image":"https://www.maertens-immobilien.com/de/upload/4804-222-8-g.jpg","status":"VERKAUFT","price":"299.000 €","wohnflaeche":"175 m²","grundstueck":"640 m²","zimmer":"7","location":null},{"title":"RESERVIERT: Wohnerlebnis in Bielefeld-Quelle: 3,5 Zimmer mit Balkon","link":"https://www.maertens-immobilien.com/de/0__225_1_3_/bielefeld-reserviert-wohnerlebnis-in-bielefeld-quelle-35-zimmer-mit-balkon.html","image":"https://www.maertens-immobilien.com/de/upload/4829-225-5-g.jpg","status":"RESERVIERT","price":"220.000 €","wohnflaeche":"88 m²","grundstueck":null,"zimmer":"3,5","location":null},{"title":"3-Zimmer-Wohnung in zentraler Citylage.","link":"https://www.maertens-immobilien.com/de/0__224_1_3_/braunschweig-3-zimmer-wohnung-in-zentraler-citylage.html","image":"https://www.maertens-immobilien.com/de/upload/4822-224-1-g.jpg","status":"#verkaufenwir","price":"175.000 €","wohnflaeche":"62 m²","grundstueck":null,"zimmer":"3","location":null},{"title":"Und am Ende der Straße steht ein Bungalow...","link":"https://www.maertens-immobilien.com/de/0__219_2_3_/hannover-und-am-ende-der-strasse-steht-ein-bungalow.html","image":"https://www.maertens-immobilien.com/de/upload/4745-219-7-g.jpg","status":"VERKAUFT","price":"399.000 €","wohnflaeche":"102 m²","grundstueck":"327 m²","zimmer":"4","location":null}],"phone":"+49 170 5224355","company":"Maertens Immobilien GmbH"};
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

  function loadScript(src){
    return new Promise(function(res,rej){
      var s=doc.createElement('script'); s.src=src; s.async=true;
      s.onload=res; s.onerror=rej; doc.head.appendChild(s);
    });
  }
  function initWebGLHero(rgb){
    var host=heroEl(); if(!host || !window.THREE) return;
    var THREE=window.THREE;
    var cv=doc.createElement('canvas'); cv.className='ml-hero-canvas';
    host.classList.add('ml-hero-host');
    host.insertBefore(cv,host.firstChild);
    var w=host.clientWidth, h=host.clientHeight||innerHeight, renderer;
    try{ renderer=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true}); }
    catch(e){ cv.remove(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
    renderer.setSize(w,h,false);
    var scene=new THREE.Scene();
    var cam=new THREE.PerspectiveCamera(60,w/h,.1,100); cam.position.z=14;
    var col=new THREE.Color(rgb[0]/255,rgb[1]/255,rgb[2]/255);
    var N=Math.max(200,Math.min(900,Math.round(w*h/2600)));
    var geo=new THREE.BufferGeometry(), pos=new Float32Array(N*3);
    for(var i=0;i<N*3;i++) pos[i]=(Math.random()-.5)*36;
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    var pts=new THREE.Points(geo,new THREE.PointsMaterial({color:col,size:.11,
      transparent:true,opacity:.7,depthWrite:false}));
    scene.add(pts);
    var ico=new THREE.Mesh(new THREE.IcosahedronGeometry(5.2,1),
      new THREE.MeshBasicMaterial({color:col,wireframe:true,transparent:true,opacity:.26}));
    scene.add(ico);
    var mx=0,my=0;
    window.addEventListener('mousemove',function(e){
      mx=(e.clientX/innerWidth-.5); my=(e.clientY/innerHeight-.5);
    });
    var run=true;
    window.addEventListener('resize',function(){
      w=host.clientWidth; h=host.clientHeight||innerHeight;
      renderer.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix();
    });
    function tick(){
      if(!run) return;
      requestAnimationFrame(tick);
      ico.rotation.x+=.0016; ico.rotation.y+=.0022; pts.rotation.y+=.0006;
      cam.position.x+=(mx*3-cam.position.x)*.04;
      cam.position.y+=(-my*3-cam.position.y)*.04;
      cam.lookAt(0,0,0);
      renderer.render(scene,cam);
    }
    tick();
    requestAnimationFrame(function(){cv.classList.add('is-on');});
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        var on=es[0].isIntersecting;
        if(on && !run){ run=true; tick(); } else run=on;
      },{threshold:.01}).observe(host);
    }
  }
  function initScrollStory(){
    if(!window.gsap || !window.ScrollTrigger) return;
    var g=window.gsap; g.registerPlugin(window.ScrollTrigger);
    var host=heroEl();
    if(host){
      var aur=host.querySelector('.ml-aurora');
      if(aur) g.to(aur,{yPercent:24,ease:'none',
        scrollTrigger:{trigger:host,start:'top top',end:'bottom top',scrub:.6}});
      var cv=host.querySelector('.ml-hero-canvas');
      if(cv) g.to(cv,{yPercent:14,ease:'none',
        scrollTrigger:{trigger:host,start:'top top',end:'bottom top',scrub:.6}});
    }
    doc.querySelectorAll('section,[class*="section"]').forEach(function(sec){
      if(sec.id==='ml-immo'||sec===host) return;
      var t=sec.querySelectorAll('img,[class*="card"],article');
      if(!t.length) return;
      g.fromTo(t,{y:42},{y:0,ease:'none',
        scrollTrigger:{trigger:sec,start:'top 86%',end:'top 42%',scrub:.5}});
    });
  }
  function loadHeavy(rgb){
    var conn=navigator.connection;
    var slow=conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType||''));
    if(reduce || innerWidth<=768 || slow) return;
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
      .then(function(){ try{initWebGLHero(rgb);}catch(e){} }).catch(function(){});
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js')
      .then(function(){ return loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'); })
      .then(function(){ try{initScrollStory();}catch(e){} }).catch(function(){});
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
    try{ loadHeavy(rgb); }catch(e){}
    setTimeout(function(){
      doc.querySelectorAll('.ml-reveal:not(.is-visible)').forEach(function(e){e.classList.add('is-visible');});
    },4200);
  }
  if(doc.readyState==='loading') doc.addEventListener('DOMContentLoaded',init);
  else init();
})();
