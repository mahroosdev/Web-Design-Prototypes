const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('navLinks');
    bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
});
