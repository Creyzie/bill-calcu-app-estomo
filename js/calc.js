// js/calc.js
// Handles bill calculation and saving to localStorage (or Supabase if configured)
document.addEventListener('DOMContentLoaded', () => {
  const kwhInput = document.getElementById('kwh');
  const costInput = document.getElementById('cost');
  const monthInput = document.getElementById('month');
  const calcBtn = document.getElementById('calculateBtn');

  function readInputs() {
    const kwh = parseFloat(kwhInput?.value) || 0;
    const cost = parseFloat(costInput?.value) || 0;
    const month = (monthInput?.value || '').toString();
    return { kwh, cost, month };
  }

  window.calculateBill = async function calculateBill() {
    const { kwh, cost, month } = readInputs();
    const total = +(kwh * cost).toFixed(2);
    const date = new Date().toLocaleDateString();

    // Update UI if elements exist
    const outDate = document.getElementById('outDate');
    const outMonth = document.getElementById('outMonth');
    const outKwh = document.getElementById('outKwh');
    const outCost = document.getElementById('outCost');
    const outTotal = document.getElementById('outTotal');

    if (outDate) outDate.textContent = date;
    if (outMonth) outMonth.textContent = month;
    if (outKwh) outKwh.textContent = kwh.toFixed(2);
    if (outCost) outCost.textContent = cost.toFixed(2);
    if (outTotal) outTotal.textContent = `₱${total.toFixed(2)}`;

    const entry = { date, month, kwh: +kwh.toFixed(2), cost: +cost.toFixed(2), total };

    // If Supabase client is present (supabase from supabase-config.js), try saving there
    if (window.supabase) {
      try {
        // assumes a table named 'bills' with columns: user_id (optional), date, month, kwh, cost, total
        const { error } = await window.supabase.from('bills').insert([entry]);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase save failed, falling back to localStorage:', err);
        saveToLocal(entry);
      }
    } else {
      saveToLocal(entry);
    }

    // re-render history if function exists
    if (typeof renderHistory === 'function') renderHistory();
  };

  function saveToLocal(entry) {
    const history = JSON.parse(localStorage.getItem('billHistory') || '[]');
    history.unshift(entry);
    localStorage.setItem('billHistory', JSON.stringify(history.slice(0, 50)));
  }

  // bind calculate button and Enter key
  if (calcBtn) calcBtn.addEventListener('click', () => window.calculateBill());
  [kwhInput, costInput, monthInput].forEach(el => {
    if (!el) return;
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') window.calculateBill();
    });
  });
});
