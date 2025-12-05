// js/auth.js
// Basic helpers for login/register forms. If you use Supabase, supabase-config.js should set window.supabase.
document.addEventListener('DOMContentLoaded', () => {
  // show/hide password toggle using checkbox with id="showPassword" or function togglePassword()
  const show = document.getElementById('showPassword');
  if (show) {
    show.addEventListener('change', () => {
      const pw = document.querySelectorAll('input[type="password"]');
      pw.forEach(p => p.type = show.checked ? 'text' : 'password');
    });
  }

  // Attach register/login handlers if forms exist
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm && window.supabase) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[name="email"]').value;
      const password = loginForm.querySelector('input[name="password"]').value;
      try {
        const { error } = await window.supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // redirect or refresh
        window.location.href = loginForm.dataset.redirect || '/user_dashboard.html';
      } catch (err) {
        console.error(err);
        alert('Login failed: ' + (err.message || err));
      }
    });
  }

  if (registerForm && window.supabase) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = registerForm.querySelector('input[name="email"]').value;
      const password = registerForm.querySelector('input[name="password"]').value;
      try {
        const { error } = await window.supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Registration successful. Check your email for confirmation.');
        window.location.href = registerForm.dataset.redirect || '/login.html';
      } catch (err) {
        console.error(err);
        alert('Registration failed: ' + (err.message || err));
      }
    });
  }
});
