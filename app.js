(function(){
  var WA="33751238450", EMAIL="sevenprod75@gmail.com";
  var calme=window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Suivi des conversions : la balise Google Ads (gtag) se branche ici une fois le compte créé.
  function track(n){ try{ window.dataLayer=window.dataLayer||[]; window.dataLayer.push({event:n}); if(window.gtag) window.gtag('event',n); }catch(e){} }
  document.addEventListener('click',function(e){ var a=e.target.closest('[data-track]'); if(a) track(a.getAttribute('data-track')); });

  // En-tête : un filet apparaît dès qu'on quitte le haut de page
  var tete=document.querySelector('.tete');
  function filet(){ if(tete) tete.classList.toggle('colle', window.scrollY>8); }
  filet(); addEventListener('scroll',filet,{passive:true});

  // Viseur : compteur de la caméra (25 images/s) et léger parallaxe, seulement quand le héros est visible
  var hero=document.querySelector('.hero'), tc=document.getElementById('tc'), media=document.querySelector('.hero-img');
  if(hero){
    var visible=true, debut=performance.now(), offset=(+(tc&&tc.getAttribute('data-start'))||0)*25;
    function p2(n){ return (n<10?'0':'')+n; }
    function boucle(t){
      if(visible){
        if(tc){ var f=offset+Math.floor((t-debut)/40); tc.textContent=p2(Math.floor(f/90000))+':'+p2(Math.floor(f/1500)%60)+':'+p2(Math.floor(f/25)%60)+':'+p2(f%25); }
        if(media && !calme){ var y=Math.min(window.scrollY, hero.offsetHeight); media.style.transform='translate3d(0,'+(y*0.18).toFixed(1)+'px,0)'; }
      }
      requestAnimationFrame(boucle);
    }
    // Vidéo : si le téléphone bloque la lecture (économie d'énergie, appli), on passe sur l'image animée
    var video=hero.querySelector('video'), anim=hero.querySelector('.hero-anim'), joue=false, secours=false;
    function passerSecours(){ if(secours||!anim||calme) return; secours=true; anim.onload=function(){ anim.hidden=false; if(video){ video.pause(); video.hidden=true; } }; anim.src=anim.getAttribute('data-src'); }
    function verifier(){ if(!joue && !secours && visible && video && video.paused && video.readyState>=2) passerSecours(); }
    if(video){
      video.addEventListener('playing',function(){ joue=true; });
      video.addEventListener('error',passerSecours,true);
      if(calme){ video.removeAttribute('autoplay'); video.pause(); }
      else { video.addEventListener('canplay',function(){ setTimeout(verifier,900); }); setTimeout(verifier,2600); }
    }
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){ visible=es[0].isIntersecting; if(video && !calme && !secours){ if(visible){ var p=video.play(); if(p&&p.catch) p.catch(function(e){ if(e && (e.name==='NotAllowedError'||e.name==='NotSupportedError')) passerSecours(); }); } else video.pause(); } },{threshold:0}).observe(hero);
    requestAnimationFrame(boucle);
  }

  // Menu sur téléphone
  var mb=document.querySelector('.menu-btn'), menu=document.getElementById('menu');
  if(mb && menu){
    function ouvrir(o){ menu.classList.toggle('ouvert',o); menu.inert=!o; mb.setAttribute('aria-expanded',o?'true':'false'); mb.querySelector('.lbl-menu').textContent=o?'Fermer':'Menu'; document.body.classList.toggle('menu-ouvert',o); }
    mb.addEventListener('click',function(){ ouvrir(!menu.classList.contains('ouvert')); });
    menu.addEventListener('click',function(e){ if(e.target.closest('a')) ouvrir(false); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape' && menu.classList.contains('ouvert')){ ouvrir(false); mb.focus(); } });
    addEventListener('resize',function(){ if(innerWidth>880) ouvrir(false); });
  }

  // Formules sur téléphone : la bande s'ouvre sur la formule conseillée
  var tarifs=document.querySelector('.tarifs'), conseil=tarifs && tarifs.querySelector('[data-feutre]');
  if(tarifs && conseil && matchMedia('(max-width:760px)').matches){
    tarifs.scrollLeft = conseil.getBoundingClientRect().left - tarifs.getBoundingClientRect().left + tarifs.scrollLeft - (tarifs.clientWidth - conseil.offsetWidth)/2;
  }

  // Traits de feutre : ils se dessinent quand le bloc entre à l'écran
  var annotes=document.querySelectorAll('[data-feutre]');
  if('IntersectionObserver' in window && !calme){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('vu'); io.unobserve(e.target); } }); },{threshold:0.45,rootMargin:'0px 0px -8% 0px'});
    annotes.forEach(function(el){ io.observe(el); });
  } else annotes.forEach(function(el){ el.classList.add('vu'); });

  // Barre du téléphone : visible après le héros, cachée sur le formulaire
  var barre=document.getElementById('barre'), devis=document.getElementById('devis'), haut=document.querySelector('.hero, .entete-page');
  if(barre && 'IntersectionObserver' in window){
    var hautVu=true, devisVu=false;
    function maj(){ barre.classList.toggle('on', !hautVu && !devisVu); }
    if(haut) new IntersectionObserver(function(es){ hautVu=es[0].isIntersecting; maj(); }).observe(haut); else hautVu=false;
    if(devis) new IntersectionObserver(function(es){ devisVu=es[0].isIntersecting; maj(); },{threshold:0.12}).observe(devis);
    maj();
  } else if(barre) barre.classList.add('on');

  // Les boutons des formules cochent la bonne formule dans le formulaire
  document.querySelectorAll('[data-formule]').forEach(function(a){ a.addEventListener('click',function(){ var r=document.getElementById('f'+a.getAttribute('data-formule')); if(r) r.checked=true; }); });

  // Visionneuse plein écran
  var lb=document.getElementById('lb');
  if(lb && lb.showModal){
    var items=[], i=0, img=document.getElementById('lb-img'), cap=document.getElementById('lb-cap'), num=document.getElementById('lb-tc'), pos=document.getElementById('lb-pos');
    function liste(){ items=[].slice.call(document.querySelectorAll('[data-lb]')).filter(function(b){ return !b.closest('[hidden]'); }); }
    function montre(n){ i=(n+items.length)%items.length; var b=items[i]; img.style.opacity=.3; img.onload=function(){ img.style.opacity=1; }; img.src=b.getAttribute('data-lb'); img.alt=b.querySelector('img').alt; cap.textContent=b.getAttribute('data-cap')||''; num.textContent=b.getAttribute('data-tc')||''; pos.textContent=(i+1)+' / '+items.length; }
    document.addEventListener('click',function(e){ var b=e.target.closest('[data-lb]'); if(!b) return; liste(); montre(items.indexOf(b)); lb.showModal(); track('galerie_ouverte'); });
    document.getElementById('lb-prev').onclick=function(){ montre(i-1); };
    document.getElementById('lb-next').onclick=function(){ montre(i+1); };
    document.getElementById('lb-close').onclick=function(){ lb.close(); };
    lb.addEventListener('keydown',function(e){ if(e.key==='ArrowLeft') montre(i-1); if(e.key==='ArrowRight') montre(i+1); });
    lb.addEventListener('click',function(e){ if(e.target===lb||e.target.tagName==='FIGURE') lb.close(); });
    var x0=null;
    lb.addEventListener('touchstart',function(e){ x0=e.touches[0].clientX; },{passive:true});
    lb.addEventListener('touchend',function(e){ if(x0===null) return; var dx=e.changedTouches[0].clientX-x0; if(Math.abs(dx)>50) montre(i+(dx<0?1:-1)); x0=null; });
  }

  // Filtres de la galerie
  var fb=document.querySelectorAll('.filtres button');
  fb.forEach(function(b){ b.addEventListener('click',function(){ var c=b.getAttribute('data-f'); fb.forEach(function(x){ x.setAttribute('aria-pressed',x===b?'true':'false'); }); document.querySelectorAll('.galerie .photo').forEach(function(p){ p.hidden=!(c==='tout'||p.getAttribute('data-cat')===c); }); }); });

  // Formulaire de devis : prépare le message, envoyé ensuite sur WhatsApp ou par e-mail
  var f=document.getElementById('form-devis'); if(!f) return;
  var err=document.getElementById('erreur'), pret=document.getElementById('pret'), recap=document.getElementById('recap');
  function v(id){ var el=document.getElementById(id); return el?el.value.trim():''; }
  function dateFr(s){ var p=s.split('-'); return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:s; }
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(!v('prenom')||!v('tel')){ err.textContent="Indiquez votre prénom et votre téléphone pour qu'Ariel puisse vous répondre."; err.hidden=false; (v('prenom')?document.getElementById('tel'):document.getElementById('prenom')).focus(); return; }
    err.hidden=true;
    var fo=f.querySelector('input[name=formule]:checked');
    var l=["Bonjour Ariel, je souhaite un devis.","Prénom : "+v('prenom'),"Téléphone : "+v('tel'),"Événement : "+v('type')];
    if(v('date')) l.push("Date : "+dateFr(v('date')));
    if(v('lieu')) l.push("Lieu : "+v('lieu'));
    if(v('invites')) l.push("Invités : "+v('invites'));
    if(fo) l.push("Formule : "+fo.value);
    if(v('message')) l.push("",v('message'));
    var txt=l.join("\n"); recap.textContent=txt;
    document.getElementById('envoi-wa').href="https://wa.me/"+WA+"?text="+encodeURIComponent(txt);
    document.getElementById('envoi-mail').href="mailto:"+EMAIL+"?subject="+encodeURIComponent("Demande de devis, "+v('type')+", "+v('prenom'))+"&body="+encodeURIComponent(txt);
    pret.hidden=false; pret.scrollIntoView({block:'nearest',behavior:calme?'auto':'smooth'}); track('devis_prepare');
  });
  document.getElementById('copier').addEventListener('click',function(){
    var b=this;
    function ok(){ b.textContent="Copié"; setTimeout(function(){ b.textContent="Copier le texte"; },1800); }
    function sel(){ var r=document.createRange(); r.selectNodeContents(recap); var s=getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent="Texte sélectionné"; }
    try{ navigator.clipboard.writeText(recap.textContent).then(ok,sel); }catch(e){ sel(); }
  });
})();
