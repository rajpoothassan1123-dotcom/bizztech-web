// Submits Web3Forms forms in the background and shows a confirmation message
// instead of leaving the page. Falls back to a normal submit if JS fails.
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
      msg.textContent = form.dataset.success || 'Thank you! We received your message.';
      msg.classList.remove('text-red-600');
      msg.classList.add('text-green-700');
      form.reset();
    } catch (err) {
      msg.textContent = 'Sorry, something went wrong. Please email us at info@bizztech.online.';
      msg.classList.remove('text-green-700');
      msg.classList.add('text-red-600');
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = btnText; }
    }
  });
});
