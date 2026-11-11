'use strict';

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-navigation');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  mobileMenu.hidden = true;
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mobileMenu.hidden = isOpen;
});

mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const filterButtons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-status]');
const counter = document.querySelector('#filter-result');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;
    filterButtons.forEach(control => {
      const active = control === button;
      control.classList.toggle('is-active', active);
      control.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => {
      const visible = filter === 'todos' || card.dataset.status === filter;
      card.hidden = !visible;
      if (visible) visibleCount++;
    });
    counter.textContent = `Exibindo ${visibleCount} ${visibleCount === 1 ? 'projeto' : 'projetos'}`;
  });
});

const progress = document.querySelector('#reading-progress');
let scrollPending = false;
const updateProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progress.style.width = `${Math.max(0, Math.min(100, ratio * 100))}%`;
  scrollPending = false;
};
window.addEventListener('scroll', () => {
  if (!scrollPending) {
    scrollPending = true;
    window.requestAnimationFrame(updateProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const navLinks = Array.from(document.querySelectorAll('.desktop-nav a'));
  const observedSections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
  observedSections.forEach(section => observer.observe(section));
}
