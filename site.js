// Mobile menu
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  mobileMenu.querySelectorAll('[data-close-menu]').forEach((a) => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));
}

// Forms post to Web3Forms in the background so visitors stay on the page.
// Without JavaScript the form still submits normally.
document.querySelectorAll('form[data-web3form]').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }

    let msg = form.parentElement.querySelector('.form-status');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'form-status mt-4 text-sm font-medium';
      msg.setAttribute('role', 'status');
      form.insertAdjacentElement('afterend', msg);
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Request failed');
      msg.textContent = form.dataset.success || 'Thank you. We received your message.';
      msg.classList.remove('text-red-600');
      msg.classList.add('text-green-700');
      form.reset();
    } catch {
      msg.textContent = "Your message didn't send. Check your connection and try again, or email info@bizztech.online.";
      msg.classList.remove('text-green-700');
      msg.classList.add('text-red-600');
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = btnText; }
    }
  });
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Statement text darkens word by word as it scrolls into view
document.querySelectorAll('.reveal-words').forEach((el) => {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span>${w}</span>`).join(' ');
  const spans = el.querySelectorAll('span');
  if (reduceMotion) return;
  const update = () => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const n = Math.round(progress * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
});

// Fade-up on scroll
const fadeEls = document.querySelectorAll('.fade-up');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  fadeEls.forEach((el) => io.observe(el));
} else {
  fadeEls.forEach((el) => el.classList.add('in'));
}

// Quick answers
const qaAnswer = document.getElementById('qa-answer');
document.querySelectorAll('.qa-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.qa-chip').forEach((c) => c.classList.remove('bg-white/20', 'border-orange-400'));
    chip.classList.add('bg-white/20', 'border-orange-400');
    qaAnswer.textContent = chip.dataset.answer;
  });
});
const qaForm = document.getElementById('qa-form');
if (qaForm) {
  qaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('qa-input').value.trim();
    const msg = document.getElementById('f-msg');
    if (q && msg) msg.value = q;
    qaAnswer.textContent = q ? "Thanks. Add your contact details below and we'll reply with an answer and prices." : 'Type your question first.';
    if (q) document.getElementById('contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

// "Ask for price" on product cards fills in the enquiry form
document.querySelectorAll('.ask-price').forEach((btn) => {
  btn.addEventListener('click', () => {
    const msg = document.getElementById('f-msg');
    if (msg) msg.value = `Please send me your price for the ${btn.dataset.product}. Quantity: `;
  });
});
