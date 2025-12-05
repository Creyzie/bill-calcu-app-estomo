// js/menu.js
// Toggle a side menu with id="sideMenu" and a button with id="menu-btn"
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const sideMenu = document.getElementById('sideMenu');

  if (!menuBtn || !sideMenu) return;

  menuBtn.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
    // optional: toggle aria-expanded for accessibility
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
  });
});
