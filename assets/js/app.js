
(function(){
  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav){
    toggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if (e.isIntersecting) e.target.classList.add('revealed'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Slider
  const slider = document.querySelector('[data-slider]');
  if (slider){
    const slides = [...slider.querySelectorAll('.slide')];
    const dotsWrap = slider.querySelector('[data-dots]');
    let i = 0, timer = null;
    function show(idx){
      slides.forEach((s,k)=> s.classList.toggle('active', k===idx));
      [...dotsWrap.children].forEach((d,k)=> d.classList.toggle('active', k===idx));
      i = idx;
    }
    function next(){ show((i+1)%slides.length); }
    function prev(){ show((i-1+slides.length)%slides.length); }
    // dots
    slides.forEach((_,k)=>{
      const b = document.createElement('button');
      b.addEventListener('click', ()=> show(k));
      dotsWrap.appendChild(b);
    });
    show(0);
    slider.querySelector('.next').addEventListener('click', next);
    slider.querySelector('.prev').addEventListener('click', prev);
    timer = setInterval(next, 5000);
    slider.addEventListener('mouseenter', ()=> clearInterval(timer));
    slider.addEventListener('mouseleave', ()=> timer = setInterval(next, 5000));
  }

  // Counter animation
  function animateCount(el){
    const target = Number(el.getAttribute('data-count')||0);
    const dur = 1400; const start = performance.now();
    function frame(ts){
      const p = Math.min(1, (ts - start) / dur);
      const val = Math.floor(target * (0.1 + 0.9 * p*p));
      el.textContent = val;
      if (p<1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const countersIo = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        animateCount(e.target);
        countersIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.count').forEach(el=> countersIo.observe(el));

  // Chatbot open/close
  document.querySelectorAll('[data-open-chat]').forEach(btn=> btn.addEventListener('click', openChat));
  const chat = document.getElementById('chatbot');
  const chatBody = document.getElementById('chatBody');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatClose = document.querySelector('.chat-close');
  function openChat(){ if (!chat) return; chat.setAttribute('aria-hidden','false'); chatInput && chatInput.focus(); }
  function closeChat(){ chat && chat.setAttribute('aria-hidden','true'); }
  chatClose && chatClose.addEventListener('click', closeChat);

  // Chat flow
  let lead = { name:'', email:'', company:'', need:'' };
  let step = 0;
  function addMsg(text, who='bot'){ const div = document.createElement('div'); div.className='msg '+who; div.textContent=text; chatBody.appendChild(div); chatBody.scrollTop = chatBody.scrollHeight; }
  function isEmail(x){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x); }
  function nextPrompt(){
    if (step===0) addMsg('Great to meet you, ' + lead.name + '! What is your email?');
    else if (step===1) addMsg('Company (optional)? If none, type "skip".');
    else if (step===2) addMsg('Briefly describe what you need.');
    else if (step===3){ addMsg(`Confirm: Name=${lead.name}, Email=${lead.email}, Company=${lead.company||'-'}, Need=${lead.need}. Send now? (yes/no)`); }
  }
  chatForm && chatForm.addEventListener('submit', function(e){
    e.preventDefault();
    const val = (chatInput.value||'').trim();
    if (!val) return;
    addMsg(val,'user'); chatInput.value='';
    if (step===0){ lead.name=val; addMsg('Nice!'); step=1; nextPrompt(); }
    else if (step===1){ if (!isEmail(val)){ addMsg('Please enter a valid email.'); return;} lead.email=val; step=2; nextPrompt(); }
    else if (step===2){ if (val.toLowerCase()!=='skip') lead.company=val; step=3; nextPrompt(); }
    else if (step===3){ lead.need=val; step=4; nextPrompt(); }
    else if (step===4){ if (val.toLowerCase().startsWith('y')){ sendLead(lead,'chatbot'); } else { addMsg('Okay, not sending.'); } }
  });

  function toast(msg){ const t=document.getElementById('toast'); if(!t) return; t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 2500); }

  // Contact form async
  const contactForm = document.getElementById('contactForm');
  if (contactForm){
    contactForm.addEventListener('submit', async function(e){
      e.preventDefault();
      const fd = new FormData(contactForm);
      const payload = Object.fromEntries(fd.entries());
      try{ await sendLead(payload, 'contact-form'); contactForm.reset(); toast('Sent! We will reply within 1 business day.'); }
      catch(err){ toast('Failed to send. Try again or use WhatsApp.'); }
    });
  }

  // Lead sending: choose ONE method and uncomment when you have keys
  async function sendLead(data, source){
    const body = { name: data.name||'', email: data.email||'', company: data.company||'', message: data.need||data.message||'', source };
    // METHOD A (Formspree): replace endpoint and uncomment
    /*
    const res = await fetch('https://formspree.io/f/your-id', {
      method:'POST', headers:{ 'Accept':'application/json', 'Content-Type':'application/json' }, body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Formspree error');
    */
    // METHOD B (EmailJS): include SDK and uncomment (also add keys)
    /*
    emailjs.init('PUBLIC_KEY');
    const res = await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', body);
    if (!res) throw new Error('EmailJS error');
    */
    // METHOD C (Serverless): implement /api/contact and uncomment
    /*
    const res = await fetch('/api/contact', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error('Serverless error');
    */
    console.log('Lead captured (demo):', body);
    toast('Lead captured (demo). Wire EmailJS/Formspree to actually send.');
    addMsg && addMsg('Thanks! We\'ve captured your details.', 'bot');
  }
})();
