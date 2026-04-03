const themeBtn = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

themeBtn.addEventListener('click', () => {
    const html = document.documentElement;    
    const isDark = html.dataset.theme === 'dark';
    
    html.dataset.theme = isDark ? 'light' : 'dark';
    
    if (isDark) {
        themeIcon.classList.replace('bi-sun', 'bi-moon');
    }else{
      themeIcon.classList.replace('bi-moon', 'bi-sun');
    }
});
  const langBtn = document.getElementById('langToggle');
  let currentLang = 'fr';
  function applyLang(lang){
    currentLang = lang;
    document.documentElement.dataset.lang = lang;
    langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
    document.querySelectorAll('[data-fr]').forEach(el=>{
      const txt = el.dataset[lang];
      if(txt) el.innerHTML = txt;
    });
  }
  langBtn.addEventListener('click',()=> applyLang(currentLang==='fr'?'en':'fr'));

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        e.target.querySelectorAll('.skill-fill').forEach(bar=>bar.classList.add('animated'));
      }
    });
  },{threshold:0.12});
  document.querySelectorAll('.reveal,.tl-item').forEach(el=>observer.observe(el));

  const skillsSection = document.getElementById('skills');
  const skillObserver = new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      document.querySelectorAll('.skill-fill').forEach(bar=>bar.classList.add('animated'));
    }
  },{threshold:0.1});
  skillObserver.observe(skillsSection);

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll',()=>{
    let current='';
    sections.forEach(s=>{ if(window.scrollY >= s.offsetTop-200) current=s.id; });
    navLinks.forEach(a=>{ a.style.color = a.getAttribute('href')==='#'+current ? 'var(--accent)' : ''; });
  });

const CONFIG = {
    EMAILJS_SERVICE: 'service_melissa',
    EMAILJS_TEMPLATE: 'template_melissa',
    EMAILJS_PUBLIC_KEY: 'ZxSxHEvwJC7MGv_LV', 
    RECEIVER_NAME: 'Melissa'
};


const form = document.querySelector('#contact form');
const btn  = form.querySelector('.btn-primary');

const messages = {
  fr: {
    empty:   'Veuillez remplir tous les champs.',
    email:   'Adresse email invalide.',
    success: 'Merci pour votre message ! Je vous répondrai bientôt. ',
    error:   'Envoi échoué. Réessayez ou contactez-moi directement.',
    sending: 'Envoi...',
    send:    'Envoyer le message',
  },
  en: {
    empty:   'Please fill in all fields.',
    email:   'Invalid email address.',
    success: 'Thank you for your message! I\'ll get back to you soon. ',
    error:   'Send failed. Try again or contact me directly.',
    sending: 'Sending...',
    send:    'Send message',
  }
};

function getLang() {
  return document.documentElement.dataset.lang || 'fr';
}

function setError(input, msg) {
  clearError(input);
  input.style.borderColor = '#f87171';
  const err = document.createElement('span');
  err.className = 'form-error';
  err.style.cssText = 'font-size:0.68rem;color:#f87171;margin-top:0.3rem;display:block;letter-spacing:0.04em;';
  err.textContent = msg;
  input.insertAdjacentElement('afterend', err);
}

function clearError(input) {
  input.style.borderColor = '';
  const next = input.nextElementSibling;
  if (next && next.classList.contains('form-error')) next.remove();
}

function showBanner(msg, isError = false) {
  removeSuccess();
  const banner = document.createElement('div');
  banner.id = 'form-success';
  banner.style.cssText = `
    background: ${isError ? 'rgba(248,113,113,0.1)' : 'rgba(124,111,247,0.12)'};
    border: 1px solid ${isError ? '#f87171' : 'var(--accent)'};
    border-radius: var(--radius-sm);
    padding: 1rem 1.2rem;
    font-size: 0.82rem;
    color: ${isError ? '#f87171' : 'var(--accent3)'};
    margin-bottom: 1rem;
    letter-spacing: 0.03em;
    animation: fadeUp 0.5s ease forwards;
  `;
  banner.textContent = msg;
  form.insertAdjacentElement('beforebegin', banner);
  setTimeout(removeSuccess, 6000);
}

function removeSuccess() {
  const old = document.getElementById('form-success');
  if (old) old.remove();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const lang  = getLang();
  const m     = messages[lang];
  const name  = form.querySelector('input[type="text"]');
  const email = form.querySelector('input[type="email"]');
  const msg   = form.querySelector('textarea');
  let valid   = true;

  [name, email, msg].forEach(clearError);
  removeSuccess();

  if (!name.value.trim())  { setError(name, m.empty);  valid = false; }
  if (!email.value.trim()) {
    setError(email, m.empty); valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, m.email); valid = false;
  }
  if (!msg.value.trim())   { setError(msg, m.empty);   valid = false; }
  if (!valid) return;

  btn.disabled      = true;
  btn.textContent   = m.sending;
  btn.style.opacity = '0.7';

  
  emailjs.send(CONFIG.EMAILJS_SERVICE, CONFIG.EMAILJS_TEMPLATE, {
    from_name:  name.value.trim(),
    from_email: email.value.trim(),
    message:    msg.value.trim(),
    to_name:    CONFIG.RECEIVER_NAME,
  })
  .then(() => {
    showBanner(m.success);
    form.reset();
  })
  .catch((err) => {
    console.error('EmailJS error:', err);
    showBanner(m.error, true);
  })
  .finally(() => {
    btn.disabled      = false;
    btn.textContent   = m.send;
    btn.style.opacity = '';
  });
});

form.querySelectorAll('.form-control').forEach(el => {
  el.addEventListener('input', () => clearError(el));
});