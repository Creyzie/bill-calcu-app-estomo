// js/calc.js
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
    const timestamp = new Date().toISOString(); // <-- added timestamp (created_at)

    // Update UI
    document.getElementById("outDate").textContent = date;
    document.getElementById("outMonth").textContent = month;
    document.getElementById("outKwh").textContent = kwh.toFixed(2);
    document.getElementById("outCost").textContent = cost.toFixed(2);
    document.getElementById("outTotal").textContent = `₱${total.toFixed(2)}`;

    const entry = { date, month, kwh, cost, total, created_at: timestamp };

    // disable button while saving to prevent double clicks
    if (calcBtn) calcBtn.disabled = true;

    try {
      // Try Supabase (no blocking alerts)
      if (window.supabase) {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        if (user) {
          // insert with created_at so your table shows the exact time
          const { error } = await supabase.from("bills").insert({
            user_id: user.id,
            date,
            month,
            kwh,
            cost,
            total,
            created_at: timestamp
          });
          if (error) throw error;
        } else {
          // not logged in -> save locally
          saveToLocal(entry);
        }
      } else {
        saveToLocal(entry);
      }
    } catch (err) {
      console.warn("Save failed, fallback to local:", err);
      saveToLocal(entry);
    } finally {
      if (calcBtn) calcBtn.disabled = false;
    }

    if (typeof renderHistory === "function") renderHistory();
  };

  function saveToLocal(entry) {
    const history = JSON.parse(localStorage.getItem("billHistory") || "[]");
    history.unshift(entry);
    localStorage.setItem("billHistory", JSON.stringify(history.slice(0, 50)));
  }

  // click handler
  calcBtn?.addEventListener("click", () => window.calculateBill());

  // Enter key handler: prevent default and trigger calculate
  [kwhInput, costInput, monthInput].forEach(el => {
    el?.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        window.calculateBill();
      }
    });
  });
});
