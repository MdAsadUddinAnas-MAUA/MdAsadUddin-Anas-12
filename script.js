(function(){
  "use strict";

  var CONTACT_EMAIL = "mdasaduddinanas2@gmail.com";

  /* Resumes now served locally from the /resumes folder in this repo
     instead of Google Drive — instant, reliable downloads with no
     "can't scan for viruses" interstitial. Make sure your uploaded
     PDF filenames match these exactly (case-sensitive on most hosts). */
  var RESUME_OPTIONS = [
    { label: "Java + Cybersecurity Hybrid",        path: "resumes/Java-Cybersecurity-Hybrid.pdf" },
    { label: "Cybersecurity Analyst",              path: "resumes/Cybersecurity-Analyst.pdf" },
    { label: "Java Developer",                     path: "resumes/Java-Developer.pdf" },
    { label: "Windows / VMware / Linux / Azure",   path: "resumes/Windows-VMware-Linux-Azure.pdf" }
  ];

  var EMAILJS_PUBLIC_KEY  = "tmklaGY8sHhKWcp49";
  var EMAILJS_SERVICE_ID  = "service_yz0on9i";
  var EMAILJS_TEMPLATE_ID = "template_4ud8gwu";
  var EMAILJS_AUTOREPLY_TEMPLATE_ID = ""; // paste your 2nd (visitor auto-reply) template ID here once created

  var TURNSTILE_ENABLED = true; // set false to remove the human-verification gate entirely

  var emailjsReady = false;
  (function loadEmailJS(){
    try{
      var s = document.createElement('script');
      s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      s.onload = function(){
        if(window.emailjs && EMAILJS_PUBLIC_KEY){
          window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
          emailjsReady = true;
        }
      };
      s.onerror = function(){ emailjsReady = false; };
      document.head.appendChild(s);
    }catch(e){ emailjsReady = false; }
  })();

  /* ---------- Turnstile callbacks (global, referenced by data-callback attrs) ---------- */
  var turnstileToken = "";
  window.onTurnstileSuccess = function(token){ turnstileToken = token || ""; };
  window.onTurnstileExpired = function(){ turnstileToken = ""; };

  /* ---------- Service worker registration (network-first, no aggressive caching) ---------- */
  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('service-worker.js').catch(function(){ /* fails silently, site still works */ });
    });
  }

  window.addEventListener('load', function(){
    var loader = document.getElementById('loader');
    setTimeout(function(){ loader.classList.add('hidden'); }, 450);
  });
  setTimeout(function(){ document.getElementById('loader').classList.add('hidden'); }, 3000);

  var root = document.documentElement;
  var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  root.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
  document.getElementById('theme-toggle').addEventListener('click', function(){
    var current = root.getAttribute('data-theme');
    root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    if(typeof refreshParticleColors === 'function') refreshParticleColors();
  });

  var nav = document.getElementById('nav');
  var toTop = document.getElementById('to-top');
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    if(y > 30){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
    if(y > 500){ toTop.classList.add('show'); } else { toTop.classList.remove('show'); }
  }, { passive:true });
  toTop.addEventListener('click', function(){ window.scrollTo({ top:0, behavior:'smooth' }); });

  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', function(){
    var isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && mobileMenu.classList.contains('open')){
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(e){
      var id = link.getAttribute('href');
      if(id.length < 2) return;
      var target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      var offset = 76;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior:'smooth' });
    });
  });

  var revealEls = document.querySelectorAll('.reveal');
  var skillBars = document.querySelectorAll('.bar-fill');

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add('active'); io.unobserve(entry.target); }
    });
  }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });
  revealEls.forEach(function(el){ io.observe(el); });

  var barIo = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var el = entry.target;
        el.style.width = el.getAttribute('data-w') + '%';
        barIo.unobserve(el);
      }
    });
  }, { threshold:0.4 });
  skillBars.forEach(function(el){ barIo.observe(el); });

  var resumeDropdown = document.getElementById('resume-dropdown');
  var resumeToggle = document.getElementById('resume-toggle');
  var resumeMenu = document.getElementById('resume-menu');

  if(RESUME_OPTIONS.length){
    var menuHtml = "";
    for(var i=0;i<RESUME_OPTIONS.length;i++){
      menuHtml += '<a href="' + RESUME_OPTIONS[i].path + '" download target="_blank" rel="noopener noreferrer">' + RESUME_OPTIONS[i].label + '</a>';
    }
    resumeMenu.innerHTML = menuHtml;
  } else {
    resumeMenu.innerHTML = '<p class="empty-note">Resumes coming soon.</p>';
  }

  resumeToggle.addEventListener('click', function(e){
    e.stopPropagation();
    var isOpen = resumeDropdown.classList.toggle('open');
    resumeToggle.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', function(){
    resumeDropdown.classList.remove('open');
    resumeToggle.setAttribute('aria-expanded', 'false');
  });
  resumeMenu.addEventListener('click', function(e){ e.stopPropagation(); });

  var toastOverlay = document.getElementById('toast-overlay');
  var toastTitle = document.getElementById('toast-title');
  var toastText = document.getElementById('toast-text');
  var toastCard = document.getElementById('toast-card');
  var toastCloseBtn = document.getElementById('toast-close');
  var toastCheckIcon = document.getElementById('toast-icon').querySelector('svg');
  var autoCloseTimer = null;
  var lastFocusedEl = null;

  function showToast(opts){
    lastFocusedEl = document.activeElement;
    toastTitle.textContent = opts.title;
    toastText.textContent = opts.text;
    toastCard.classList.toggle('toast-error', !opts.success);
    toastCheckIcon.innerHTML = opts.success
      ? '<path d="M5 13l4 4L19 7" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<path d="M6 6l12 12M18 6L6 18" stroke="#ff6b81" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    toastOverlay.classList.add('show');
    clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(closeToast, 5000);
    setTimeout(function(){ toastCloseBtn.focus(); }, 50);
  }
  function closeToast(){
    toastOverlay.classList.remove('show');
    clearTimeout(autoCloseTimer);
    if(lastFocusedEl && typeof lastFocusedEl.focus === 'function'){ lastFocusedEl.focus(); }
  }
  toastCloseBtn.addEventListener('click', closeToast);
  toastOverlay.addEventListener('click', function(e){ if(e.target === toastOverlay) closeToast(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeToast(); });

  document.querySelectorAll('.email-link').forEach(function(el){
    el.addEventListener('click', function(){
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(CONTACT_EMAIL).catch(function(){});
      }
      setTimeout(function(){
        showToast({ success:true, title:"Email Copied", text:CONTACT_EMAIL + " has been copied to your clipboard — your email app should also be opening now." });
      }, 150);
    });
  });

  var form = document.getElementById('contact-form');
  var nameEl = document.getElementById('cf-name');
  var emailEl = document.getElementById('cf-email');
  var subjectEl = document.getElementById('cf-subject');
  var messageEl = document.getElementById('cf-message');
  var submitBtn = document.getElementById('submit-btn');
  var charCount = document.getElementById('char-count');
  var turnstileErrEl = document.getElementById('err-turnstile');

  messageEl.addEventListener('input', function(){ charCount.textContent = messageEl.value.length; });

  function setFieldError(el, errId, hasError){
    var errEl = document.getElementById(errId);
    el.classList.toggle('invalid', hasError);
    el.setAttribute('aria-invalid', hasError ? 'true' : 'false');
    if(errEl) errEl.classList.toggle('show', hasError);
  }

  function validate(){
    var valid = true;
    var nameOk = nameEl.value.trim().length >= 2;
    setFieldError(nameEl, 'err-name', !nameOk);
    if(!nameOk) valid = false;

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
    setFieldError(emailEl, 'err-email', !emailOk);
    if(!emailOk) valid = false;

    var msgOk = messageEl.value.trim().length >= 10;
    setFieldError(messageEl, 'err-message', !msgOk);
    if(!msgOk) valid = false;

    if(TURNSTILE_ENABLED){
      var turnstileOk = turnstileToken.length > 0;
      turnstileErrEl.classList.toggle('show', !turnstileOk);
      if(!turnstileOk) valid = false;
    }

    return valid;
  }

  [nameEl, emailEl, messageEl].forEach(function(el){
    el.addEventListener('blur', validate);
    el.addEventListener('input', function(){ if(el.classList.contains('invalid')) validate(); });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(!validate()){
      var firstInvalid = form.querySelector('.invalid');
      if(firstInvalid) firstInvalid.focus();
      return;
    }

    var payload = {
      from_name: nameEl.value.trim(),
      reply_to: emailEl.value.trim(),
      subject: subjectEl.value.trim() || 'New message from portfolio',
      message: messageEl.value.trim(),
      to_email: CONTACT_EMAIL
    };

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    var canUseEmailJS = emailjsReady && window.emailjs && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID;

    function finish(mode){
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      if(mode === 'confirmed'){
        form.reset();
        charCount.textContent = '0';
        showToast({ success:true, title:"Message Sent Successfully", text:"Thank you for contacting me — I'll get back to you soon." });
      } else if(mode === 'fallback'){
        form.reset();
        charCount.textContent = '0';
        showToast({ success:true, title:"Opening Your Email App", text:"We couldn't confirm delivery through our server, so your email app is opening — please hit send there to reach me directly." });
      } else {
        showToast({ success:false, title:"Message Not Sent", text:"Something went wrong. Please try again or email me directly at " + CONTACT_EMAIL + "." });
      }
    }

    if(canUseEmailJS){
      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload)
        .then(function(){
          if(EMAILJS_AUTOREPLY_TEMPLATE_ID){
            window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, payload).catch(function(){});
          }
          finish('confirmed');
        })
        .catch(function(){ openMailtoFallback(payload); finish('fallback'); });
    } else {
      openMailtoFallback(payload);
      finish('fallback');
    }
  });

  function openMailtoFallback(payload){
    var subject = encodeURIComponent(payload.subject);
    var body = encodeURIComponent(payload.message + "\n\n— " + payload.from_name + " (" + payload.reply_to + ")");
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
  }

  var canvas = document.getElementById('hero-canvas');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var w, h, dpr;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth; h = canvas.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function initParticles(){
    var count = Math.min(70, Math.floor((w*h)/16000));
    particles = [];
    for(var i=0;i<count;i++){
      particles.push({ x:Math.random()*w, y:Math.random()*h, vx:(Math.random()-0.5)*0.35, vy:(Math.random()-0.5)*0.35, r:Math.random()*1.6+0.6 });
    }
  }
  function getCssVar(name){ return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  var cachedC1 = 'rgba(34,211,238,0.55)';
  var cachedC2Raw = 'rgba(167,139,250,0.2)';
  function refreshParticleColors(){
    cachedC1 = getCssVar('--particle-1') || cachedC1;
    cachedC2Raw = getCssVar('--particle-2') || cachedC2Raw;
  }
  function step(){
    ctx.clearRect(0,0,w,h);
    for(var i=0;i<particles.length;i++){
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0 || p.x > w) p.vx *= -1;
      if(p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = cachedC1; ctx.fill();
    }
    for(var a=0;a<particles.length;a++){
      for(var b=a+1;b<particles.length;b++){
        var dx = particles[a].x - particles[b].x, dy = particles[a].y - particles[b].y;
        var dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 130){
          ctx.beginPath(); ctx.moveTo(particles[a].x, particles[a].y); ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = cachedC2Raw.replace(/[\d.]+\)$/, (0.28 * (1 - dist/130)) + ')');
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
    if(!reduceMotion){ requestAnimationFrame(step); }
  }
  function startCanvas(){ resize(); initParticles(); refreshParticleColors(); if(!reduceMotion){ requestAnimationFrame(step); } else { step(); } }
  window.addEventListener('resize', function(){ resize(); initParticles(); }, { passive:true });
  startCanvas();

})();