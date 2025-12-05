// js/dashboard.js
// Renders history into a table; looks for tbody#historyBody or .table-container table
function renderHistory() {
  const history = (window.supabase) ? null : window.Storage.getHistory(); // if using supabase, dashboard should fetch instead
  const tbody = document.getElementById('historyBody');
  const fallbackTable = document.querySelector('.table-container table');

  if (!tbody && !fallbackTable) return;

  if (history === null && window.supabase) {
    // Supabase fetch
    (async () => {
      try {
        const { data, error } = await window.supabase.from('bills').select('*').order('id', { ascending: false }).limit(50);
        if (error) throw error;
        populateTable(data, tbody, fallbackTable);
      } catch (err) {
        console.error('Error fetching from Supabase:', err);
      }
    })();
  } else {
    // localStorage or provided array
    populateTable(history || [], tbody, fallbackTable);
  }
}

function populateTable(dataArray, tbody, fallbackTable) {
  if (tbody) {
    tbody.innerHTML = '';
    dataArray.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.date || ''}</td><td>${row.month || ''}</td><td>${row.kwh ?? ''}</td><td>₱${row.cost ?? ''}</td><td>₱${row.total ?? ''}</td>`;
      tbody.appendChild(tr);
    });
    return;
  }
  if (fallbackTable) {
    // ensure we have a tbody
    let tb = fallbackTable.querySelector('tbody') || fallbackTable.appendChild(document.createElement('tbody'));
    tb.innerHTML = '';
    dataArray.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.date || ''}</td><td>${row.month || ''}</td><td>${row.kwh ?? ''}</td><td>₱${row.cost ?? ''}</td><td>₱${row.total ?? ''}</td>`;
      tb.appendChild(tr);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // auto-run on load
  try { renderHistory(); } catch (e) { /* ignore */ }
});

// expose renderHistory
window.renderHistory = renderHistory;
