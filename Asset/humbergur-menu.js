const hamburgerMenu = document.querySelector(".hamburger-menu");
const navLinks = document.querySelector(".nav-links");

hamburgerMenu.addEventListener('click', () => {
  navLinks.classList.toggle('hidden');
  navLinks.classList.toggle('mobile-open');
});

document.addEventListener('click', (e) => {
  if (!hamburgerMenu.contains(e.target) && !navLinks.contains(e.target)) {
    navLinks.classList.add('hidden');
    navLinks.classList.remove('mobile-open');
  }
});
