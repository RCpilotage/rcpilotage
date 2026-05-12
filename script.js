if (location.protocol !== 'https:') {
    location.replace('https://' + location.hostname + location.pathname + location.search);
  }



const PAGES = ['accueil','problemes','services','methode','contact'];
let current = 'accueil';
let isAnimating = false;

function goTo(target) {
  if (target === current || isAnimating) return;
  isAnimating = true;

  const fromEl = document.getElementById('page-' + current);
  const toEl = document.getElementById('page-' + target);
  const fromIdx = PAGES.indexOf(current);
  const toIdx = PAGES.indexOf(target);
  const dir = toIdx > fromIdx ? 1 : -1;

  fromEl.classList.remove('active');
  fromEl.classList.add('exit-left');
  if (dir < 0) fromEl.style.transform = 'translateX(60px)';
  else fromEl.style.transform = '';

  toEl.style.transform = dir > 0 ? 'translateX(60px)' : 'translateX(-60px)';
  toEl.style.opacity = '0';
  toEl.style.pointerEvents = 'none';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toEl.style.transform = '';
      toEl.style.opacity = '';
      toEl.style.pointerEvents = '';
      toEl.classList.add('active');
      toEl.scrollTop = 0;
    });
  });

  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.target === target);
  });

  document.querySelectorAll('.pdot').forEach(d => {
    d.classList.toggle('active', d.dataset.for === target);
  });

  updateIndicator(target);
  current = target;

  setTimeout(() => {
    fromEl.classList.remove('exit-left');
    fromEl.style.transform = '';
    isAnimating = false;
  }, 360);
}

function updateIndicator(target) {
  const tabs = document.querySelectorAll('.tab');
  const indicator = document.getElementById('tabIndicator');
  tabs.forEach(t => {
    if (t.dataset.target === target) {
      indicator.style.width = t.offsetWidth + 'px';
      indicator.style.left = t.offsetLeft + 'px';
    }
  });
}

window.addEventListener('load', () => updateIndicator('accueil'));
window.addEventListener('resize', () => updateIndicator(current));

// Swipe
let touchStartX = 0, touchStartY = 0;
const container = document.getElementById('pagesContainer');
container.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
container.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    const idx = PAGES.indexOf(current);
    if (dx < 0 && idx < PAGES.length - 1) goTo(PAGES[idx + 1]);
    else if (dx > 0 && idx > 0) goTo(PAGES[idx - 1]);
  }
}, { passive: true });

// Case RGPD
function toggleConsent() {
  const cb = document.getElementById('consentBox');
  const box = document.getElementById('customCheck');
  cb.checked = !cb.checked;
  if (cb.checked) {
    box.style.background = '#1D5F8A';
    box.style.borderColor = '#1D5F8A';
    box.innerHTML = '<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><polyline points="1,4.5 4,7.5 10,1.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  } else {
    box.style.background = 'transparent';
    box.style.borderColor = 'rgba(29,95,138,0.6)';
    box.innerHTML = '';
  }
}

// Formulaire
document.getElementById('contactForm').addEventListener('submit', function(e) {
  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Envoi en cours...';
  btn.disabled = true;
});

function validateAndSubmit() {
  let valid = true;
  
  // Check sujet checkboxes
  const sujets = document.querySelectorAll('input[name="sujet"]:checked');
  const sujetError = document.getElementById('sujetError');
  if (sujets.length === 0) {
    sujetError.style.display = 'block';
    valid = false;
  } else {
    sujetError.style.display = 'none';
  }
  
  // Check consent
  const consent = document.getElementById('consentBox');
  const consentError = document.getElementById('consentError');
  if (!consent.checked) {
    consentError.style.display = 'block';
    valid = false;
  } else {
    consentError.style.display = 'none';
  }
  
  if (valid) {
    document.getElementById('contactForm').submit();
  }
}