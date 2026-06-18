// ── Dropdown navigation ──
document.querySelectorAll('.nav-dropdown-toggle').forEach((toggle) => {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = toggle.closest('.nav-dropdown');
    const isOpen = dropdown.classList.contains('open');

    // Close all open dropdowns first
    document.querySelectorAll('.nav-dropdown.open').forEach((d) => {
      d.classList.remove('open');
      d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      dropdown.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });
});

// Close dropdowns on outside click
document.addEventListener('click', () => {
  document.querySelectorAll('.nav-dropdown.open').forEach((d) => {
    d.classList.remove('open');
    d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
  });
});

// Close dropdowns on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav-dropdown.open').forEach((d) => {
      d.classList.remove('open');
      d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
    });
  }
});

// ── Mobile hamburger toggle ──
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mainNav.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav when a plain nav link is clicked
  mainNav.querySelectorAll('a.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile nav when a dropdown item is clicked
  mainNav.querySelectorAll('.nav-dropdown-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Footer greeting (time-based) ──
(function () {
  const el = document.getElementById('footerGreeting');
  if (!el) return;
  const hour = new Date().getHours();
  let greeting;
  if (hour >= 0 && hour < 12) {
    greeting = 'Good Morning ☀️';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good Afternoon 🌤️';
  } else {
    greeting = 'Good Evening 🌙';
  }
  el.textContent = 'MFA Ambassadors — ' + greeting;
})();

// ── History timeline "Read more" toggle ──
document.querySelectorAll('.history-section .timeline-item').forEach((item) => {
  const p = item.querySelector('p');
  if (!p) return;
  const btn = document.createElement('button');
  btn.className = 'timeline-readmore';
  btn.textContent = 'Read more';
  p.after(btn);
  btn.addEventListener('click', () => {
    const expanded = item.classList.toggle('expanded');
    btn.textContent = expanded ? 'Show less' : 'Read more';
  });
});

// Contact form is handled by inline script in contact.html
