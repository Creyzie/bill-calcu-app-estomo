// js/dashboard.js
// Fetches and renders bill history from Supabase or localStorage

async function fetchFromSupabase() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    // If no user → fallback to local
    if (!user) {
      console.warn("No Supabase user logged in. Using localStorage instead.");
      return null;
    }

    // Fetch bills for this user
    const { data, error } = await supabase
      .from("bills")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })  // <-- FIXED HERE
      .limit(50);

    if (error) throw error;

    return data;

  } catch (err) {
    console.error("Error fetching Supabase data:", err);
    return null;
  }
}

function populateTable(dataArray) {
  const tbody = document.getElementById("historyBody");
  const fallbackTable = document.querySelector(".table-container table");

  if (tbody) {
    tbody.innerHTML = "";
    dataArray.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.date || ""}</td>
        <td>${row.month || ""}</td>
        <td>${row.kwh ?? ""}</td>
        <td>₱${row.cost ?? ""}</td>
        <td>₱${row.total ?? ""}</td>
      `;
      tbody.appendChild(tr);
    });
    return;
  }

  if (fallbackTable) {
    let tb = fallbackTable.querySelector("tbody") || fallbackTable.appendChild(document.createElement("tbody"));
    tb.innerHTML = "";
    dataArray.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.date || ""}</td>
        <td>${row.month || ""}</td>
        <td>${row.kwh ?? ""}</td>
        <td>₱${row.cost ?? ""}</td>
        <td>₱${row.total ?? ""}</td>
      `;
      tb.appendChild(tr);
    });
  }
}

async function renderHistory() {
  let bills = null;

  if (window.supabase) {
    bills = await fetchFromSupabase();
  }

  if (!bills) {
    bills = JSON.parse(localStorage.getItem("billHistory") || "[]");
  }

  populateTable(bills);
}

document.addEventListener("DOMContentLoaded", () => {
  renderHistory();
});

window.renderHistory = renderHistory;
